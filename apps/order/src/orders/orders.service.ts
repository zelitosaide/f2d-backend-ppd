import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
// import { lastValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { NATS_CLIENT } from "../constants";
import { Order } from "./entities/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaginationQueryDto } from "./common/dto/pagination-query.dto";
import { OrderStatus, UpdateOrderStatusEventDto } from "@app/orders";
import { OrderEventType } from "@app/orders/enum/order-event-type.enum";
import { GroupedItems } from "../carts/types/grouped-items.type";
import { Dish } from "../carts/types/dish.type";
// import { Cart } from "../carts/entities/cart.entity";
// import CreateCartDto from "../carts/dto/create-cart.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @Inject(NATS_CLIENT)
    private readonly natsClient: ClientProxy,
  ) {}
  private readonly logger = new Logger(OrdersService.name);

  async create(createOrderDto: CreateOrderDto) {
    // 1. Criar order
    const order = this.ordersRepository.create(createOrderDto);
    const savedOrder = await this.ordersRepository.save(order);

    const event: UpdateOrderStatusEventDto = {
      event: OrderEventType.ORDER_INITIATED,
      timestamp: new Date().toISOString(),
      data: {
        orderId: savedOrder.id,
        status: OrderStatus.INITIATED,
        amount: savedOrder.total,
        userId: savedOrder.user_id,
      },
    };

    // 2. Chamar payment-service
    this.natsClient.emit(OrderEventType.ORDER_INITIATED, event);

    return savedOrder;
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Order[]> {
    const { limit, offset } = paginationQuery;
    return this.ordersRepository.find({
      relations: { items: true, address: true },
      skip: offset,
      take: limit,
    });
  }

  async findMany(userId: number): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      where: { user_id: userId },
      relations: { items: true, address: true },
    });
    if (orders.length === 0) {
      throw new NotFoundException(`orders with userID ${userId} not found`);
    }
    return orders;
  }

  async findOrdersDetails(userId: number): Promise<GroupedItems[]> {
    const orders = await this.findMany(userId);

    if (orders.length === 0) {
      throw new NotFoundException(`orders with userID ${userId} not found`);
    }

    // 1. Flatten todos os items de todos os orders
    const allItems = orders.flatMap((order) => order.items);

    // 2. Agrupar por restaurant_id
    const grouped = new Map<number, Dish[]>();

    for (const item of allItems) {
      const list = grouped.get(item.restaurant_id) || [];
      list.push(item);
      grouped.set(item.restaurant_id, list);
    }

    // 3. Buscar info dos restaurantes únicos
    const restaurantIds = [...grouped.keys()];

    const restaurantInfos = await Promise.all(
      restaurantIds.map((id) =>
        fetch(`http://restaurant:4003/restaurants/${id}`).then((res) =>
          res.json(),
        ),
      ),
    );

    const restaurantMap = new Map(restaurantInfos.map((r) => [r.id, r]));

    // 4. Montar resultado final
    const result: GroupedItems[] = restaurantIds.map((restaurantId) => {
      const items = grouped.get(restaurantId)!;

      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const restaurant = restaurantMap.get(restaurantId);

      return {
        restaurant_id: restaurantId,
        restaurant_name: restaurant?.name ?? "",
        restaurant_description: restaurant?.description ?? "",
        restaurant_cover_image_url: restaurant?.cover_image_url ?? "",
        restaurant_logo_url: restaurant?.logo_url ?? "",
        items,
        subtotal,
      };
    });

    return result;
  }

  async findOne(orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: { items: true, address: true },
    });
    if (!order) {
      throw new NotFoundException(`order with orderId ${orderId} not found`);
    }
    return order;
  }

  async handleOrderStatusUpdated(
    id: number,
    updateOrderStatusEventDto: UpdateOrderStatusEventDto,
  ) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { items: true, address: true },
    });

    if (!order) {
      this.logger.error(`Order #${id} not found`);
      return;
    }

    // update fields directly instead of using preload
    order.status = updateOrderStatusEventDto.data.status;

    if (updateOrderStatusEventDto.data.status === OrderStatus.PAID) {
      const event: UpdateOrderStatusEventDto = {
        event: OrderEventType.ORDER_CREATED,
        timestamp: new Date().toISOString(),
        data: {
          orderId: id,
          status: OrderStatus.CREATED,
          amount: order.total,
          userId: order.user_id,
          ...(order.address ? { address: order.address } : {}),
        },
      };
      this.natsClient.emit(OrderEventType.ORDER_CREATED, event);
    }

    return this.ordersRepository.save(order);
  }
}

import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
// import { lastValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { NATS_CLIENT } from "../constants";
import { Order } from "./entities/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  PaginationQueryDto,
  PaymentStatus,
  EventDto,
  OrderStatus,
} from "libs/common/src";
import { EventType } from "libs/common/src/enums/event-type.enum";
import { GroupedItems } from "../carts/types/grouped-items.type";
import { Dish } from "../carts/types/dish.type";
import { CreateOrderV2Dto } from "./dto/v2/create-order-v2.dto";
import { OrderV2 } from "./entities/v2/order-v2.entity";
// import { Cart } from "../carts/entities/cart.entity";
// import CreateCartDto from "../carts/dto/create-cart.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderV2)
    private readonly ordersV2Repository: Repository<OrderV2>,
    @Inject(NATS_CLIENT)
    private readonly natsClient: ClientProxy,
  ) {}
  private readonly logger = new Logger(OrdersService.name);

  private emitOrderEvent(type: EventType, order: OrderV2) {
    const event: EventDto = {
      event_type: type,
      timestamp: new Date().toISOString(),
      source: OrdersService.name,
      data: order,
    };
    this.natsClient.emit(type, event);
  }

  private async updateOrderStatus(order: OrderV2, status: OrderStatus) {
    order.status = status;
    return this.ordersV2Repository.save(order);
  }

  private async createPayment(payload: {
    amount: number;
    method: string;
    user_id: number;
    order_id: number;
    phone_number: string;
  }) {
    const res = await fetch(`http://payment:4002/payments/v2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // if (!res.ok) {
    //   throw new Error(`Payment service error: ${res.status}`);
    // }
    return res.json();
  }

  // V2 ----------------------------------------------------------------------------------------------
  async createV2(createOrderV2Dto: CreateOrderV2Dto): Promise<OrderV2> {
    const newOrder = this.ordersV2Repository.create(createOrderV2Dto);
    const order = await this.ordersV2Repository.save(newOrder);

    const payment = await this.createPayment({
      amount: order.subtotal,
      method: order.payment.method,
      user_id: order.user_id,
      order_id: order.id,
      phone_number: order.payment.phone_number,
    });

    if (payment.status === PaymentStatus.PAID) {
      const updated = await this.updateOrderStatus(order, OrderStatus.CREATED);
      this.emitOrderEvent(EventType.ORDER_CREATED, updated);
      return updated;
    }

    if (payment.status === PaymentStatus.CANCELLED) {
      const updated = await this.updateOrderStatus(
        order,
        OrderStatus.CANCELLED,
      );
      this.emitOrderEvent(EventType.ORDER_CANCELLED, updated);
      return updated;
    }

    if (
      payment.status === PaymentStatus.FAILED ||
      payment.status === PaymentStatus.TIMEOUT
    ) {
      const updated = await this.updateOrderStatus(order, OrderStatus.FAILED);
      this.emitOrderEvent(EventType.ORDER_FAILED, updated);
      return updated;
    }

    return order;
  }

  async findAllV2(paginationQuery: PaginationQueryDto): Promise<OrderV2[]> {
    const { limit, offset } = paginationQuery;
    return this.ordersV2Repository.find({
      relations: { items: true, address: true, payment: true },
      skip: offset,
      take: limit,
    });
  }

  async findManyV2(userId: number): Promise<OrderV2[]> {
    const orders = await this.ordersV2Repository.find({
      where: { user_id: userId },
      relations: { items: true, address: true, payment: true },
    });
    if (orders.length === 0) {
      throw new NotFoundException(`orders with userID ${userId} not found`);
    }
    return orders;
  }

  async updateOrderStatusV2(
    orderId: number,
    eventDto: EventDto,
  ): Promise<OrderV2> {
    const { status } = eventDto.data;

    const order = await this.ordersV2Repository.findOne({
      where: { id: orderId },
      relations: { items: true, address: true, payment: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.status = status;
    const updatedOrder = await this.ordersV2Repository.save(order);

    return updatedOrder;
  }

  // -------------------------------------------------------------------------------------------------

  // async create(createOrderDto: CreateOrderDto) {
  //   // 1. Criar order
  //   const order = this.ordersRepository.create(createOrderDto);
  //   const savedOrder = await this.ordersRepository.save(order);

  //   const event: EventDto = {
  //     event_type: EventType.ORDER_INITIATED,
  //     timestamp: new Date().toISOString(),
  //     source: OrdersService.name,
  //     data: {
  //       orderId: savedOrder.id,
  //       amount: savedOrder.total,
  //       userId: savedOrder.user_id,
  //     },
  //   };

  //   // 2. Chamar payment-service
  //   // this.natsClient.emit(OrderEventType.ORDER_INITIATED, event);

  //   return savedOrder;
  // }

  // async findAll(paginationQuery: PaginationQueryDto): Promise<Order[]> {
  //   const { limit, offset } = paginationQuery;
  //   return this.ordersRepository.find({
  //     relations: { items: true, address: true },
  //     skip: offset,
  //     take: limit,
  //   });
  // }

  // async findMany(userId: number): Promise<Order[]> {
  //   const orders = await this.ordersRepository.find({
  //     where: { user_id: userId },
  //     relations: { items: true, address: true },
  //   });
  //   if (orders.length === 0) {
  //     throw new NotFoundException(`orders with userID ${userId} not found`);
  //   }
  //   return orders;
  // }

  // async findOrdersDetails(userId: number): Promise<GroupedItems[]> {
  //   const orders = await this.findMany(userId);

  //   if (orders.length === 0) {
  //     throw new NotFoundException(`orders with userID ${userId} not found`);
  //   }

  //   // 1. Flatten todos os items de todos os orders
  //   const allItems = orders.flatMap((order) => order.items);

  //   // 2. Agrupar por restaurant_id
  //   const grouped = new Map<number, Dish[]>();

  //   for (const item of allItems) {
  //     const list = grouped.get(item.restaurant_id) || [];
  //     list.push(item);
  //     grouped.set(item.restaurant_id, list);
  //   }

  //   // 3. Buscar info dos restaurantes únicos
  //   const restaurantIds = [...grouped.keys()];

  //   const restaurantInfos = await Promise.all(
  //     restaurantIds.map((id) =>
  //       fetch(`http://restaurant:4003/restaurants/${id}`).then((res) =>
  //         res.json(),
  //       ),
  //     ),
  //   );

  //   const restaurantMap = new Map(restaurantInfos.map((r) => [r.id, r]));

  //   // 4. Montar resultado final
  //   const result: GroupedItems[] = restaurantIds.map((restaurantId) => {
  //     const items = grouped.get(restaurantId)!;

  //     const subtotal = items.reduce(
  //       (sum, item) => sum + item.price * item.quantity,
  //       0,
  //     );

  //     const restaurant = restaurantMap.get(restaurantId);

  //     const cleanItems = items.map((item) => ({
  //       dish_id: item.dish_id,
  //       dish_name: item.dish_name,
  //       dish_description: item.dish_description,
  //       dish_image_url: item.dish_image_url,
  //       price: item.price,
  //       quantity: item.quantity,
  //     }));

  //     return {
  //       restaurant_id: restaurantId,
  //       restaurant_name: restaurant?.name ?? "",
  //       restaurant_description: restaurant?.description ?? "",
  //       restaurant_cover_image_url: restaurant?.cover_image_url ?? "",
  //       restaurant_logo_url: restaurant?.logo_url ?? "",
  //       items: cleanItems,
  //       subtotal,
  //     };
  //   });

  //   return result;
  // }

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
}

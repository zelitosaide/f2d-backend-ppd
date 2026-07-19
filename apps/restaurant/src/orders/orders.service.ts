import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { Order } from "./entities/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientProxy } from "@nestjs/microservices";
import { NATS_CLIENT } from "../constants";
import { EventDto, PaginationQueryDto, wait } from "@app/orders";
import { EventType } from "@app/orders/enums/event-type.enum";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderProjectionRepository: Repository<Order>,
    @Inject(NATS_CLIENT)
    private readonly natsClient: ClientProxy,
    // private readonly processedEvents: ProcessedEventRepository,
  ) {}

  private emitOrderEvent(type: EventType, order: Order) {
    const event: EventDto = {
      event_type: type,
      timestamp: new Date().toISOString(),
      source: OrdersService.name,
      data: order,
    };
    this.natsClient.emit(type, event);
  }

  async handleOrderCreated(orderCreatedDto: EventDto) {
    // 1. idempotência
    // const alreadyProcessed = await this.processedEvents.exists(event.eventId);
    // if (alreadyProcessed) return;

    // 2. persiste na fila interna
    const data = orderCreatedDto.data;

    const order = this.orderProjectionRepository.create({
      order_id: data.id,
      user_id: data.user_id,
      restaurant_id: data.restaurant_id,
      restaurant_name: data.restaurant_name,
      restaurant_description: data.restaurant_description,
      restaurant_cover_image_url: data.restaurant_cover_image_url,
      restaurant_logo_url: data.restaurant_logo_url,
      status: data.status,
      notes: data.notes,
      items: data.items,
      subtotal: data.subtotal,
      address: data.address,
      payment: data.payment,
    });
    await this.orderProjectionRepository.save(order);

    // 3. marca evento como processado
    // await this.processedEvents.save(event.eventId);
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Order[]> {
    const { limit, offset } = paginationQuery;
    return this.orderProjectionRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(orderId: number): Promise<Order> {
    const order = await this.orderProjectionRepository.findOne({
      where: { order_id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`order with orderId ${orderId} not found`);
    }
    return order;
  }

  async findMany(restaurantId: number): Promise<Order[]> {
    const orders = await this.orderProjectionRepository.find({
      where: { restaurant_id: restaurantId },
    });
    if (orders.length === 0) {
      throw new NotFoundException(
        `orders with restaurantId ${restaurantId} not found`,
      );
    }
    return orders;
  }

  async updateOrderStatus(
    orderId: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.orderProjectionRepository.findOne({
      where: { order_id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.status = updateOrderStatusDto.status;
    const updatedOrder = await this.orderProjectionRepository.save(order);

    console.log({ order, status: updateOrderStatusDto.status });

    const statusEvents = {
      CANCELLED: EventType.ORDER_CANCELLED,
      PREPARING: EventType.ORDER_PREPARING_STARTED,
      READY: EventType.ORDER_READY,
      DRIVER_ACCEPTED: EventType.DRIVER_ACCEPTED,
      DISPATCHED: EventType.ORDER_DISPATCHED,
      OUT_FOR_DELIVERY: EventType.ORDER_OUT_FOR_DELIVERY,
    };

    const event = statusEvents[updateOrderStatusDto.status];
    console.log({ event });

    if (event) {
      this.emitOrderEvent(event, updatedOrder);
    }

    return updatedOrder;
  }
}

import { Inject, Injectable, NotFoundException } from "@nestjs/common";
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

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @Inject(NATS_CLIENT)
    private readonly natsClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // 1. Criar order
    const order = this.ordersRepository.create(createOrderDto);
    const savedOrder = await this.ordersRepository.save(order);

    const event: UpdateOrderStatusEventDto = {
      event: OrderEventType.ORDER_CREATED,
      timestamp: new Date().toISOString(),
      data: {
        orderId: savedOrder.id,
        status: OrderStatus.CREATED,
        amount: savedOrder.total,
        userId: savedOrder.user_id,
      },
    };

    // 2. Chamar payment-service
    this.natsClient.emit(OrderEventType.ORDER_CREATED, event);

    return savedOrder;
  }

  // private async processPayment() {
  //   await lastValueFrom(
  //     this.natsClient.send("createPayment", {
  //       currency: "BRL",
  //       paymentMethod: "credit_card",
  //     }),
  //   );
  // }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Order[]> {
    const { limit, offset } = paginationQuery;
    return this.ordersRepository.find({
      relations: { items: true },
      skip: offset,
      take: limit,
    });
  }

  async findOne(userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { user_id: userId },
      relations: { items: true },
    });
    if (!order) {
      throw new NotFoundException(`order with userID ${userId} not found`);
    }
    return order;
  }

  async update(
    id: number,
    updateOrderStatusEventDto: UpdateOrderStatusEventDto,
  ) {
    const order = await this.ordersRepository.preload({
      id,
      status: updateOrderStatusEventDto.data.status,
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    const event: UpdateOrderStatusEventDto = {
      event: OrderEventType.NOTIFICATION,
      timestamp: new Date().toISOString(),
      data: {
        orderId: id,
        status: OrderStatus.PAID,
        amount: order.total,
        userId: order.user_id,
      },
    };

    this.natsClient.emit(OrderEventType.NOTIFICATION, event);

    return this.ordersRepository.save(order);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { NATS_CLIENT } from "./constants";
import { OrderStatus, UpdateOrderStatusEventDto } from "@app/orders";
import { PaginationQueryDto } from "./common/dto/pagination-query.dto";
import { OrderEventType } from "@app/orders/enum/order-event-type.enum";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(NATS_CLIENT)
    private readonly natsClient: ClientProxy,
  ) {}

  getHello(): string {
    return "Hello World!";
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    console.log(JSON.stringify(paginationQuery, null, 2));
    // skip: offset,
    // take: limit,
    return `Limit: ${limit}, Offset: ${offset}`;
  }

  update(updateOrderStatusEventDto: UpdateOrderStatusEventDto) {
    // 1. Processar o pagamento

    // 2. Atualizar o estado do pedido
    const event: UpdateOrderStatusEventDto = {
      event: OrderEventType.PAYMENT_PROCESSED,
      timestamp: new Date().toISOString(),
      data: {
        orderId: updateOrderStatusEventDto.data.orderId,
        status: OrderStatus.PAID,
        amount: updateOrderStatusEventDto.data.amount,
        userId: updateOrderStatusEventDto.data.userId,
      },
    };
    return this.natsClient.emit(OrderEventType.PAYMENT_PROCESSED, event);
  }
}

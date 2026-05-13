import { Controller, Get, Query } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { EventPattern, Payload } from "@nestjs/microservices";
import { PaginationQueryDto } from "./common/dto/pagination-query.dto";
import { UpdateOrderStatusEventDto } from "@app/orders";

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getHello(): string {
    return this.paymentService.getHello();
  }

  @Get("payments")
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.paymentService.findAll(paginationQuery);
  }

  @EventPattern("order.initiated")
  handleOrderStatusUpdated(
    @Payload() updateOrderStatusEventDto: UpdateOrderStatusEventDto,
  ) {
    this.paymentService.handleOrderStatusUpdated(updateOrderStatusEventDto);
  }
}

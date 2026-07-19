import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { PaginationQueryDto } from "libs/common/src";

@Controller("payments/v2")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.paymentService.findAll(paginationQuery);
  }
}

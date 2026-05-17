import { Controller, Get, Param, Query } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { OrdersService } from "./orders.service";
import { PaginationQueryDto } from "./common/dto/pagination-query.dto";
import { UpdateOrderStatusEventDto } from "@app/orders";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @EventPattern([
    "payment.processed",
    "order.preparing.started",
    "order.pickup.started",
    "order.out.for.delivery",
    "order.nearby",
    "order.delivered",
  ])
  handleOrderStatusUpdated(
    @Payload() updateOrderStatusEventDto: UpdateOrderStatusEventDto,
  ) {
    this.ordersService.handleOrderStatusUpdated(
      updateOrderStatusEventDto.data.orderId,
      updateOrderStatusEventDto,
    );
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.ordersService.findAll(paginationQuery);
  }

  // @Get(":userId")
  // findOne(@Param("userId") userId: number) {
  //   return this.ordersService.findOne(userId);
  // }

  @Get(":userId")
  findMany(@Param("userId") userId: number) {
    return this.ordersService.findMany(userId);
  }

  // @MessagePattern("updateOrder")
  // update(@Payload() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(updateOrderDto.id, updateOrderDto);
  // }

  @MessagePattern("removeOrder")
  remove(@Payload() id: number) {
    return this.ordersService.remove(id);
  }
}

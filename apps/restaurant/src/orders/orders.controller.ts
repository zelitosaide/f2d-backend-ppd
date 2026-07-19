import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { EventPattern, Payload } from "@nestjs/microservices";
import { EventType } from "@app/orders/enums/event-type.enum";
import { EventDto, PaginationQueryDto } from "@app/orders";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @EventPattern(EventType.ORDER_CREATED)
  handleOrderCreated(@Payload() eventDto: EventDto) {
    this.ordersService.handleOrderCreated(eventDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.ordersService.findAll(paginationQuery);
  }

  @Get(":orderId")
  findOne(@Param("orderId") orderId: number) {
    return this.ordersService.findOne(orderId);
  }

  @Get(":restaurantId/restaurant")
  findMany(@Param("restaurantId") restaurantId: number) {
    return this.ordersService.findMany(restaurantId);
  }

  @Patch(":orderId")
  updateOrderStatus(
    @Param("orderId") orderId: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, updateOrderStatusDto);
  }
}

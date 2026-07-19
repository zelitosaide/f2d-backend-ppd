import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { OrdersService } from "./orders.service";
import { PaginationQueryDto, EventDto } from "libs/common/src";
import { CreateOrderV2Dto } from "./dto/v2/create-order-v2.dto";
import { EventType } from "@app/orders/enums/event-type.enum";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // V2 ----------------------------------------------------------------------------------------------
  @Get("v2")
  findAllV2(@Query() paginationQuery: PaginationQueryDto) {
    return this.ordersService.findAllV2(paginationQuery);
  }

  @Get("v2/:userId")
  findManyV2(@Param("userId") userId: number) {
    return this.ordersService.findManyV2(userId);
  }

  @Post("v2")
  createv2(@Body() createOrderV2Dto: CreateOrderV2Dto) {
    return this.ordersService.createV2(createOrderV2Dto);
  }

  @EventPattern([
    EventType.ORDER_CANCELLED,
    EventType.ORDER_PREPARING_STARTED,
    EventType.ORDER_READY,
    EventType.DRIVER_ACCEPTED,
    EventType.ORDER_DISPATCHED,
    EventType.ORDER_OUT_FOR_DELIVERY,
    "order.nearby",
    "order.delivered",
  ])
  updateOrderStatusV2(@Payload() eventDto: EventDto) {
    this.ordersService.updateOrderStatusV2(eventDto.data.order_id, eventDto);
  }

  // -------------------------------------------------------------------------------------------------

  // @Get(":userId/details")
  // findOrdersDetails(@Param("userId") userId: number) {
  //   return this.ordersService.findOrdersDetails(userId);
  // }
}

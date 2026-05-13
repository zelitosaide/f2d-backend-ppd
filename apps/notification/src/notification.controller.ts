import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { EventsGateway } from "./events/events.gateway";
import { UpdateOrderStatusEventDto } from "@app/orders";

@Controller()
export class NotificationController {
  constructor(private readonly eventsGateway: EventsGateway) {}

  @EventPattern([
    "order.created",
    "order.preparing.started",
    "order.pickup.started",
    "order.out.for.delivery",
    "order.nearby",
    "order.delivered",
  ])
  handleOrderStatusUpdated(
    @Payload() updateOrderStatusEventDto: UpdateOrderStatusEventDto,
  ) {
    this.eventsGateway.handleOrderStatusUpdated(updateOrderStatusEventDto);
  }
}

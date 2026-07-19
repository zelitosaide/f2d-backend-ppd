import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { EventsGateway } from "./events/events.gateway";
import { EventDto } from "libs/common/src";
import { EventType } from "@app/orders/enums/event-type.enum";

@Controller()
export class NotificationController {
  constructor(private readonly eventsGateway: EventsGateway) {}

  @EventPattern([
    EventType.ORDER_CREATED,
    EventType.ORDER_CANCELLED,
    EventType.ORDER_PREPARING_STARTED,
    EventType.ORDER_READY,
    EventType.DRIVER_ACCEPTED,
    EventType.ORDER_DISPATCHED,
    EventType.ORDER_OUT_FOR_DELIVERY,
    "order.nearby",
    "order.delivered",
  ])
  handleOrderStatusUpdated(@Payload() eventDto: EventDto) {
    this.eventsGateway.updateOrderStatus(eventDto);
  }
}

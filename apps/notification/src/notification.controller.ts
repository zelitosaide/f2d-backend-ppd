import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { EventsGateway } from "./events/events.gateway";

@Controller()
export class NotificationController {
  constructor(private readonly eventsGateway: EventsGateway) {}
  private readonly logger = new Logger(NotificationController.name);

  @EventPattern("order.status.updated")
  update(@Payload() event: any) {
    this.logger.log(event);
    this.eventsGateway.handleOrderUpdate(event);
  }
}

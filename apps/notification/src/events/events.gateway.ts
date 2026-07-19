import { EventDto } from "libs/common/src";
import { EventType } from "libs/common/src/enums/event-type.enum";
import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { DriverLocationDto } from "./dto/driver-location.dto";
import { TrackingService } from "./tracking.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly trackingService: TrackingService) {}
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server!: Server;

  async updateOrderStatus(eventDto: EventDto) {
    const statusEvents = {
      CREATED: EventType.EMIT_ORDER_CREATED,
      CANCELLED: EventType.EMIT_ORDER_CANCELLED,
      PREPARING: EventType.EMIT_ORDER_PREPARING_STARTED,
      READY: EventType.EMIT_ORDER_READY,
      DRIVER_ACCEPTED: EventType.EMIT_ORDER_DRIVER_ACCEPTED,
      DISPATCHED: EventType.EMIT_ORDER_DISPATCHED,
      OUT_FOR_DELIVERY: EventType.EMIT_ORDER_OUT_FOR_DELIVERY,
    };

    const event = statusEvents[eventDto.data.status];

    if (event) {
      this.server.emit(event, {
        ...eventDto,
        timestamp: new Date().toISOString(),
        event_type: event,
      });
    }
  }

  @SubscribeMessage("driver.location.updated")
  async handleDriverLocation(
    @MessageBody() dto: DriverLocationDto,
    @ConnectedSocket() _client: Socket,
  ) {
    this.server.emit("order.location.updated", {
      ...dto,
      event: "order.location.updated",
      timestamp: new Date().toISOString(),
    });

    const nearbyPayload = await this.trackingService.processLocationUpdate(dto);

    if (nearbyPayload) {
      this.server.emit(EventType.ORDER_NEARBY, {
        ...nearbyPayload,
        event: EventType.ORDER_NEARBY,
        timestamp: new Date().toISOString(),
      });
    }

    return { ack: true, orderId: dto.orderId };
  }

  handleDisconnect(client: Socket) {
    console.log("Disconnected 245");
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log("Connected 245");
  }
}

// handleOrderUpdate(event: any) {
//   const { orderId, userId, status } = event.data;
//   console.log(event);
//   const message = "NA";
//   this.server.emit("order.update", {
//     orderId,
//     status,
//     message,
//   });
// }

// @EventPattern("order.status.updated")
// handleOrderUpdate(@Payload() event: any) {
//   const { orderId, userId, status } = event.data;
//   const message = "NA";
//   this.server.to(userId).emit("order.update", {
//     orderId,
//     status,
//     message,
//   });
// }

// @SubscribeMessage("message")
// handleMessage(client: Socket, payload: any): string {
//   console.log(payload);
//   client.emit("ola", "OLA"); // the one
//   this.server.emit("ola", "Broadcasting..."); // broadcast
//   return "Hello world!";
// }

// @SubscribeMessage("events")
// handleEvent(client: Socket, data: string): string {
//   return data;
// }

// https://www.youtube.com/watch?v=eEa3u3wyYu4
// https://www.youtube.com/watch?v=ZKEqqIO7n-k

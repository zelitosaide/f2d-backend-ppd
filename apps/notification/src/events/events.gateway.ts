import { UpdateOrderStatusEventDto } from "@app/orders";
import { OrderEventType } from "@app/orders/enum/order-event-type.enum";
import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway({
  path: "/v1/notification/socket.io",
  cors: {
    origin: "*",
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server!: Server;

  async handleOrderStatusUpdated(
    updateOrderStatusEventDto: UpdateOrderStatusEventDto,
  ) {
    if (updateOrderStatusEventDto.data.status === "CREATED") {
      this.logger.debug("ORDER RECEIVED");
      this.server.emit(OrderEventType.ORDER_CREATED, updateOrderStatusEventDto);
    }

    if (updateOrderStatusEventDto.data.status === "PREPARING") {
      this.logger.debug("PREPARING YOUR ORDER...");
      this.server.emit(
        OrderEventType.ORDER_PREPARING_STARTED,
        updateOrderStatusEventDto,
      );
    }

    if (updateOrderStatusEventDto.data.status === "PICKING_UP") {
      this.logger.debug("PICKING UP YOUR ORDER...");
      this.server.emit(
        OrderEventType.ORDER_PICKUP_STARTED,
        updateOrderStatusEventDto,
      );
    }

    if (updateOrderStatusEventDto.data.status === "OUT_FOR_DELIVERY") {
      this.logger.debug("HEADING YOUR WAY...");
      this.server.emit(
        OrderEventType.ORDER_OUT_FOR_DELIVERY,
        updateOrderStatusEventDto,
      );
    }

    if (updateOrderStatusEventDto.data.status === "NEARBY") {
      this.logger.debug("ALMOST HERE!");
      this.server.emit(OrderEventType.ORDER_NEARBY, updateOrderStatusEventDto);
    }

    if (updateOrderStatusEventDto.data.status === "DELIVERED") {
      this.logger.debug("DELIVERED");
      this.server.emit(
        OrderEventType.ORDER_DELIVERED,
        updateOrderStatusEventDto,
      );
    }

    this.logger.debug(updateOrderStatusEventDto);
  }

  handleDisconnect(client: Socket) {
    console.log("Disconnected 245");
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log("Connected 245");
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
}

// https://www.youtube.com/watch?v=eEa3u3wyYu4
// https://www.youtube.com/watch?v=ZKEqqIO7n-k

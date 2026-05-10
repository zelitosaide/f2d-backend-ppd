import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server!: Server;

  handleOrderUpdate(event: any) {
    // this.logger.log(event);
    this.server.emit("order.update", event);
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

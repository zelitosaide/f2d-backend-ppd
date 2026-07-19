import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { NATS_CLIENT } from "../constants";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ClientsModule.register([
      {
        name: NATS_CLIENT,
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

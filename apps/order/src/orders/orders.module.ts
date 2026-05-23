import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { NATS_CLIENT } from "../constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Item } from "./entities/item.entity";
import { Address } from "./entities/address.entity";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_CLIENT,
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
        },
      },
    ]),
    TypeOrmModule.forFeature([Order, Item, Address]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

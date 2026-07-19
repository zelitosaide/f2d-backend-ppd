import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { NATS_CLIENT } from "../constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Item } from "./entities/item.entity";
import { Address } from "./entities/address.entity";
import { OrderV2 } from "./entities/v2/order-v2.entity";
import { OrderItemV2 } from "./entities/v2/order-item-v2.entity";
import { AddressV2 } from "./entities/v2/address-v2.entity";
import { PaymentV2 } from "./entities/v2/payment-v2.entity";

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
    TypeOrmModule.forFeature([
      Order,
      Item,
      Address,
      OrderV2,
      OrderItemV2,
      AddressV2,
      PaymentV2,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

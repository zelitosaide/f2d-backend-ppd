import { Module } from "@nestjs/common";
import { CartsService } from "./carts.service";
import { CartsController } from "./carts.controller";
import { OrdersModule } from "../orders/orders.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cart-item.entity";
import { CartV2 } from "./entities/v2/cart-v2.entity";
import { CartItemV2 } from "./entities/v2/cart-item-v2.entity";

@Module({
  imports: [
    OrdersModule,
    TypeOrmModule.forFeature([Cart, CartItem, CartV2, CartItemV2]),
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}

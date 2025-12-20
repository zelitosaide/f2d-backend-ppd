import { Module } from "@nestjs/common";
import { CartsService } from "./carts.service";
import { CartsController } from "./carts.controller";
import { OrdersModule } from "../orders/orders.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./entities/cart.entity";
import { CartItem } from "./entities/cart-item.entity";

@Module({
  imports: [OrdersModule, TypeOrmModule.forFeature([Cart, CartItem])],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}

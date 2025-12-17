import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [CartsModule, OrdersModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

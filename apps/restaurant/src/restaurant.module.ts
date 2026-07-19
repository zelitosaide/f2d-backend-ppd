import { Module } from "@nestjs/common";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";
import { RestaurantsModule } from "./restaurants/restaurants.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT!,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    RestaurantsModule,
    OrdersModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}

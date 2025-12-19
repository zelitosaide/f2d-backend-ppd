import { Module } from "@nestjs/common";
import { RestaurantsService } from "./restaurants.service";
import { RestaurantsController } from "./restaurants.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Menu } from "./entities/menu.entity";
import { Dish } from "./entities/dish.entity";
import { Address } from "./entities/address.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Menu, Dish, Address])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}

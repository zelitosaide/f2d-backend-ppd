import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { RestaurantsService } from "./restaurants.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { UpdateOrderStatusEventDto } from "@app/orders";

@Controller("restaurants")
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @EventPattern("order.created")
  handleOrderStatusUpdated(
    @Payload() updateOrderStatusEventDto: UpdateOrderStatusEventDto,
  ) {
    // this.ordersService.update(updateOrderDto.id, updateOrderDto);
    this.restaurantsService.handleOrderStatusUpdated(updateOrderStatusEventDto);
  }

  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Post("update-order-status")
  updateOrderStatus(
    @Body() updateOrderStatusEventDto: UpdateOrderStatusEventDto,
  ) {
    return this.restaurantsService.updateOrderStatus(updateOrderStatusEventDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.restaurantsService.findAll(paginationQuery);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.restaurantsService.findOne(id);
  }

  @Get(":restaurantId/dishes/:dishId")
  findOneDish(
    @Param("restaurantId") restaurantId: number,
    @Param("dishId") dishId: number,
  ) {
    return this.restaurantsService.findOneDish(restaurantId, dishId);
  }

  // @MessagePattern("updateRestaurant")
  // update(@Payload() updateRestaurantDto: UpdateRestaurantDto) {
  //   return this.restaurantsService.update(
  //     updateRestaurantDto.id,
  //     updateRestaurantDto,
  //   );
  // }

  @MessagePattern("removeRestaurant")
  remove(@Payload() id: number) {
    return this.restaurantsService.remove(id);
  }
}

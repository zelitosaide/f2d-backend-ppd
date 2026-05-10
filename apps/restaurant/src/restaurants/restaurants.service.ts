import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { Dish } from "./entities/dish.entity";
import { OrderStatus, UpdateOrderStatusEventDto } from "@app/orders";
import { OrderEventType } from "@app/orders/enum/order-event-type.enum";
import { ClientProxy } from "@nestjs/microservices";
import { NATS_CLIENT } from "../constants";

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantsRepository: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishesRepository: Repository<Dish>,
    @Inject(NATS_CLIENT)
    private readonly natsClient: ClientProxy,
  ) {}

  update(updateOrderDto: any) {
    const event: UpdateOrderStatusEventDto = {
      event: OrderEventType.NOTIFICATION,
      timestamp: new Date().toISOString(),
      data: {
        orderId: updateOrderDto.data.orderId,
        status: OrderStatus.REFUNDED,
        amount: updateOrderDto.data.amout,
        userId: updateOrderDto.data.userId,
      },
    };

    this.natsClient.emit(OrderEventType.NOTIFICATION, event);
  }

  create(createRestaurantDto: CreateRestaurantDto) {
    const restaurant = this.restaurantsRepository.create(createRestaurantDto);
    return this.restaurantsRepository.save(restaurant);
  }

  findAll(paginationQuery: PaginationQueryDto): Promise<Restaurant[]> {
    const { limit, offset } = paginationQuery;
    return this.restaurantsRepository.find({
      order: { created_at: "DESC" },
      skip: offset,
      take: limit,
      relations: {
        address: true,
        menus: {
          dishes: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const restaurant = await this.restaurantsRepository.findOne({
      where: { id },
      relations: {
        address: true,
        menus: {
          dishes: true,
        },
      },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }

  async findOneDish(restaurantId: number, dishId: number): Promise<Dish> {
    const dish = await this.dishesRepository.findOne({
      where: {
        id: dishId,
        menu: {
          restaurant: {
            id: restaurantId,
          },
        },
      },
    });
    if (!dish) {
      throw new NotFoundException(
        `Dish with ID ${dishId} not found in restaurant ${restaurantId}`,
      );
    }
    return dish;
  }

  // update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
  //   return `This action updates a #${id} restaurant`;
  // }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CartsService } from "./carts.service";
import { PaginationQueryDto } from "./common/dto/pagination-query.dto";
import { UpdateItemQuantityDto } from "./dto/update-item-quantity-dto";
import { CartItemDto } from "./dto/cart-item-dto";

@Controller("carts")
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post(":userId/items/add")
  addItem(@Param("userId") userId: number, @Body() cartItem: CartItemDto) {
    return this.cartsService.addItem(userId, cartItem);
  }

  @Delete(":cartId/items/:dishId")
  deleteItem(@Param("cartId") cartId: number, @Param("dishId") dishId: number) {
    return this.cartsService.deleteItem(cartId, dishId);
  }

  @Patch(":cartId/items/:dishId")
  updateItemQuantity(
    @Param("cartId") cartId: number,
    @Param("dishId") dishId: number,
    @Body() updateItemQuantity: UpdateItemQuantityDto,
  ) {
    return this.cartsService.updateItemQuantity(
      cartId,
      dishId,
      updateItemQuantity,
    );
  }

  @Post(":id/checkout")
  checkout(@Param() id: number) {
    return this.cartsService.checkout(id);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.cartsService.remove(id);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.cartsService.findAll(paginationQuery);
  }

  @Get(":userId")
  findOne(@Param("userId") userId: number) {
    return this.cartsService.findOne(userId);
  }
}

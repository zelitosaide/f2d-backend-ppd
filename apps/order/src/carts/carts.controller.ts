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

  @Delete(":id/items/:itemId")
  deleteItem(@Param("id") cartId: number, @Param("itemId") itemId: number) {
    return this.cartsService.deleteItem(cartId, itemId);
  }

  @Patch(":id/items/:itemId")
  updateItemQuantity(
    @Param("id") cartId: number,
    @Param("itemId") itemId: number,
    @Body() updateItemQuantity: UpdateItemQuantityDto,
  ) {
    return this.cartsService.updateItemQuantity(
      cartId,
      itemId,
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

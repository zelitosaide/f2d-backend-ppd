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
import { UpdateItemQuantityDto } from "./dto/update-item-quantity.dto";
import { CartItemDto } from "./dto/cart-item.dto";
import { CheckoutDto } from "./dto/checkout.dto";
import CreateCartDto from "./dto/create-cart.dto";
import CreateCartV2Dto from "./dto/v2/create-cart-v2.dto";
import { UpdateCartStatusV2Dto } from "./dto/v2/update-cart-status-v2.dto";
import { AddItemV2Dto } from "./dto/v2/add-item-v2.dto";
import { UpdateItemQuantityV2Dto } from "./dto/v2/update-item-quantity-v2.dto";
import { CheckoutV2Dto } from "./dto/v2/checkout-v2.dto";
import { PaginationQueryDto } from "libs/common/src";

@Controller("carts")
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // V2 Endpoints --------------------------------------------------------------------------
  @Post("v2")
  createV2(@Body() createCartV2Dto: CreateCartV2Dto) {
    return this.cartsService.createV2(createCartV2Dto);
  }

  @Get("v2")
  findAllV2(@Query() paginationQuery: PaginationQueryDto) {
    return this.cartsService.findAllV2(paginationQuery);
  }

  @Get("v2/:userId")
  findOneV2(@Param("userId") userId: number) {
    return this.cartsService.findOneV2(userId);
  }

  @Patch("v2/:cartId/status")
  updateCartStatusV2(
    @Param("cartId") cartId: number,
    @Body() updateCartStatusV2Dto: UpdateCartStatusV2Dto,
  ) {
    return this.cartsService.updateCartStatusV2(cartId, updateCartStatusV2Dto);
  }

  @Post("v2/:userId/items/add")
  addItemV2(@Param("userId") userId: number, @Body() itemDto: AddItemV2Dto) {
    return this.cartsService.addItemV2(userId, itemDto);
  }

  @Patch("v2/:cartId/items/:dishId")
  updateItemQuantityV2(
    @Param("cartId") cartId: number,
    @Param("dishId") dishId: number,
    @Body() updateItemQuantityV2Dto: UpdateItemQuantityV2Dto,
  ) {
    return this.cartsService.updateItemQuantityV2(
      cartId,
      dishId,
      updateItemQuantityV2Dto,
    );
  }

  @Post("v2/:cartId/checkout")
  checkoutV2(
    @Param("cartId") cartId: number,
    @Body() checkoutV2Dto: CheckoutV2Dto,
  ) {
    return this.cartsService.checkoutV2(cartId, checkoutV2Dto);
  }

  // -----------------------------------------------------------------------------------------

  @Post(":orderId/reorder")
  reorder(@Param("orderId") orderId: number) {
    return this.cartsService.reorder(orderId);
  }

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

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

  @Post("checkout")
  checkout(@Body() checkoutDto: CheckoutDto) {
    return this.cartsService.checkout(checkoutDto);
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

  @Get(":userId/details")
  findCartDetails(@Param("userId") userId: number) {
    return this.cartsService.findCartDetails(userId);
  }
}

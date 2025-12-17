import { Controller, Param, Post } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CartsService } from "./carts.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";

@Controller("carts")
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @MessagePattern("createCart")
  create(@Payload() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @MessagePattern("findAllCarts")
  findAll() {
    return this.cartsService.findAll();
  }

  @MessagePattern("findOneCart")
  findOne(@Payload() id: number) {
    return this.cartsService.findOne(id);
  }

  @MessagePattern("updateCart")
  update(@Payload() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(updateCartDto.id, updateCartDto);
  }

  @MessagePattern("removeCart")
  remove(@Payload() id: number) {
    return this.cartsService.remove(id);
  }

  @Post("checkout/:userId")
  checkout(@Param() userId: number) {
    return this.cartsService.checkout(userId);
  }
}

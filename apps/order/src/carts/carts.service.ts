import { Injectable } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { OrdersService } from "../orders/orders.service";

@Injectable()
export class CartsService {
  constructor(private readonly ordersService: OrdersService) {}

  create(createCartDto: CreateCartDto) {
    return "This action adds a new cart";
  }

  findAll() {
    return `This action returns all carts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  async checkout(userId: number) {
    const orderPayload = { userId };
    this.ordersService.createOrderFromCart(orderPayload);
  }
}

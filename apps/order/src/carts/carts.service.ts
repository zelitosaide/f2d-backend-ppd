import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { OrdersService } from "../orders/orders.service";
import { Cart } from "./entities/cart.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationQueryDto } from "./common/dto/pagination-query.dto";
import { UpdateItemQuantityDto } from "./dto/update-item-quantity-dto";

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    private readonly ordersService: OrdersService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = this.cartsRepository.create(createCartDto);
    return this.cartsRepository.save(cart);
  }

  async deleteItem(cartId: number, itemId: number): Promise<void> {
    const cart = await this.cartsRepository.findOne({
      where: { id: cartId },
      relations: { items: true },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }
    cart.items = cart.items.filter((item) => item.dish_id !== itemId);
    await this.cartsRepository.save(cart);
  }

  async updateItemQuantity(
    cartId: number,
    itemId: number,
    updateItemQuantity: UpdateItemQuantityDto,
  ): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      where: { id: cartId },
      relations: { items: true },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }
    const item = cart.items.find((item) => item.dish_id === itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found in cart`);
    }
    item.quantity += updateItemQuantity.quantity;
    return this.cartsRepository.save(cart);
  }

  async checkout(id: number) {
    const orderPayload = { id };
    this.ordersService.createOrderFromCart(orderPayload);
  }

  async remove(id: number): Promise<Cart> {
    const cart = await this.findOne(id);
    return this.cartsRepository.remove(cart);
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Cart[]> {
    const { limit, offset } = paginationQuery;
    return this.cartsRepository.find({
      relations: { items: true },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }
}

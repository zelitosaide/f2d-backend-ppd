import { Injectable, NotFoundException } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import { Cart } from "./entities/cart.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationQueryDto } from "./common/dto/pagination-query.dto";
import { UpdateItemQuantityDto } from "./dto/update-item-quantity-dto";
import { CartItemDto } from "./dto/cart-item-dto";
import { CartItem } from "./entities/cart-item.entity";

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    private readonly ordersService: OrdersService,
  ) {}

  async addItem(userId: number, cartItem: CartItemDto): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      where: { user_id: userId },
      relations: { items: true },
    });
    if (!cart) {
      const newCart = this.cartsRepository.create({
        user_id: userId,
        items: [cartItem],
      });
      const savedCart = await this.cartsRepository.save(newCart);
      savedCart.items.sort((a, b) => a.id - b.id);
      return savedCart;
    }
    const existingItem = cart.items.find(
      (item) => item.dish_id === cartItem.dish_id,
    );
    if (existingItem) {
      existingItem.quantity += cartItem.quantity;
      await this.cartItemsRepository.save(existingItem);
    } else {
      const newItem = this.cartItemsRepository.create(cartItem);
      cart.items.push(newItem);
      await this.cartItemsRepository.save(newItem);
    }
    cart.items.sort((a, b) => a.id - b.id);
    return this.cartsRepository.save(cart);
  }

  async deleteItem(cartId: number, dishId: number): Promise<void> {
    const cart = await this.cartsRepository.findOne({
      where: { id: cartId },
      relations: { items: true },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }
    const item = cart.items.find((item) => item.dish_id === dishId);
    if (!item) {
      throw new NotFoundException(`Dish with ID ${dishId} not found`);
    }
    cart.items = cart.items.filter((item) => item.dish_id !== dishId);
    if (!cart.items.length) {
      return this.remove(cartId);
    }
    await this.cartsRepository.save(cart);
  }

  // async updateItemQuantity(
  //   cartId: number,
  //   itemId: number,
  //   updateItemQuantityDto: UpdateItemQuantityDto,
  // ): Promise<Cart | void> {
  //   const cart = await this.cartsRepository.findOne({
  //     where: { id: cartId },
  //     relations: { items: true },
  //   });
  //   if (!cart) {
  //     throw new NotFoundException(`Cart with ID ${cartId} not found`);
  //   }
  //   const item = cart.items.find((item) => item.dish_id === itemId);
  //   if (!item) {
  //     throw new NotFoundException(
  //       `Item with dish ID ${itemId} not found in cart`,
  //     );
  //   }

  //   const newQuantity = item.quantity + updateItemQuantityDto.quantity;

  //   if (newQuantity <= 0) {
  //     await this.cartItemsRepository.delete(item.id);
  //     cart.items = cart.items.filter((i) => i.id !== item.id);
  //     cart.items.sort((a, b) => a.id - b.id);

  //     if (cart.items.length) {
  //       return cart;
  //     } else {
  //       return;
  //     }
  //   }

  //   item.quantity = newQuantity;
  //   await this.cartItemsRepository.save(item);
  //   cart.items.sort((a, b) => a.id - b.id);

  //   if (cart.items.length) {
  //     return cart;
  //   } else {
  //     return;
  //   }
  // }

  async updateItemQuantity(
    cartId: number,
    dishId: number,
    updateItemQuantityDto: UpdateItemQuantityDto,
  ): Promise<Cart | void> {
    const cart = await this.cartsRepository.findOne({
      where: { id: cartId },
      relations: { items: true },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    const item = cart.items.find((i) => i.dish_id === dishId);
    if (!item) {
      throw new NotFoundException(
        `Item with dish ID ${dishId} not found in cart`,
      );
    }

    const newQuantity = item.quantity + updateItemQuantityDto.quantity;

    if (newQuantity <= 0) {
      await this.cartItemsRepository.delete(item.id);
      cart.items = cart.items.filter((i) => i.id !== item.id);
    } else {
      item.quantity = newQuantity;
      await this.cartItemsRepository.save(item);
    }

    cart.items.sort((a, b) => a.id - b.id);

    if (!cart.items.length) {
      await this.remove(cart.id);
      return;
    }

    return cart;
  }

  async checkout(id: number) {
    const orderPayload = { id };
    this.ordersService.createOrderFromCart(orderPayload);
  }

  async remove(cartId: number): Promise<void> {
    const cart = await this.cartsRepository.findOne({
      where: { id: cartId },
      relations: { items: true },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }
    await this.cartsRepository.remove(cart);
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Cart[]> {
    const { limit, offset } = paginationQuery;
    return this.cartsRepository.find({
      relations: { items: true },
      skip: offset,
      take: limit,
    });
  }

  async findOne(userId: number): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      where: { user_id: userId },
      relations: { items: true },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with userID ${userId} not found`);
    }
    return cart;
  }
}

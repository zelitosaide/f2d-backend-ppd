import { Injectable, NotFoundException } from "@nestjs/common";
import { request } from "node:http";
import { OrdersService } from "../orders/orders.service";
import { Cart } from "./entities/cart.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationQueryDto } from "./common/dto/pagination-query.dto";
import { UpdateItemQuantityDto } from "./dto/update-item-quantity-dto";
import { CartItemDto } from "./dto/cart-item-dto";
import { CartItem } from "./entities/cart-item.entity";
import { CheckoutDto } from "./dto/checkout-dto";
import { OrderStatus } from "@app/orders";
import { CreateOrderDto } from "../orders/dto/create-order.dto";
import CreateCartDto from "./dto/create-cart.dto";
import { GroupedItems } from "./types/grouped-items.type";

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
        total: cartItem.price * cartItem.quantity,
      });
      const savedCart = await this.cartsRepository.save(newCart);
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
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
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

  async updateItemQuantity(
    cartId: number,
    dishId: number,
    updateItemQuantityDto: UpdateItemQuantityDto,
  ): Promise<Cart> {
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

    if (!cart.items.length) {
      await this.remove(cart.id);
      return {
        ...cart,
        items: [],
        total: 0,
      };
    }

    cart.total = cart.items.reduce(
      (sum, currentItem) => sum + currentItem.price * currentItem.quantity,
      0,
    );

    return this.cartsRepository.save(cart);
  }

  async checkout(checkoutDto: CheckoutDto) {
    const userId = checkoutDto.user_id;
    const restaurantId = checkoutDto.items[0].restaurant_id;
    const cart = await this.findCartByUserId(userId);
    const { id, created_at, updated_at, ...cartWithoutDates } = cart;
    const cleanCart: CreateOrderDto = {
      ...cartWithoutDates,
      items: cart.items
        .filter((item) => item.restaurant_id === restaurantId)
        .map(({ id, created_at, cart, ...item }) => item),
      status: OrderStatus.CREATED,
      notes: "Tenho Alergia",
      address: checkoutDto.address,
    };
    this.ordersService.create(cleanCart);
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

  private async findCartByUserId(userId: number): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      where: { user_id: userId },
      relations: { items: true },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with userID ${userId} not found`);
    }
    return cart;
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

  async findCartDetails(userId: number): Promise<GroupedItems[]> {
    const cart = await this.findCartByUserId(userId);

    const restaurantIds = Array.from(
      new Set(cart.items.map((item) => item.restaurant_id)),
    );

    const restaurantInfos = await Promise.all(
      restaurantIds.map((restaurantId) =>
        fetch(`http://restaurant:4003/restaurants/${restaurantId}`).then(
          (res) => res.json(),
        ),
      ),
    );

    const restaurantMap = new Map(
      restaurantInfos.map((restaurant) => [restaurant.id, restaurant]),
    );

    return cart.items.reduce((groups, item) => {
      let group = groups.find((g) => g.restaurant_id === item.restaurant_id);
      if (!group) {
        const restaurant = restaurantMap.get(item.restaurant_id);
        group = {
          restaurant_id: item.restaurant_id,
          restaurant_name: restaurant?.name ?? "",
          restaurant_description: restaurant?.description ?? "",
          restaurant_cover_image_url: restaurant?.cover_image_url ?? "",
          restaurant_logo_url: restaurant?.logo_url ?? "",
          items: [],
          subtotal: 0,
        };
        groups.push(group);
      }

      group.items.push({
        dish_id: item.dish_id,
        dish_name: item.dish_name,
        dish_description: item.dish_description,
        dish_image_url: item.dish_image_url,
        price: item.price,
        quantity: item.quantity,
      });
      group.subtotal += item.price * item.quantity;
      return groups;
    }, [] as GroupedItems[]);
  }

  create(createCartDto: CreateCartDto) {
    const cart = this.cartsRepository.create(createCartDto);
    return this.cartsRepository.save(cart);
  }

  async reorder(orderId: number): Promise<Cart> {
    const order = await this.ordersService.findOne(orderId);

    const cartItems = order.items.map((item) => ({
      restaurant_id: item.restaurant_id,
      dish_id: item.dish_id,
      dish_name: item.dish_name,
      dish_description: item.dish_description,
      dish_image_url: item.dish_image_url,
      price: item.price,
      quantity: item.quantity,
    }));

    const createCartDto: CreateCartDto = {
      user_id: order.user_id,
      items: cartItems,
      total: order.total,
    };

    return await this.create(createCartDto);
  }
}

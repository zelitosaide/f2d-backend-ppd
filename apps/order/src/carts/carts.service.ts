import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import { Cart } from "./entities/cart.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateItemQuantityDto } from "./dto/update-item-quantity.dto";
import { CartItemDto } from "./dto/cart-item.dto";
import { CartItem } from "./entities/cart-item.entity";
import { CheckoutDto } from "./dto/checkout.dto";
import { OrderStatus, PaginationQueryDto } from "libs/common/src";
import { CreateOrderDto } from "../orders/dto/create-order.dto";
import CreateCartDto from "./dto/create-cart.dto";
import { GroupedItems } from "./types/grouped-items.type";
import CreateCartV2Dto from "./dto/v2/create-cart-v2.dto";
import { CartV2 } from "./entities/v2/cart-v2.entity";
import { CartStatus } from "./enums/cart-status.enum";
import { UpdateCartStatusV2Dto } from "./dto/v2/update-cart-status-v2.dto";
import { CartItemV2Dto } from "./dto/v2/cart-item-v2.dto";
import { CartItemV2 } from "./entities/v2/cart-item-v2.entity";
import { AddItemV2Dto } from "./dto/v2/add-item-v2.dto";
import { UpdateItemQuantityV2Dto } from "./dto/v2/update-item-quantity-v2.dto";
import { CheckoutV2Dto } from "./dto/v2/checkout-v2.dto";

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(CartV2)
    private cartsV2Repository: Repository<CartV2>,
    @InjectRepository(CartItemV2)
    private cartItemsV2Repository: Repository<CartItemV2>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    private ordersService: OrdersService,
  ) {}

  // V2 ----------------------------------------------------------------------------------------------
  private async fetchRestaurant(restaurantId: number) {
    const res = await fetch(
      `http://restaurant:4003/restaurants/${restaurantId}`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch restaurant");
    }
    return res.json();
  }

  private async fetchDishes(restaurantId: number, dishIds: number[]) {
    const dishes = await Promise.all(
      dishIds.map(async (dishId) => {
        const res = await fetch(
          `http://restaurant:4003/restaurants/${restaurantId}/dishes/${dishId}`,
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch dish ${dishId}`);
        }
        return res.json();
      }),
    );
    return dishes;
  }

  private async fetchDish(restaurantId: number, dishId: number) {
    const resDish = await fetch(
      `http://restaurant:4003/restaurants/${restaurantId}/dishes/${dishId}`,
    );
    if (!resDish.ok) {
      throw new NotFoundException(
        `Dish with ID ${dishId} not found in restaurant ${restaurantId}`,
      );
    }
    return await resDish.json();
  }

  async createV2(createCartV2Dto: CreateCartV2Dto) {
    const {
      user_id: userId,
      restaurant_id: restaurantId,
      items: cartItems,
    } = createCartV2Dto;

    const restaurant = await this.fetchRestaurant(restaurantId);

    const dishQuantities = new Map<number, number>(
      cartItems.map((item) => [item.dish_id, item.quantity]),
    );

    const dishes = await this.fetchDishes(
      restaurantId,
      Array.from(dishQuantities.keys()),
    );

    const items = dishes.map((dish) => {
      const quantity = dishQuantities.get(dish.id) ?? 0;

      return {
        dish_id: dish.id,
        dish_name: dish.name,
        dish_description: dish.description,
        dish_image_url: dish.image_url,
        quantity,
        price: dish.price,
      };
    });

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const cart = this.cartsV2Repository.create({
      user_id: userId,
      restaurant_id: restaurant.id,
      restaurant_name: restaurant.name,
      restaurant_description: restaurant.description,
      restaurant_cover_image_url: restaurant.cover_image_url,
      restaurant_logo_url: restaurant.logo_url,
      items,
      subtotal,
    });

    return this.cartsV2Repository.save(cart);
  }

  async findAllV2(paginationQuery: PaginationQueryDto): Promise<CartV2[]> {
    const { limit, offset } = paginationQuery;
    return this.cartsV2Repository.find({
      relations: { items: true },
      skip: offset,
      take: limit,
    });
  }

  async findOneV2(userId: number): Promise<CartV2> {
    const cart = await this.cartsV2Repository.findOne({
      where: { user_id: userId, status: CartStatus.ACTIVE },
      relations: { items: true },
    });
    if (!cart) {
      throw new NotFoundException(
        `Cart with userID ${userId} not found OR not active`,
      );
    }
    return cart;
  }

  async updateCartStatusV2(
    cartId: number,
    updateCartStatusV2Dto: UpdateCartStatusV2Dto,
  ) {
    const cart = await this.cartsV2Repository.findOne({
      where: { id: cartId },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }
    // validate status transition: only allow ACTIVE -> CHECKED_OUT
    if (
      cart.status === CartStatus.ACTIVE &&
      updateCartStatusV2Dto.status === CartStatus.CHECKED_OUT
    ) {
      cart.status = updateCartStatusV2Dto.status;
    } else {
      throw new NotFoundException(
        `Invalid status transition from ${cart.status} to ${updateCartStatusV2Dto.status}`,
      );
    }

    return this.cartsV2Repository.save(cart);
  }

  async addItemV2(userId: number, itemDto: AddItemV2Dto): Promise<CartV2> {
    const cart = await this.cartsV2Repository.findOne({
      where: { user_id: userId, status: CartStatus.ACTIVE },
      relations: { items: true },
    });
    if (!cart) {
      return this.createV2({
        user_id: userId,
        restaurant_id: itemDto.restaurant_id,
        items: [
          {
            dish_id: itemDto.dish_id,
            quantity: itemDto.quantity,
          } as CartItemV2Dto,
        ],
      });
    }
    const dish = await this.fetchDish(cart.restaurant_id, itemDto.dish_id);

    const existingItem = cart.items.find((item) => item.dish_id === dish.id);

    if (existingItem) {
      existingItem.quantity += itemDto.quantity;
      await this.cartItemsV2Repository.save(existingItem);
    } else {
      const newItem = this.cartItemsV2Repository.create({
        dish_id: dish.id,
        dish_name: dish.name,
        dish_description: dish.description,
        dish_image_url: dish.image_url,
        quantity: itemDto.quantity,
        price: dish.price,
      });
      cart.items.push(newItem);
      await this.cartItemsV2Repository.save(newItem);
    }
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return this.cartsV2Repository.save(cart);
  }

  async updateItemQuantityV2(
    cartId: number,
    dishId: number,
    updateItemQuantityV2Dto: UpdateItemQuantityV2Dto,
  ): Promise<CartV2> {
    const cart = await this.cartsV2Repository.findOne({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    const item = await this.cartItemsV2Repository.findOne({
      where: { cart: { id: cartId }, dish_id: dishId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with dish ID ${dishId} not found in cart`,
      );
    }

    const newQuantity = item.quantity + updateItemQuantityV2Dto.quantity;

    if (newQuantity <= 0) {
      await this.cartItemsV2Repository.remove(item);
    } else {
      item.quantity = newQuantity;
      await this.cartItemsV2Repository.save(item);
    }

    const items = await this.cartItemsV2Repository.find({
      where: { cart: { id: cartId } },
    });

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    cart.subtotal = subtotal;
    await this.cartsV2Repository.save(cart);

    cart.items = items;
    return cart;
  }

  async checkoutV2(cartId: number, checkoutV2Dto: CheckoutV2Dto) {
    const cart = await this.cartsV2Repository.findOne({
      where: { id: cartId },
      relations: { items: true },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    if (!cart.items.length) {
      throw new BadRequestException("Cannot checkout an empty cart");
    }

    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException(
        `Cart cannot be checked out from status ${cart.status}`,
      );
    }

    const order = await this.ordersService.createV2({
      user_id: cart.user_id,
      restaurant_id: cart.restaurant_id,
      restaurant_name: cart.restaurant_name,
      restaurant_description: cart.restaurant_description,
      restaurant_cover_image_url: cart.restaurant_cover_image_url,
      restaurant_logo_url: cart.restaurant_logo_url,
      notes: checkoutV2Dto.notes,
      address: checkoutV2Dto.address,
      payment: checkoutV2Dto.payment,
      items: cart.items.map(({ id, cart, ...rest }) => rest),
      subtotal: cart.subtotal,
    });

    if (order.status === OrderStatus.CREATED) {
      cart.status = CartStatus.CHECKED_OUT;
      await this.cartsV2Repository.save(cart);
    }

    return order;
  }

  // ------------------------------------------------------------------------------------------------

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
    // const userId = checkoutDto.user_id;
    // const restaurantId = checkoutDto.items[0].restaurant_id;
    // const cart = await this.findCartByUserId(userId);
    // const { id, created_at, updated_at, ...cartWithoutDates } = cart;
    // const cleanCart: CreateOrderDto = {
    //   ...cartWithoutDates,
    //   items: cart.items
    //     .filter((item) => item.restaurant_id === restaurantId)
    //     .map(({ id, created_at, cart, ...item }) => item),
    //   status: OrderStatus.CREATED,
    //   notes: "Tenho Alergia",
    //   address: checkoutDto.address,
    // };
    // return this.ordersService.create(cleanCart);
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

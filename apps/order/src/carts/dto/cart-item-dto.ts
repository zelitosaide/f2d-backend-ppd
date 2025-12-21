import { IsInt, IsNumber } from "class-validator";

export class CartItemDto {
  @IsInt()
  readonly restaurant_id: number;

  @IsInt()
  readonly dish_id: number;

  @IsInt()
  readonly quantity: number;

  @IsNumber()
  readonly price: number;
}

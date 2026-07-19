import { IsInt, IsPositive } from "class-validator";

export class CartItemV2Dto {
  @IsInt()
  readonly dish_id: number;

  @IsInt()
  @IsPositive()
  readonly quantity: number;
}

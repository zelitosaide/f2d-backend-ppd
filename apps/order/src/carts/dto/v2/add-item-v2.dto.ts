import { IsInt, IsPositive } from "class-validator";
import { CartItemV2Dto } from "./cart-item-v2.dto";

export class AddItemV2Dto extends CartItemV2Dto {
  //   @IsInt()
  //   readonly dish_id: number;

  @IsInt()
  readonly restaurant_id: number;

  //   @IsInt()
  //   @IsPositive()
  //   readonly quantity: number;
}

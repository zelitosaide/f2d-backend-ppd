import { Type } from "class-transformer";
import { IsArray, IsInt, ValidateNested } from "class-validator";
import { CartItemV2Dto } from "./cart-item-v2.dto";

export default class CreateCartV2Dto {
  @IsInt()
  readonly user_id: number;

  @IsInt()
  readonly restaurant_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemV2Dto)
  readonly items: CartItemV2Dto[];
}

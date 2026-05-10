import { Type } from "class-transformer";
import { IsArray, IsInt, ValidateNested } from "class-validator";
import { CartItemDto } from "./cart-item-dto";

export class CheckoutDto {
  @IsInt()
  readonly user_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  readonly items: CartItemDto[];
}

import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, ValidateNested } from "class-validator";
import { CartItemDto } from "./cart-item.dto";

export default class CreateCartDto {
  @IsInt()
  readonly user_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  readonly items: CartItemDto[];

  @IsNumber()
  readonly total: number;
}

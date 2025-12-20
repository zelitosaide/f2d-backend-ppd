import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";
import { CartItem } from "./cart-item-dto";

export class CreateCartDto {
  @IsInt()
  readonly user_id: number;

  @IsOptional()
  @Type(() => CartItem)
  readonly items: CartItem[];
}

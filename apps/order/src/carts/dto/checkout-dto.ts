import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, ValidateNested } from "class-validator";
import { CartItemDto } from "./cart-item-dto";
import { Address } from "./address.dto";

export class CheckoutDto {
  @IsInt()
  readonly user_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  readonly items: CartItemDto[];

  @IsOptional()
  @Type(() => Address)
  readonly address: Address;
}

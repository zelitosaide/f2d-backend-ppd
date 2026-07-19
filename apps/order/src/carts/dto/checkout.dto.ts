import { Type } from "class-transformer";
import { IsArray, IsDefined, IsInt, ValidateNested } from "class-validator";
import { CartItemDto } from "./cart-item.dto";
import { Address } from "./address.dto";

export class CheckoutDto {
  @IsInt()
  readonly user_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  readonly items: CartItemDto[];

  @ValidateNested()
  @IsDefined()
  @Type(() => Address)
  readonly address: Address;
}

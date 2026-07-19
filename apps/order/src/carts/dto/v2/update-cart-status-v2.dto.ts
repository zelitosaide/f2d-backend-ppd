import { IsEnum } from "class-validator";
import { CartStatus } from "../../enums/cart-status.enum";

export class UpdateCartStatusV2Dto {
  @IsEnum(CartStatus)
  readonly status: CartStatus;
}

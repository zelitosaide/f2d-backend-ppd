import { PaymentMethod } from "libs/common/src";
import { IsEnum, IsInt, IsNumber, Matches } from "class-validator";

export class CreatePaymentDto {
  @IsNumber()
  readonly amount: number;

  @IsEnum(PaymentMethod)
  readonly method: PaymentMethod;

  @IsInt()
  readonly user_id: number;

  @IsInt()
  readonly order_id: number;

  @Matches(/^258(82|83|84|85|86|87|88)\d{7}$/, {
    message: "phone_number must be in format 258XXXXXXXXX",
  })
  readonly phone_number: string;
}

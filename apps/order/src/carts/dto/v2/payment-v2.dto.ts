import { PaymentMethod } from "libs/common/src";
import { IsEnum, Matches } from "class-validator";

export class PaymentV2 {
  @IsEnum(PaymentMethod)
  readonly method: PaymentMethod;

  @Matches(/^258(82|83|84|85|86|87|88)\d{7}$/, {
    message: "phone_number must be in format 258XXXXXXXXX",
  })
  readonly phone_number: string;
}

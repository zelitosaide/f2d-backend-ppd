import { Type } from "class-transformer";
import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { AddressV2 } from "./address-v2.dto";
import { PaymentV2 } from "./payment-v2.dto";

export class CheckoutV2Dto {
  @IsString()
  @IsOptional()
  readonly notes: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => AddressV2)
  readonly address: AddressV2;

  @ValidateNested()
  @IsDefined()
  @Type(() => PaymentV2)
  readonly payment: PaymentV2;
}

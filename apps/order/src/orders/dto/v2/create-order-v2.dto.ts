import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { OrderItemV2Dto } from "./order-item-v2.dto";
import { AddressV2 } from "./address-v2.dto";
import { PaymentV2 } from "./payment-v2.dto";
import { OrderStatus } from "@app/orders";

export class CreateOrderV2Dto {
  @IsInt()
  readonly user_id: number;

  @IsInt()
  readonly restaurant_id: number;

  @IsString()
  readonly restaurant_name: string;

  @IsString()
  readonly restaurant_description: string;

  @IsString()
  readonly restaurant_cover_image_url: string;

  @IsString()
  readonly restaurant_logo_url: string;

  @IsString()
  @IsOptional()
  readonly notes: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  readonly status?: OrderStatus = OrderStatus.INITIATED;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemV2Dto)
  readonly items: OrderItemV2Dto[];

  @IsNumber()
  readonly subtotal: number;

  @ValidateNested()
  @IsDefined()
  @Type(() => AddressV2)
  readonly address: AddressV2;

  @ValidateNested()
  @IsDefined()
  @Type(() => PaymentV2)
  readonly payment: PaymentV2;
}

import { Type } from "class-transformer";
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsLatitude,
  IsLongitude,
} from "class-validator";
import { OrderStatus } from "../enum/order-status.enum";
import { OrderEventType } from "../enum/order-event-type.enum";

export class Address {
  @IsNumber()
  @IsLatitude()
  readonly latitude: number;

  @IsNumber()
  @IsLongitude()
  readonly longitude: number;
}

export class UpdateOrderStatusDataDto {
  @IsNumber()
  readonly orderId: number;

  @IsEnum(OrderStatus)
  readonly status: OrderStatus;

  @IsNumber()
  @IsOptional()
  readonly amount: number;

  @IsNumber()
  readonly userId: number;

  @IsOptional()
  @Type(() => Address)
  readonly address?: Address;
}

export class UpdateOrderStatusEventDto {
  @IsEnum(OrderEventType)
  readonly event: OrderEventType;

  @IsISO8601()
  readonly timestamp: string;

  @ValidateNested()
  @Type(() => UpdateOrderStatusDataDto)
  readonly data: UpdateOrderStatusDataDto;
}

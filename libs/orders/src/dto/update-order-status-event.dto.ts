import { Type } from "class-transformer";
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { OrderStatus } from "../enum/order-status.enum";
import { OrderEventType } from "../enum/order-event-type.enum";

// export enum Currency {
//   MZN = "MZN",
//   USD = "USD",
// }

export class UpdateOrderStatusDataDto {
  @IsNumber()
  readonly orderId: number;

  @IsEnum(OrderStatus)
  readonly status: OrderStatus;

  @IsNumber()
  @IsOptional()
  readonly amount: number;

  // @IsEnum(Currency)
  // readonly currency: Currency;

  @IsNumber()
  readonly userId: number;
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

import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { OrderItemDto } from "./order-item-dto";
import { OrderStatus } from "@app/orders";

export class CreateOrderDto {
  @IsInt()
  readonly user_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  readonly items: OrderItemDto[];

  @IsInt()
  readonly total: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  readonly status: OrderStatus = OrderStatus.CREATED;

  @IsOptional()
  @IsString()
  readonly notes?: string;

  //   @IsString()
  //   readonly address: string;
}

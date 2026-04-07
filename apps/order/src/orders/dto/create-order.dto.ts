import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
  @IsInt()
  readonly user_id: number;

  //   @IsArray()
  //   @ValidateNested({ each: true })
  //   @Type(() => OrderItemDto)
  //   readonly items: OrderItemDto[];

  //   @IsString()
  //   readonly address: string;

  @IsInt()
  readonly total: number;

  @IsOptional()
  @IsString()
  readonly status: string = "pending";

  @IsOptional()
  @IsString()
  readonly notes?: string;
}

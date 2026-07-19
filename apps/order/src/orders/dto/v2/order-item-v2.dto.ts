import { IsInt, IsNumber, IsPositive, IsString } from "class-validator";

export class OrderItemV2Dto {
  @IsInt()
  readonly dish_id: number;

  @IsString()
  readonly dish_name: string;

  @IsString()
  readonly dish_description: string;

  @IsString()
  readonly dish_image_url: string;

  @IsInt()
  @IsPositive()
  readonly quantity: number;

  @IsNumber()
  readonly price: number;
}

import { IsInt, IsNumber, IsString } from "class-validator";

export class CartItemDto {
  @IsInt()
  readonly restaurant_id: number;

  @IsInt()
  readonly dish_id: number;

  @IsString()
  readonly dish_name: string;

  @IsString()
  readonly dish_description: string;

  @IsString()
  readonly dish_image_url: string;

  @IsInt()
  readonly quantity: number;

  @IsNumber()
  readonly price: number;
}

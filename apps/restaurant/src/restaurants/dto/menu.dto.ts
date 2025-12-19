import { Type } from "class-transformer";
import { IsOptional, IsString, IsUrl } from "class-validator";
import { Dish } from "./dish.dto";

export class Menu {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsUrl()
  @IsOptional()
  readonly image_url: string;

  @IsOptional()
  @Type(() => Dish)
  readonly dishes: Dish[];
}

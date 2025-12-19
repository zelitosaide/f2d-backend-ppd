import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class Dish {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsUrl()
  readonly image_url: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;

  @IsBoolean()
  @IsOptional()
  readonly is_available: boolean;
}

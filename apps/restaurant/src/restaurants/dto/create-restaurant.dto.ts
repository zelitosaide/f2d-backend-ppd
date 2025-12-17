import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateRestaurantDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsOptional()
  @IsUrl()
  readonly cover_image_url: string;

  @IsOptional()
  @IsUrl()
  readonly logo_url: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsUrl()
  readonly website: string;

  @IsString()
  readonly phone_number: string;

  @IsOptional()
  @IsString()
  readonly opening_time: string;

  @IsOptional()
  @IsString()
  readonly closing_time: string;
}

import { Type } from "class-transformer";
import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator";
import { Menu } from "./menu.dto";
import { Address } from "./address.dto";

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
  @Type(() => Menu)
  readonly menus: Menu[];

  @IsOptional()
  @Type(() => Address)
  readonly address: Address;

  @IsOptional()
  @IsString()
  readonly opening_time: string;

  @IsOptional()
  @IsString()
  readonly closing_time: string;
}

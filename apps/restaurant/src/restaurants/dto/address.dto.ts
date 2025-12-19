import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class Address {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  readonly street: string;

  @IsString()
  @IsOptional()
  readonly city: string;

  @IsString()
  @IsOptional()
  readonly province: string;

  @IsPositive()
  @IsOptional()
  readonly zip_code: number;

  @IsString()
  @IsOptional()
  readonly country: string;

  @IsNumber()
  readonly latitude: number;

  @IsNumber()
  readonly longitude: number;
}

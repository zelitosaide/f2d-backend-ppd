import { IsLatitude, IsLongitude, IsNumber } from "class-validator";

export class Address {
  @IsNumber()
  @IsLatitude()
  readonly latitude: number;

  @IsNumber()
  @IsLongitude()
  readonly longitude: number;
}

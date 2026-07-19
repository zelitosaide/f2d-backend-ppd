import { Type } from "class-transformer";
import { IsLatitude, IsLongitude, IsNumber } from "class-validator";

export class AddressV2 {
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  readonly latitude: number;

  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  readonly longitude: number;
}

import { IsInt } from "class-validator";

export class UpdateItemQuantityDto {
  @IsInt()
  readonly quantity: number;
}

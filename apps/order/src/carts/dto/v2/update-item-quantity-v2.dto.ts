import { IsInt } from "class-validator";

export class UpdateItemQuantityV2Dto {
  @IsInt()
  readonly quantity: number;
}

import { IsString } from "class-validator";

export class UpdateOrderStatusDto {
  @IsString()
  readonly status: string;
}

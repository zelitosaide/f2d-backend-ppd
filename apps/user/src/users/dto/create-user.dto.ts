import { IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly phone_number: string;
}

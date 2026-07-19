import { Type } from "class-transformer";
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsLatitude,
  IsLongitude,
  IsString,
  IsObject,
} from "class-validator";
import { EventType } from "../enums/event-type.enum";

export class EventDto {
  @IsEnum(EventType)
  readonly event_type: EventType;

  @IsISO8601()
  readonly timestamp: string;

  @IsString()
  readonly source: string;

  @IsObject()
  readonly data: Record<string, any>;
}

// export class Address {
//   @IsNumber()
//   @IsLatitude()
//   readonly latitude: number;

//   @IsNumber()
//   @IsLongitude()
//   readonly longitude: number;
// }

// export class DataDto {
//   @IsNumber()
//   readonly orderId: number;

//   @IsNumber()
//   @IsOptional()
//   readonly amount: number;

//   @IsNumber()
//   readonly userId: number;

//   @IsOptional()
//   @Type(() => Address)
//   readonly address?: Address;
// }

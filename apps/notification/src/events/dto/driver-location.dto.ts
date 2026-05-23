import { IsNumber, IsString, Max, Min } from "class-validator";

export class DriverLocationDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  driverId: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsString()
  timestamp: string;
}

// WebSocket event payloads emitted to the client
export interface OrderNearbyPayload {
  orderId: number;
  driverLatitude: number;
  driverLongitude: number;
  distanceMeters: number;
  estimatedMinutes: number;
}

// Stored in Redis
export interface LocationSnapshot {
  orderId: number;
  driverId: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: OrderStatus;
}

// Destination stored when order is created
export interface OrderDestination {
  orderId: number;
  latitude: number;
  longitude: number;
}

// export interface OrderDestination {
//   orderId: number;
//   latitude: number;
//   longitude: number;
//   customerId: number;
// }

export enum OrderStatus {
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  NEARBY = "NEARBY",
  DELIVERED = "DELIVERED",
}

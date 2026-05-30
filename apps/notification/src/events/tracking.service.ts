import { Inject, Injectable } from "@nestjs/common";
import {
  DriverLocationDto,
  OrderDestination,
  OrderNearbyPayload,
} from "./dto/driver-location.dto";
import { estimateMinutes, haversineDistance } from "./geo.util";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";

const NEARBY_THRESHOLD_METERS = 500;

// const driverLocations = [
//   {
//     orderId: 1,
//     driverId: 101,
//     latitude: 40.7095,
//     longitude: -74.0102,
//   },
//   {
//     orderId: 1,
//     driverId: 102,
//     latitude: 40.7141,
//     longitude: -74.0045,
//   },
//   {
//     orderId: 1,
//     driverId: 103,
//     latitude: 40.7119,
//     longitude: -74.0071,
//   },
//   {
//     orderId: 1,
//     driverId: 104,
//     latitude: 40.7087,
//     longitude: -74.0058,
//   },
//   {
//     orderId: 1,
//     driverId: 105,
//     latitude: 40.7132,
//     longitude: -74.0029,
//   },
// ];

// [
//   {
//     latitude: -25.9449,
//     longitude: 32.5437,
//   },
//   {
//     latitude: -25.9461,
//     longitude: 32.5432,
//   },
//   {
//     latitude: -25.945,
//     longitude: 32.5465,
//   },
//   {
//     latitude: -25.9475,
//     longitude: 32.544,
//   },
// ];

@Injectable()
export class TrackingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async registerDestination(destination: OrderDestination): Promise<void> {
    await this.cacheManager.set(
      `tracking:destination:${destination.orderId}`,
      JSON.stringify({
        latitude: destination.latitude,
        longitude: destination.longitude,
      }),
    );
  }

  async processLocationUpdate(
    dto: DriverLocationDto,
  ): Promise<OrderNearbyPayload | null> {
    // await this.cacheManager.set(
    //   "tracking:destination",
    //   JSON.stringify({ latitude: 40.7128, longitude: -74.006 }),
    // );

    const destinationRaw = await this.cacheManager.get<string>(
      `tracking:destination:${dto.orderId}`,
    );

    if (!destinationRaw) {
      return null;
    }

    const destination: OrderDestination = JSON.parse(destinationRaw);

    const distance = haversineDistance(
      dto.latitude,
      dto.longitude,
      destination.latitude,
      destination.longitude,
    );

    const isNearby = distance <= NEARBY_THRESHOLD_METERS;

    if (!isNearby) {
      return null;
    }

    const nearbyFired = await this.cacheManager.get<string>(
      `tracking:nearby.fired:${dto.orderId}`,
    );

    if (nearbyFired) {
      return null;
    }

    await this.cacheManager.set(`tracking:nearby.fired:${dto.orderId}`, "1");

    return {
      orderId: dto.orderId,
      driverLatitude: dto.latitude,
      driverLongitude: dto.longitude,
      distanceMeters: Math.round(distance),
      estimatedMinutes: estimateMinutes(distance),
    };
  }
}

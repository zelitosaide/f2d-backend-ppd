/**
 * Haversine formula — returns distance in metres between two coordinates.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6_371_000; // Earth radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Rough ETA: assumes average delivery speed of 30 km/h in urban traffic.
 */
export function estimateMinutes(distanceMeters: number): number {
  const speedMps = 30_000 / 3600; // 30 km/h → m/s
  return Math.ceil(distanceMeters / speedMps / 60);
}

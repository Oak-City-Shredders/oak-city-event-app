import { LatLngBoundsExpression } from 'leaflet';

function parseLatLng(latlngStr: string): [number, number] | null {
  if (!latlngStr || typeof latlngStr !== 'string') return null;
  const parts = latlngStr.split(',').map((p) => parseFloat(p.trim()));
  if (parts.length !== 2 || parts.some(isNaN)) {
    console.warn(`Invalid LatLng string: "${latlngStr}"`);
    return null;
  }
  return [parts[0], parts[1]];
}

export function getValidatedBounds(
  bottomLeftLatLng: string,
  topRightLatLng: string
): LatLngBoundsExpression | null {
  const bottomLeft = parseLatLng(bottomLeftLatLng);
  const topRight = parseLatLng(topRightLatLng);

  if (!bottomLeft || !topRight) {
    console.error('Invalid eventInfo bounds. Falling back to default or null.');
    return null;
  }

  return [bottomLeft, topRight];
}

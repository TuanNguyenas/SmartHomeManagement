export const deviceTypes = {
  light: "light",
  fan: "fan",
  airConditioner: "Air Conditioner",
} as const;

export type DeviceType = keyof typeof deviceTypes;

import Device from "./device.interface";

export default interface Home {
  home_id: number;
  home_name: string;
  serial_number: string;
  aio_key: string;
  manager_id: number;
  devices: Device[];
}

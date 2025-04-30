export default interface ScheduleType {
  action: "on" | "off";
  action_days: string[];
  action_time: string;
  device_id: number;
  is_enable: boolean;
  value: number;
}

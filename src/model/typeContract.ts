import { Dayjs } from "dayjs";

export interface FormState {
  EventAddress: string;
  ClientFirstName: string;
  ClientLastName: string;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  eventDate: Dayjs | null;
  EventHours: string;
  eventName: string;
}
export interface ContractDetails {
  eventDate: Dayjs | null;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
}

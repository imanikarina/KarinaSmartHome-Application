import { format } from "date-fns"

export function twoDigitString(num: number) {
  return num.toLocaleString('id-ID', {minimumIntegerDigits: 2})
};

export function hundredHour(time?: Date) {
  return time ? format(time, 'HHmm') : '9999';
}
import { format } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

export const ISO_FORMAT = 'yyyy-MM-dd[T]HH:mm:ss.SSSX';

export const DEFAULT_DATE_TIME_FORMAT = 'dd.MM.yyyy, HH:mm:ss';

export const formatDateToDefaultFormat = (date: Date | string): string =>
  format(new Date(date), DEFAULT_DATE_TIME_FORMAT);

export const DEFAULT_DATE_TIME_FORMAT_MSK = 'dd.MM.yyyy, HH:mm:ss (МСК)';
export const MOSCOW_LOCALE = 'Europe/Moscow';

export const formatDateToDefaultFormatMsk = (date: Date | string): string =>
  formatInTimeZone(new Date(date), MOSCOW_LOCALE, DEFAULT_DATE_TIME_FORMAT_MSK);

export const formatDateToAntdInput = (date: Date | string): string => {
  if (!date) return '';

  return formatInTimeZone(date, MOSCOW_LOCALE, "yyyy-MM-dd'T'HH:mm");
};

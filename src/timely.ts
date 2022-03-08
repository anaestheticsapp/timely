/*
function getMonthNumber(month) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formatted = month.charAt(0).toUpperCase() + month.substr(1, month.length - 1).toLowerCase();
  return months.indexOf(formatted);
}
*/

function stringToArray(value: string) {
  if (!value) return {};
  let year: number, month: number, day: number, hrs: number, min: number, sec: number;
  const separator = value.replace(/[A-Za-z0-9]/g, '')[0];
  if (separator === ':') {
    [hrs, min = 0, sec = 0] = value.split(separator).map((i) => +i);
    return { hrs, min, sec };
  } else {
    const arr = value.split(separator)
    year = arr[0].length === 4 ? +arr[0] : +arr[2];
    day = arr[0].length === 2 ? +arr[0] : +arr[2];
    month = +arr[1];
    //if (month.length === 3) month = getMonthNumber(month) + 1; // currently not working as space separator not functional with 14 Apr 2021
    return { year, month, day };
  }
}
function parseDateTime(value: string, format: string) {
  switch (format) {
    default:
      const [date, time] = value.split(' ');
      const { year, month, day } = stringToArray(date);
      const { hrs = 0, min = 0, sec = 0 } = stringToArray(time);
      return new Date(+year, +month - 1, +day, +hrs, +min, +sec);
  }
  //const [dateFormat, timeFormat = 'HH:mm:ss'] = format.split(' ');
  //const { hrs, min, sec } = stringToArray(time, timeFormat);
}
function parseDateArgument(date: Date | number[] | string, format?: string) {
  if (date instanceof Date) {
    return new Date(+date);
  } else if (Array.isArray(date)) {
    const [YYYY, MM = 0, DD = 1, HH = 0, mm = 0, ss = 0] = date;
    return new Date(YYYY, MM, DD, HH, mm, ss);
  } else if (typeof date === 'number') {
    return new Date(date);
  } else if (date.split('T').length === 2) {
    return new Date(date);
  } else {
    return parseDateTime(date, format);
  }
}

export default class Timely {
  _locale: string;
  _timeZone: string;
  _UTC: boolean;
  _date: Date;

  constructor(date: Date | number[] | string = new Date(), format: string = null, locale = 'en-GB') {
    this._locale = locale;
    this._timeZone = null;
    this._UTC = false;
    this._date = parseDateArgument(date, format);
  }

  setTime(hrs: number, min = 0, sec = 0, msec = 0) {
    this._date.setHours(+hrs, +min, +sec, +msec);
    return this;
  }
  setDate(year: number, month = 0, day = 1) {
    this._date.setFullYear(+year, +month, +day);
    return this;
  }

  subtract(value: number, units = 'days') {
    if (units == 'days') this._date.setDate(this._date.getDate() - value);
    else if (units == 'months') this._date.setMonth(this._date.getMonth() - value);
    else if (units == 'years') this._date.setFullYear(this._date.getFullYear() - value);
    else throw new Error('Unknown units');

    return this;
  }
  add(value: number, units = 'days') {
    if (units == 'days') this._date.setDate(this._date.getDate() + value);
    else if (units == 'months') this._date.setMonth(this._date.getMonth() + value);
    else if (units == 'years') this._date.setFullYear(this._date.getFullYear() + value);
    else throw new Error('Unknown units');

    return this;
  }
  timeZone(zone: string) {
    this._timeZone = zone;
    return this;
  }

  instance() {
    return this._date;
  }
  format(format = 'Date') {
    const values =
      this._timeZone === 'UTC'
        ? [
            this._date.getUTCDate(),
            this._date.getUTCMonth() + 1,
            this._date.getUTCFullYear(),
            this._date.getUTCHours(),
            this._date.getUTCMinutes(),
            this._date.getUTCSeconds(),
          ]
        : [
            this._date.getDate(),
            this._date.getMonth() + 1,
            this._date.getFullYear(),
            this._date.getHours(),
            this._date.getMinutes(),
            this._date.getSeconds(),
          ];
    const [day, month, year, hrs, min, sec] = values.map((item) => item.toString().padStart(2, '0'));

    switch (format) {
      case 'DateTime':
        return year + '-' + month + '-' + day + ' ' + hrs + ':' + min + ':' + sec;
      case 'Date':
        return year + '-' + month + '-' + day;
      case 'Time':
        return hrs + ':' + min + ':' + sec;
      case 'HoursMinutes':
        return hrs + ':' + min;
      case 'YearMonth':
        return year + '-' + month;
      case 'MonthDay':
        return month + '-' + day;
      case 'Month':
        return parseInt(month);
      case 'Array':
        return [this._date.getFullYear(), this._date.getMonth() + 1, this._date.getDate()];
      case 'dd/MM/yyyy':
        // NON-STANDRAD should use locale() for this
        return day + '/' + month + '/' + year;
      default:
        //elog(`${format} not found @timely:102`);
        return null;
    }
  }
  locale(format = 'ShortMonth') {
    const timeZone = this._timeZone ? this._timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone;

    const present = new Date('2100-01-01');
    if (this._date.getTime() == present.getTime()) return 'Present';

    const NUMERIC = 'numeric';
    const LONG = 'long';
    const SHORT = 'short';
    const DIGIT = '2-digit';

    const year = NUMERIC;
    const weekday = LONG;
    const hour = DIGIT;
    const minute = DIGIT;

    switch (format) {
      case 'Time':
        return this._date.toLocaleTimeString(this._locale, { timeZone });
      case 'Date':
        return this._date.toLocaleDateString(this._locale, { year, month: DIGIT, day: DIGIT });
      case 'DateTime':
        return this._date.toLocaleDateString(this._locale, { year, month: DIGIT, day: DIGIT, hour, minute });
      case 'LongDate':
        return this._date.toLocaleDateString(this._locale, { year, weekday, month: LONG, day: NUMERIC });
      case 'ShortDate':
        return this._date.toLocaleDateString(this._locale, { year, month: SHORT, day: NUMERIC });
      case '1.1':
        return this._date.toLocaleDateString(this._locale, { month: NUMERIC, day: NUMERIC });
      case '1 Jan':
        return this._date.toLocaleDateString(this._locale, { month: SHORT, day: NUMERIC });
      case 'DateWithLongMonth':
        return this._date.toLocaleDateString(this._locale, { year, month: LONG, day: NUMERIC });
      case 'LongDayAndMonth':
        return this._date.toLocaleDateString(this._locale, { weekday, month: LONG, day: NUMERIC });
      case 'ShortMonth':
        return this._date.toLocaleDateString(this._locale, { month: SHORT });
      case 'ShortMonthYear':
        return this._date.toLocaleDateString(this._locale, { month: SHORT, year });
      case 'LongMonthYear':
        return this._date.toLocaleDateString(this._locale, { month: LONG, year });
      default:
        //elog(`${format} not found @timely:123`);
        return null;
    }
  }
  toString() {
    return this._date.toISOString();
  }
  year() {
    return this._date.getFullYear();
  }
  month(format: 'numeric' | '2-digit' | 'short' | 'long' | 'narrow' | 'index' = 'index') {
    return format === 'index' ? this._date.getMonth() : this._date.toLocaleString(this._locale, { month: format });
  }
  day() {
    return this._date.getDate();
  }
  weekday(format: 'short' | 'long' | 'narrow' | 'index' = 'index') {
    const dt = this._date;
    return format === 'index' ? dt.getDay() : dt.toLocaleString(this._locale, { weekday: format });
  }
  // calendarWeek??
  weekNumber() {
    const dt = new Date(Date.UTC(this._date.getFullYear(), this._date.getMonth(), this._date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    dt.setUTCDate(dt.getUTCDate() + 4 - (dt.getUTCDay() || 7));

    const firstDayOfYear = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));

    // Calculate full weeks to nearest Thursday
    const oneDay = 86400000;
    const weekNo = Math.ceil(((dt.getTime() - firstDayOfYear.getTime()) / oneDay + 1) / 7);
    // Return array of year and week number
    return [dt.getUTCFullYear(), weekNo];
  }
  timestamp() {
    return this._date.getTime();
  }

  diff(date: Date, units = 'hrs') {
    const _date = parseDateArgument(date);
    const diff = this._date.getTime() - _date.getTime();
    const parseUnits = {
      sec: 1000,
      min: 60 * 1000,
      hrs: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000, // hrs * min * sec * msec
    };
    const TIME_UNITS = parseUnits[units];
    if (TIME_UNITS === undefined) throw new Error('No time units found');
    return Math.floor(Math.abs(diff / TIME_UNITS));
  }

  isEqual(date) {
    const _date = parseDateArgument(date);
    return (
      this._date.getFullYear() === _date.getFullYear() &&
      this._date.getMonth() === _date.getMonth() &&
      this._date.getDate() === _date.getDate()
    );
  }
  isLeapYear(year) {
    return year % 100 === 0 ? (year % 400 === 0 ? true : false) : year % 4 === 0;
  }

  daysInMonth() {
    const year = this._date.getFullYear();
    const month = this._date.getMonth();
    return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }
}

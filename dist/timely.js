let locale = 'en-GB';

function stringToArray(value) {
  if (!value) return {};
  let year, month, day, hrs, min, sec;
  const separator = value.replace(/[A-Za-z0-9]/g, '')[0];
  if (separator === ':') {
    [hrs, min = 0, sec = 0] = value.split(separator);
    return { hrs, min, sec };
  } else {
    const arr = value.split(separator);
    year = arr[0].length === 4 ? arr[0] : arr[2];
    day = arr[0].length === 2 ? arr[0] : arr[2];
    month = arr[1];
    //if (month.length === 3) month = getMonthNumber(month) + 1; // currently not working as space separator not functional with 14 Apr 2021
    return { year, month, day };
  }
}
function parseDateTime(value, format) {
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
function parseDateArgument(date, format) {
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

class Timely {
  constructor(date = new Date(), format = null) {
    this._locale = null;
    this._UTC = false;
    this._date = parseDateArgument(date, format);
  }

  setTime(hrs, min = 0, sec = 0, msec = 0) {
    this._date.setHours(+hrs, +min, +sec, +msec);
    return this;
  }
  setDate(year, month = 0, day = 1) {
    this._date.setFullYear(+year, +month, +day);
    return this;
  }

  subtract(value, units = 'days') {
    if (units == 'days') this._date.setDate(this._date.getDate() - value);
    else if (units == 'years') this._date.setFullYear(this._date.getFullYear() - value);
    else throw new Error('Unknown units');

    return this;
  }
  add(value, units = 'days') {
    if (units == 'days') this._date.setDate(this._date.getDate() + value);
    else if (units == 'months') this._date.setMonth(this._date.getMonth() + value);
    else if (units == 'years') this._date.setFullYear(this._date.getFullYear() + value);
    else throw new Error('Unknown units');

    return this;
  }
  timeZone(zone) {
    this._locale = zone;
    return this;
  }

  instance() {
    return this._date;
  }
  format(format = 'Date') {
    const values =
      this._locale === 'UTC'
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
      case 'dd/MM/yyyy':
        // NON-STANDRAD should use locale() for this
        return day + '/' + month + '/' + year;
      default:
        elog(`${format} not found @timely:102`);
        return null;
    }
  }
  locale(format = 'ShortMonth') {
    const timeZone = this._locale ? this._locale : Intl.DateTimeFormat().resolvedOptions().timeZone;

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
        return this._date.toLocaleTimeString(locale, { timeZone });
      case 'Date':
        return this._date.toLocaleDateString(locale, { year, month: DIGIT, day: DIGIT });
      case 'DateTime':
        return this._date.toLocaleDateString(locale, { year, month: DIGIT, day: DIGIT, hour, minute });
      case 'LongDate':
        return this._date.toLocaleDateString(locale, { year, weekday, month: LONG, day: NUMERIC });
      case 'ShortDate':
        return this._date.toLocaleDateString(locale, { year, month: SHORT, day: NUMERIC });
      case 'DateWithLongMonth':
        return this._date.toLocaleDateString(locale, { year, month: LONG, day: NUMERIC });
      case 'LongDayAndMonth':
        return this._date.toLocaleDateString(locale, { weekday, month: LONG, day: NUMERIC });
      case 'ShortMonth':
        return this._date.toLocaleDateString(locale, { month: SHORT });
      case 'ShortMonthYear':
        return this._date.toLocaleDateString(locale, { month: SHORT, year });
      default:
        elog(`${format} not found @timely:123`);
        return null;
    }
  }
  toString() {
    return this._date.toISOString();
  }
  year() {
    return this._date.getFullYear();
  }
  month(format = 'index') {
    return format === 'index' ? this._date.getMonth() : this._date.toLocaleString(locale, { month: format });
  }
  day() {
    return this._date.getDate();
  }
  weekday(format = 'index') {
    const dt = this._date;
    return format === 'index' ? dt.getDay() : dt.toLocaleString(locale, { weekday: format });
  }
  timestamp() {
    return this._date.getTime();
  }

  diff(date, units = 'hrs') {
    const _date = parseDateArgument(date);
    const diff = this._date - _date;
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
const timely = (date, format) => new Timely(date, format);

export default timely;

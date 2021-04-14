// v2
/**
 * @param {string} format   - function   | long       | short | narrow  | index
 * @returns {string|number} - weekday    | Thursday   | Thu   | T       | 4 (Sunday is 0)
 * @returns {string|number} - month      | March      | Mar   | M       | 2 (use format for number of month)
 */

 function getMonthNumber(month) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formatted = month.charAt(0).toUpperCase() + month.substr(1, month.length - 1).toLowerCase();
  return months.indexOf(formatted);
}
function stringToArray(value, format) {
  let year, month, day, hrs, min, sec;
  const separator = format.replace(/y|m|d|h|m|s/gi, '')[0];
  switch (format) {
    case 'yyyy-MM-dd':
    case 'yyyy/MM/dd':
      [year, month, day] = value.split(separator);
      return { year, month, day };
    case 'dd-MM-yyyy':
    case 'dd.MM.yyyy':
    case 'dd/MM/yyyy':
    case 'dd MMM yyyy':
    case 'dd-MMM-yyyy':
    case 'dd.MMM.yyyy':
    case 'dd/MMM/yyyy':
      [day, month, year] = value.split(separator);
      if (format.includes('MMM')) month = getMonthNumber(month) + 1;
      return { year, month, day };
    case 'HH:mm:ss':
      [hrs, min = 0, sec = 0] = value.split(separator);
      return { hrs, min, sec };
    default:
      elog(`${format} not found @timely:39`);
      return {};
  }
}
function parseDate(value, format = 'yyyy-MM-dd') {
  const { year, month, day } = stringToArray(value, format);
  return new Date(+year, +month - 1, +day);
}
function parseDateTime(value, format = 'yyyy-MM-dd HH:mm:ss') {
  const [date, time] = value.split(' ');
  const [dateFormat, timeFormat = 'HH:mm:ss'] = format.split(' ');
  const { year, month, day } = stringToArray(date, dateFormat);
  const { hrs, min, sec } = stringToArray(time, timeFormat);
  return new Date(+year, +month - 1, +day, +hrs, +min, +sec);
}

function formatDate(date, format = 'Date') {
  const values = [
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
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
      // NON-STANDRAD should use localeDate for this
      return day + '/' + month + '/' + year;
    default:
      elog(`${format} not found @timely:102`);
  }
}
function localeDate(dateObj, options = {}) {
  const locale = options.locale ? options.locale : 'en-GB';
  const format = options.format ? options.format : 'DateShortMonth';

  const present = new Date('2100-01-01');
  if (dateObj.getTime() == present.getTime()) return 'Present';

  const NUMERIC = 'numeric';
  const LONG = 'long';
  const SHORT = 'short';
  const DIGIT = '2-digit';

  const year = NUMERIC;
  const weekday = LONG;
  const hour = DIGIT;
  const minute = DIGIT;

  switch (format) {
    case 'Date':
      return dateObj.toLocaleDateString(locale, { year, month: DIGIT, day: DIGIT });
    case 'DateTime':
      return dateObj.toLocaleDateString(locale, { year, month: DIGIT, day: DIGIT, hour, minute });
    case 'LongDate':
      // en-GB Friday, 1 November 2019
      return dateObj.toLocaleDateString(locale, { year, weekday, month: LONG, day: NUMERIC });
    case 'ShortDate':
      // en-GB 1 Nov 2019
      return dateObj.toLocaleDateString(locale, { year, month: SHORT, day: NUMERIC });
    case 'DateWithLongMonth':
      // en-GB 1 November 2019
      return dateObj.toLocaleDateString(locale, { year, month: LONG, day: NUMERIC });
    case 'LongDayAndMonth':
      // en-GB Friday, 1 November
      return dateObj.toLocaleDateString(locale, { weekday, month: LONG, day: NUMERIC });
    case 'ShortMonth':
      // en-GB Friday, 1 November
      return dateObj.toLocaleDateString(locale, { month: SHORT });
    default:
      elog(`${format} not found @timely:123`);
  }
}

// new object
class DateTime {
  constructor(date = new Date(), format) {
    this._locale = 'en-GB';
    this._date = this._parseInput(date, format);
  }

  _parseInput(date = new Date(), format) {
    if (date instanceof Date) {
      return date;
    } else if (Array.isArray(date)) {
      const [YYYY, MM = 0, DD = 1, HH = 0, mm = 0, ss = 0] = date;
      return new Date(YYYY, MM, DD, HH, mm, ss);
    } else if (typeof date === 'number') {
      return new Date(date);
    } else if (date.split('T').length === 2) {
      // ISO Date
      return new Date(date);
    } else if (date.split(' ').length === 2) {
      // deprecate
      return parseDateTime(date, format);
    } else {
      return parseDate(date, format);
    }
  }

  format(format) {
    return formatDate(this._date, format);
  }
  locale(opts) {
    return localeDate(this._date, opts);
  }

  setTime(hrs, min = 0, sec = 0) {
    this._date.setHours(+hrs, +min, +sec);
    return this;
  }
  setDate(year, month = 0, day = 1) {
    this._date.setFullYear(+year, +month, +day);
    return this;
  }
  subtract(value, units = 'days') {
    if (units == 'days') this._date.setDate(this._date.getDate() - value);
    return this;
  }

  timeZone(zone = 'UTC') {
    return this._date.toLocaleTimeString('en-GB', { timeZone: zone });
  }

  instance() {
    return this._date;
  }
  toString() {
    return this._date.toISOString();
  }
  year() {
    return this._date.getFullYear();
  }
  month(format = 'index') {
    const dt = this._date;
    return format === 'index' ? dt.getMonth() : dt.toLocaleString(this._locale, { month: format });
  }
  day() {
    return this._date.getDate();
  }
  weekday(format = 'index') {
    const dt = this._date;
    return format === 'index' ? dt.getDay() : dt.toLocaleString(this._locale, { weekday: format });
  }
  time() {
    return this._date.getTime();
  }

  diff(date, units = 'hrs') {
    const _date = this._parseInput(date);
    const diff = this._date - _date;
    const parseUnits = {
      sec: 1000,
      min: 60 * 1000,
      hrs: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000, // hrs * min * sec * msec
    };
    const TIME_UNITS = parseUnits[units];
    return Math.floor(Math.abs(diff / TIME_UNITS));
  }

  isEqual(date) {
    const _date = this._parseInput(date);
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

  getUTCDate() {
    const dt = this._date;
    let day = dt.getUTCDate();
    let month = dt.getUTCMonth() + 1;
    let year = dt.getUTCFullYear();
    let hrs = dt.getUTCHours();
    let min = dt.getUTCMinutes();
    let sec = dt.getUTCSeconds();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hrs = hrs < 10 ? '0' + hrs : hrs;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    return year + '-' + month + '-' + day + ' ' + hrs + ':' + min + ':' + sec;
  }
}
const timely = (date, format) => new DateTime(date, format);

export default timely;

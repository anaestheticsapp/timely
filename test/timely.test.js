import timely from '../src/timely.js';
import { expect } from 'chai';

describe('timely', () => {
  const YEAR = '2021',
    MONTH = '04',
    MMM = 'Apr',
    DAY = '14',
    HRS = '13',
    MIN = '35',
    SEC = '20',
    MSEC = '00';
  const DASH = '-',
    SLASH = '/',
    DOT = '.',
    COLON = ':',
    SPACE = ' ';

  const array = [+YEAR, +MONTH - 1, +DAY, +HRS, +MIN, +SEC, +MSEC];
  const date = new Date(+YEAR, +MONTH - 1, +DAY, 0, 0, 0, 0);
  const datetime = new Date(+YEAR, +MONTH - 1, +DAY, +HRS, +MIN, +SEC, +MSEC);
  const timestamp = datetime.getTime();
  const isoString = datetime.toISOString();
  const now = new Date();

  describe('#constructor()', () => {
    describe('with no arguments', () => {
      it('should create new Date() constructor with current date and time', () =>
        expect(timely()._date instanceof Date).to.be.true);
    });
    describe('with standardised date argument', () => {
      context('new Date()', () => {
        it('should return self', () => expect(timely(datetime)._date).to.deep.equal(datetime));
      });
      context(`Array [${array.join(', ')}]`, () => {
        it('should return ' + datetime, () => expect(timely(array)._date).to.deep.equal(datetime));
      });
      context('Timestamp ' + timestamp, () => {
        it('should return ' + datetime, () => expect(timely(timestamp)._date).to.deep.equal(datetime));
      });
      context('ISO String ' + isoString, () => {
        it('should return ' + datetime, () => expect(timely(isoString)._date).to.deep.equal(datetime));
      });
    });
    describe('with string', () => {
      context(YEAR + DASH + MONTH + DASH + DAY, () => {
        it('should return ' + date, () => expect(timely(YEAR + DASH + MONTH + DASH + DAY)._date).to.deep.equal(date));
      });
      context(DAY + DASH + MONTH + DASH + YEAR, () => {
        it('should return ' + date, () => expect(timely(DAY + DASH + MONTH + DASH + YEAR)._date).to.deep.equal(date));
      });
      context(DAY + SLASH + MONTH + SLASH + YEAR, () => {
        it('should return ' + date, () => expect(timely(DAY + SLASH + MONTH + SLASH + YEAR)._date).to.deep.equal(date));
      });
      context(DAY + DOT + MONTH + DOT + YEAR, () => {
        it('should return ' + date, () => expect(timely(DAY + DOT + MONTH + DOT + YEAR)._date).to.deep.equal(date));
      });
      context(YEAR + DASH + MONTH + DASH + DAY + SPACE + HRS + COLON + MIN + COLON + SEC, () => {
        it('should return ' + datetime, () =>
          expect(
            timely(YEAR + DASH + MONTH + DASH + DAY + SPACE + HRS + COLON + MIN + COLON + SEC)._date
          ).to.deep.equal(datetime)
        );
      });
    });
  });
  describe('#setTime()', () => {
    it('should return ' + datetime, () =>
      expect(timely([+YEAR, +MONTH - 1, +DAY]).setTime(+HRS, +MIN, +SEC, +MSEC)._date).to.deep.equal(datetime)
    );
  });
  describe('#setDate()', () => {
    it('should return ' + date, () =>
      expect(
        timely()
          .setTime(0)
          .setDate(+YEAR, +MONTH - 1, +DAY)._date
      ).to.deep.equal(date)
    );
  });
  describe('#subtract()', () => {
    context('-5 days', () => {
      it('should subtract 5 days', () =>
        expect(timely(date).subtract(5, 'days')._date).to.deep.equal(new Date(+YEAR, +MONTH - 1, +DAY - 5)));
    });
  });
  describe('#instance()', () => {
    it('should return the current instance', () => expect(timely()._date instanceof Date).to.be.true);
  });
  describe('#format(format, UTC = false)', () => {
    context('DateTime, UTC', () => {
      it(`should return 2021-04-14 11:35:20`, () =>
        expect(timely(datetime).timeZone('UTC').format('DateTime')).to.equal('2021-04-14 11:35:20'));
    });
    context('DateTime', () => {
      it(`should return 2021-04-14 13:35:20`, () =>
        expect(timely(datetime).format('DateTime')).to.equal('2021-04-14 13:35:20'));
    });
    context('Date', () => {
      it(`should return 2021-04-14`, () => expect(timely(datetime).format('Date')).to.equal('2021-04-14'));
    });
    context('Time', () => {
      it(`should return 13:35:20`, () => expect(timely(datetime).format('Time')).to.equal('13:35:20'));
    });
    context('HoursMinutes', () => {
      it(`should return 13:35`, () => expect(timely(datetime).format('HoursMinutes')).to.equal('13:35'));
    });
    context('YearMonth', () => {
      it(`should return 2021-04`, () => expect(timely(datetime).format('YearMonth')).to.equal('2021-04'));
    });
    context('MonthDay', () => {
      it(`should return 04-14`, () => expect(timely(datetime).format('MonthDay')).to.equal('04-14'));
    });
    context('Month', () => {
      it(`should return 4`, () => expect(timely(datetime).format('Month')).to.equal(4));
    });
    context('dd/MM/yyyy', () => {
      it(`should return 14/04/2021`, () => expect(timely(datetime).format('dd/MM/yyyy')).to.equal('14/04/2021'));
    });
  });
  describe('#locale()', () => {
    context('Time UTC', () => {
      it(`should return 11:35:20`, () => expect(timely(datetime).timeZone('UTC').locale('Time')).to.equal('11:35:20'));
    });
    context('Time', () => {
      it(`should return 13:35:20`, () => expect(timely(datetime).locale('Time')).to.equal('13:35:20'));
    });
    context('Date', () => {
      it(`should return 14/04/2021`, () => expect(timely(datetime).locale('Date')).to.equal('14/04/2021'));
    });
    context('DateTime', () => {
      it(`should return 14/04/2021, 13:35`, () =>
        expect(timely(datetime).locale('DateTime')).to.equal('14/04/2021, 13:35'));
    });
    context('LongDate', () => {
      it(`should return Wednesday, 14 April 2021`, () =>
        expect(timely(datetime).locale('LongDate')).to.equal('Wednesday, 14 April 2021'));
    });
    context('ShortDate', () => {
      it(`should return 14 Apr 2021`, () => expect(timely(datetime).locale('ShortDate')).to.equal('14 Apr 2021'));
    });
    context('DateWithLongMonth', () => {
      it(`should return 14 April 2021`, () =>
        expect(timely(datetime).locale('DateWithLongMonth')).to.equal('14 April 2021'));
    });
    context('LongDayAndMonth', () => {
      it(`should return Wednesday, 14 April`, () =>
        expect(timely(datetime).locale('LongDayAndMonth')).to.equal('Wednesday, 14 April'));
    });
    context('ShortMonth', () => {
      it(`should return Apr`, () => expect(timely(datetime).locale('ShortMonth')).to.equal('Apr'));
    });
  });
  describe('#toString()', () => {
    it(`should return 2021-04-14T11:35:20.000Z`, () =>
      expect(timely(datetime).toString()).to.equal('2021-04-14T11:35:20.000Z'));
  });
  describe('#year()', () => {
    it(`should return 2021`, () => expect(timely(datetime).year()).to.equal(2021));
  });
  describe(`#month(format)`, () => {
    context('index (default)', () => {
      it(`should return integer 3 for April`, () => expect(timely(datetime).month()).to.equal(3));
    });
    context('long', () => {
      it(`should return April`, () => expect(timely(datetime).month('long')).to.equal('April'));
    });
    context('short', () => {
      it(`should return Apr`, () => expect(timely(datetime).month('short')).to.equal('Apr'));
    });
    context('2-digit', () => {
      it(`should return 04`, () => expect(timely(datetime).month('2-digit')).to.equal('04'));
    });
    context('numeric', () => {
      it(`should return string 4`, () => expect(timely(datetime).month('numeric')).to.equal('4'));
    });
  });
  describe('#day()', () => {
    it(`should return integer 14`, () => expect(timely(datetime).day()).to.equal(14));
  });
  describe('#weekday()', () => {
    context(`index (default)`, () => {
      it(`should return integer 1 for Monday`, () => expect(timely([+YEAR, +MONTH - 1, 12]).weekday()).to.equal(1));
      it(`should return integer 3 for Wednesday`, () => expect(timely(datetime).weekday()).to.equal(3));
    });
    context(`long`, () => {
      it(`should return Wednesday`, () => expect(timely(datetime).weekday('long')).to.equal('Wednesday'));
    });
    context(`short`, () => {
      it(`should return Wed`, () => expect(timely(datetime).weekday('short')).to.equal('Wed'));
    });
  });
  describe('#timestamp()', () => {
    it(`should return integer 1618400120000`, () => expect(timely(datetime).timestamp()).to.equal(1618400120000));
  });
  describe('#diff()', () => {
    const twoHours = new Date(+YEAR, +MONTH - 1, +DAY, +HRS - 2, +MIN, +SEC, +MSEC);
    const fourDays = new Date(+YEAR, +MONTH - 1, +DAY + 4, +HRS, +MIN, +SEC, +MSEC);
    context(`-2 hours`, () => {
      it(`should return integer 2 for hrs (default units)`, () => expect(timely(datetime).diff(twoHours)).to.equal(2));
      it(`should return integer 120 for min`, () => expect(timely(datetime).diff(twoHours, 'min')).to.equal(120));
    });
    context(`+4 days`, () => {
      it(`should return integer 4 for days`, () => expect(timely(datetime).diff(fourDays, 'days')).to.equal(4));
      it(`should return integer 96 for hours`, () => expect(timely(datetime).diff(fourDays, 'hrs')).to.equal(96));
      it(`should return integer 5760 for minutes`, () => expect(timely(datetime).diff(fourDays, 'min')).to.equal(5760));
    });
  });
  describe('#isEqual()', () => {
    it(`should return true for same Date()`, () => expect(timely(datetime).isEqual(datetime)).to.be.true);
  });
  describe('#isLeapYear()', () => {
    it(`should return false for 2021`, () => expect(timely(datetime).isLeapYear(2021)).to.be.false);
    it(`should return true for 2020`, () => expect(timely(datetime).isLeapYear(2020)).to.be.true);
  });
  describe('#daysInMonth()', () => {
    it(`should return integer 31 for January 2021`, () => expect(timely([2021, 0, +DAY]).daysInMonth()).to.equal(31));
    it(`should return integer 28 for February 2021`, () => expect(timely([2021, 1, +DAY]).daysInMonth()).to.equal(28));
    it(`should return integer 29 for February 2020`, () => expect(timely([2020, 1, +DAY]).daysInMonth()).to.equal(29));
    it(`should return integer 30 for April 2021`, () => expect(timely([2021, 3, +DAY]).daysInMonth()).to.equal(30));
  });
});

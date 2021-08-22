timely
    #constructor()
      with no arguments
        √ should create new Date() constructor with current date and time
      with standardised date argument
        new Date()
          √ should return self
        Array [2021, 3, 14, 13, 35, 20, 0]
          √ should return Wed Apr 14 2021 13:35:20 GMT+0200 (Mitteleuropäische Sommerzeit)
        Timestamp 1618400120000
          √ should return Wed Apr 14 2021 13:35:20 GMT+0200 (Mitteleuropäische Sommerzeit)
        ISO String 2021-04-14T11:35:20.000Z
          √ should return Wed Apr 14 2021 13:35:20 GMT+0200 (Mitteleuropäische Sommerzeit)
      with string
        2021-04-14
          √ should return Wed Apr 14 2021 00:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)
        14-04-2021
          √ should return Wed Apr 14 2021 00:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)
        14/04/2021
          √ should return Wed Apr 14 2021 00:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)
        14.04.2021
          √ should return Wed Apr 14 2021 00:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)
        2021-04-14 13:35:20
          √ should return Wed Apr 14 2021 13:35:20 GMT+0200 (Mitteleuropäische Sommerzeit)
        14/04/2021 13:35:20
          √ should return Wed Apr 14 2021 13:35:20 GMT+0200 (Mitteleuropäische Sommerzeit)
    #setTime()
      √ should return Wed Apr 14 2021 13:35:20 GMT+0200 (Mitteleuropäische Sommerzeit)
    #setDate()
      √ should return Wed Apr 14 2021 00:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)
    #subtract(value, units = days|years)
      √ should subtract 5 days
      √ should subtract 1 year
    #add(value, units = days|years)
      √ should add 5 days
      √ should add 3 months
      √ should add 1 year
    #instance()
      √ should return the current instance
    #format(format, UTC = false)
      DateTime, UTC
        √ should return 2021-04-14 11:35:20
      DateTime
        √ should return 2021-04-14 13:35:20
      Date
        √ should return 2021-04-14
      Time
        √ should return 13:35:20
      HoursMinutes
        √ should return 13:35
      YearMonth
        √ should return 2021-04
      MonthDay
        √ should return 04-14
      Month
        √ should return 4
      dd/MM/yyyy
        √ should return 14/04/2021
    #locale()
      Time UTC
        √ should return 11:35:20 (61ms)
      Time
        √ should return 13:35:20
      Date
        √ should return 14/04/2021
      DateTime
        √ should return 14/04/2021, 13:35
      LongDate
        √ should return Wednesday, 14 April 2021
      ShortDate
        √ should return 14 Apr 2021
      DateWithLongMonth
        √ should return 14 April 2021
      LongDayAndMonth
        √ should return Wednesday, 14 April
      ShortMonth
        √ should return Apr
      ShortMonthYear
        √ should return Apr 2021
    #toString()
      √ should return 2021-04-14T11:35:20.000Z
    #year()
      √ should return 2021
    #month(format)
      index (default)
        √ should return integer 3 for April
      long
        √ should return April
      short
        √ should return Apr
      2-digit
        √ should return 04
      numeric
        √ should return string 4
    #day()
      √ should return integer 14
    #weekday()
      index (default)
        √ should return integer 1 for Monday
        √ should return integer 3 for Wednesday
      long
        √ should return Wednesday
      short
        √ should return Wed
    #timestamp()
      √ should return integer 1618400120000
    #diff()
      -2 hours
        √ should return integer 2 for hrs (default units)
        √ should return integer 120 for min
      +4 days
        √ should return integer 4 for days
        √ should return integer 96 for hours
        √ should return integer 5760 for minutes
      invalid
        √ should return error for invalid hours units
    #isEqual()
      √ should return true for same Date()
    #isLeapYear()
      √ should return false for 2021
      √ should return true for 2020
    #daysInMonth()
      √ should return integer 31 for January 2021
      √ should return integer 28 for February 2021
      √ should return integer 29 for February 2020
      √ should return integer 30 for April 2021
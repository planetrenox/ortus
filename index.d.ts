/**
 * PRT unit:
 * - `'ms'` milliseconds (official PRT unit)
 * - `'s'` seconds
 * - `'m'` minutes
 * - `'h'` hours
 * - `'d'` days, always 86,400,000 ms
 * - `'w'` weeks, always 7 days
 */
export type Unit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w'

/**
 * PRT (Planet Renox Time): milliseconds since `1998-03-14T03:00:00.000Z`.
 *
 * - Results are integers, rounded down toward −∞ (`1.5s → 1`, `-1.5s → -2`).
 * - Times before the epoch are negative.
 * - Exact across the full JS `Date` range (±275,000 years). Outside it throws.
 * - Leap seconds are ignored, the same as JS `Date`.
 */
export declare const PRT: Readonly<{
  /**
   * Current PRT.
   * @param unit Unit to return. Default `'ms'`.
   * @returns Integer PRT, rounded down.
   * @throws {RangeError} Unknown unit.
   * @example
   * PRT.now()     // ms
   * PRT.now('d')  // days
   */
  now(unit?: Unit): number

  /**
   * PRT at a `Date`.
   * @param date A valid `Date`. Anything else throws, including numbers.
   * @param unit Unit to return. Default `'ms'`.
   * @returns Integer PRT, rounded down.
   * @throws {TypeError} `date` is not a valid `Date`.
   * @throws {RangeError} Unknown unit.
   * @example
   * PRT.fromDate(new Date('1998-03-14T03:00:00Z'))   // 0
   * PRT.fromDate(new Date('2010-06-01'), 'd')        // 4461
   */
  fromDate(date: Date, unit?: Unit): number

  /**
   * `Date` at a PRT value.
   * @param value Integer PRT, in `unit`.
   * @param unit Unit of `value`. Default `'ms'`.
   * @returns The `Date` at the start of that PRT `unit`.
   * @throws {TypeError} `value` is not a safe integer.
   * @throws {RangeError} Unknown unit, or result is outside the `Date` range.
   * @example
   * PRT.toDate(0)          // 1998-03-14T03:00:00.000Z
   * PRT.toDate(1e9, 's')   // 2029-11-20T04:46:40.000Z
   */
  toDate(value: number, unit?: Unit): Date

  /**
   * PRT at a Unix timestamp in milliseconds, like `Date.now()`. Not Unix seconds.
   * @param unixMs Integer Unix ms, within the `Date` range.
   * @param unit Unit to return. Default `'ms'`.
   * @returns Integer PRT, rounded down.
   * @throws {TypeError} `unixMs` is not an integer.
   * @throws {RangeError} Unknown unit, or `unixMs` is outside the `Date` range.
   * @example
   * PRT.fromUnixMs(889844400000)   // 0
   * PRT.fromUnixMs(0, 'd')         // -10300
   */
  fromUnixMs(unixMs: number, unit?: Unit): number

  /**
   * Unix timestamp in milliseconds at a PRT value. Same as `PRT.toDate(value, unit).getTime()`.
   * @param value Integer PRT, in `unit`.
   * @param unit Unit of `value`. Default `'ms'`.
   * @returns Integer Unix ms at the start of that PRT `unit`.
   * @throws {TypeError} `value` is not a safe integer.
   * @throws {RangeError} Unknown unit, or result is outside the `Date` range.
   * @example
   * PRT.toUnixMs(0)        // 889844400000
   * PRT.toUnixMs(1, 'w')   // 890449200000
   */
  toUnixMs(value: number, unit?: Unit): number
}>

export default PRT

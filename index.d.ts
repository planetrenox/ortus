/** PRT units: milliseconds (official), seconds, minutes, hours, days, weeks */
export type Unit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w'

export declare const PRT: Readonly<{
  /** Current PRT, rounded down. Defaults to ms. */
  now(unit?: Unit): number
  /** PRT at the given Date, rounded down. Defaults to ms. */
  fromDate(date: Date, unit?: Unit): number
  /** Date at the given integer PRT value. Defaults to ms. */
  toDate(value: number, unit?: Unit): Date
  /** PRT at the given integer Unix ms, rounded down. Defaults to ms. */
  fromUnixMs(unixMs: number, unit?: Unit): number
  /** Unix ms at the given integer PRT value. Defaults to ms. */
  toUnixMs(value: number, unit?: Unit): number
}>

export default PRT

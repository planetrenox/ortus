// PRT — Planet Renox Time: ms since 1998-03-14T03:00:00.000Z
const E = 889844400000
const MAX = 8.64e15 // JS Date range, ±275k years
const U = { __proto__: null, ms: 1, s: 1e3, m: 6e4, h: 36e5, d: 864e5, w: 6048e5 }
const T = Date.prototype.getTime

const unit = u => {
  if (typeof u != 'string' || !U[u]) throw new RangeError(`PRT: unknown unit ${String(u)}, use ms|s|m|h|d|w`)
  return U[u]
}

// Math.floor rounds toward -Infinity, exact since every in-range ms diff is an integer below 2^53
const fromUnixMs = (t, u = 'ms') => {
  if (!Number.isInteger(t)) throw new TypeError('PRT.fromUnixMs: expected an integer')
  if (Math.abs(t) > MAX) throw new RangeError('PRT.fromUnixMs: out of Date range')
  return Math.floor((t - E) / unit(u))
}

const fromDate = (date, u = 'ms') => {
  let t
  try { t = T.call(date) } catch {} // brand check: real Dates only, works across realms
  if (!Number.isFinite(t)) throw new TypeError('PRT.fromDate: expected a valid Date')
  return fromUnixMs(t, u)
}

const toUnixMs = (n, u = 'ms') => {
  if (!Number.isSafeInteger(n)) throw new TypeError('PRT: expected an integer PRT value')
  const t = n * unit(u) + E
  if (!(Math.abs(t) <= MAX)) throw new RangeError('PRT: out of Date range')
  return t
}

const now = (u = 'ms') => fromUnixMs(Date.now(), u)
const toDate = (n, u = 'ms') => new Date(toUnixMs(n, u))

export const PRT = Object.freeze({ now, fromDate, toDate, fromUnixMs, toUnixMs })
export default PRT

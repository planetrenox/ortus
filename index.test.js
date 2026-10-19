import test from 'node:test'
import assert from 'node:assert/strict'
import { runInNewContext } from 'node:vm'
import PRT, { PRT as named } from './index.js'

const E = 889844400000
const EPOCH = new Date('1998-03-14T03:00:00.000Z')
const at = ms => new Date(E + ms)
const U = { ms: 1, s: 1e3, m: 6e4, h: 36e5, d: 864e5, w: 6048e5 }
const big = (a, b) => { const q = a / b; return a % b < 0n ? q - 1n : q }
const exact = (t, u) => Number(big(BigInt(t) - BigInt(E), BigInt(U[u])))

test('exports', () => {
  assert.equal(PRT, named)
  assert.ok(Object.isFrozen(PRT))
  assert.deepEqual(Object.keys(PRT), ['now', 'fromDate', 'toDate', 'fromUnixMs', 'toUnixMs'])
})

test('epoch is 0 in every unit', () => {
  assert.equal(EPOCH.getTime(), E)
  for (const u in U) {
    assert.equal(PRT.fromDate(EPOCH, u), 0)
    assert.equal(PRT.fromUnixMs(E, u), 0)
  }
})

test('defaults to ms', () => {
  assert.equal(PRT.fromDate(at(1234)), 1234)
  assert.equal(PRT.fromUnixMs(E + 1234), 1234)
  assert.equal(PRT.toDate(1234).getTime(), E + 1234)
  assert.equal(PRT.toUnixMs(1234), E + 1234)
})

test('units', () => {
  assert.deepEqual(Object.keys(U).map(u => PRT.fromDate(at(6048e5), u)), [6048e5, 604800, 10080, 168, 7, 1])
})

test('rounds down toward -Infinity', () => {
  assert.equal(PRT.fromDate(at(1999), 's'), 1)
  assert.equal(PRT.fromDate(at(-1), 's'), -1)
  assert.equal(PRT.fromDate(at(-1500), 's'), -2)
  assert.equal(PRT.fromDate(at(-1000), 's'), -1)
  assert.equal(PRT.fromUnixMs(E - 1, 'w'), -1)
  assert.equal(PRT.fromUnixMs(0, 'd'), -10300) // -10299.125
})

test('exact at the edges of Date range', () => {
  for (const t of [8.64e15, -8.64e15, 8.64e15 - 1, -8.64e15 + 1])
    for (const u in U) {
      assert.equal(PRT.fromDate(new Date(t), u), exact(t, u), `${t} ${u}`)
      assert.equal(PRT.fromUnixMs(t, u), exact(t, u), `${t} ${u}`)
    }
})

test('exact for 60k random times across the full range', () => {
  for (let i = 0; i < 1e4; i++) {
    const t = Math.round((Math.random() * 2 - 1) * 8.64e15)
    for (const u in U) assert.equal(PRT.fromUnixMs(t, u), exact(t, u), `${t} ${u}`)
  }
})

test('exact one ms before every unit boundary at huge values', () => {
  for (const u in U) {
    const b = U[u], k = Math.floor((8.64e15 - E) / b)
    assert.equal(PRT.fromUnixMs(E + k * b - 1, u), k - 1, u)
    assert.equal(PRT.fromUnixMs(E + k * b, u), k, u)
  }
})

test('now', () => {
  const a = Date.now(), n = PRT.now(), b = Date.now()
  assert.ok(n >= a - E && n <= b - E)
  assert.ok(Number.isSafeInteger(PRT.now('w')))
})

test('round trips', () => {
  for (const ms of [0, 1, -1, 123456789, -987654321, 8.64e15 - E, -8.64e15 - E]) {
    assert.equal(PRT.fromDate(PRT.toDate(ms)), ms)
    assert.equal(PRT.fromUnixMs(PRT.toUnixMs(ms)), ms)
  }
  for (const u in U) for (const n of [0, 1, -1, 4461])
    assert.equal(PRT.toUnixMs(n, u), PRT.toDate(n, u).getTime())
  assert.equal(PRT.toUnixMs(1, 'w'), E + 6048e5)
  assert.equal(PRT.toUnixMs(-1, 'd'), E - 864e5)
})

test('accepts Dates from other realms', () => {
  assert.equal(PRT.fromDate(runInNewContext('new Date("1998-03-14T03:00:01Z")'), 's'), 1)
})

test('fromDate rejects non-Dates, including numbers', () => {
  for (const x of [Date.now(), 0, '1998-03-14', null, undefined, {}, { getTime: () => 0 }, new Date(NaN), Object.create(Date.prototype)])
    assert.throws(() => PRT.fromDate(x), TypeError)
})

test('fromUnixMs rejects non-integers and out of range', () => {
  for (const x of [1.5, NaN, Infinity, -Infinity, '0', null, undefined, 0n, new Date(0), {}])
    assert.throws(() => PRT.fromUnixMs(x), TypeError)
  for (const x of [8.64e15 + 1, -8.64e15 - 1, 2 ** 53, 1e300])
    assert.throws(() => PRT.fromUnixMs(x), RangeError)
})

test('rejects unknown units', () => {
  for (const u of ['y', 'mo', 'us', 'MS', 'toString', '__proto__', null, 1, {}, Symbol('s')])
    for (const f of [() => PRT.now(u), () => PRT.fromDate(EPOCH, u), () => PRT.fromUnixMs(E, u), () => PRT.toDate(0, u), () => PRT.toUnixMs(0, u)])
      assert.throws(f, RangeError)
})

test('toDate and toUnixMs reject bad values', () => {
  for (const f of [PRT.toDate, PRT.toUnixMs]) {
    for (const n of [1.5, NaN, Infinity, -Infinity, '1', null, 0n, 2 ** 53])
      assert.throws(() => f(n), TypeError)
    for (const [n, u] of [[1e15, 'w'], [9e15, 'ms'], [8.64e15 - E + 1, 'ms'], [-8.64e15 - E - 1, 'ms'], [Number.MAX_SAFE_INTEGER, 'w']])
      assert.throws(() => f(n, u), RangeError)
  }
})

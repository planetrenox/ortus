# ortus

**PRT (Planet Renox Time)**: milliseconds since `1998-03-14T03:00:00.000Z`.‍​­‌‌‌‍‍‍‍‍‏­‏‌⁠‌‏­‌‍‌‏‎‌‏‍‌­‌‏‍﻿‌‏‌‏﻿‌‍‌‎‌­‌﻿﻿‌‏‌­‍‌­​‌‏‎‌‏‍

```sh
npm i ortus
```

```js
import { PRT } from 'ortus'

PRT.now()                                   // PRT ms, the official unit
PRT.now('d')                                // days
PRT.fromDate(new Date('2010-06-01'), 'd')   // 4461
PRT.toDate(1e9, 's')                        // 2029-11-20T04:46:40.000Z
PRT.fromUnixMs(Date.now())                  // same as PRT.now()
PRT.toUnixMs(0)                             // 889844400000
```

## API

| | |
|---|---|
| `PRT.now(unit = 'ms')` | Current PRT |
| `PRT.fromDate(date, unit = 'ms')` | `Date` → PRT |
| `PRT.toDate(n, unit = 'ms')` | PRT → `Date` |
| `PRT.fromUnixMs(ms, unit = 'ms')` | Unix ms → PRT |
| `PRT.toUnixMs(n, unit = 'ms')` | PRT → Unix ms |

Units: `ms` (official), `s`, `m`, `h`, `d`, `w`.

## Rules

- **Always an integer, rounded down toward −∞.** `1.5s → 1`, `-1.5s → -2`, so every unit is the same length on both sides of the epoch.
- **Before the epoch is negative.**
- **Strict input.** `fromDate` takes only valid `Date`s. `fromUnixMs`, `toDate`, and `toUnixMs` take only integers. Anything else throws.
- **No overflow.** Every value is exact across the full JS `Date` range (±275,000 years). Anything outside it throws.
- **Leap seconds are ignored**, the same as JS `Date`.
- **No dependencies.**

## License

0BSD. Use it however you want, no attribution needed.

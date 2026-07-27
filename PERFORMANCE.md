# Game of Life performance

Measured locally after a 3 second warm-up, for 15 seconds per run. These are sustained runtime measurements rather than Lighthouse estimates.

## Test environment

- Chromium 151.0.7922.34, 1920×1080 desktop / 390×844 mobile viewport
- AMD Strix Halo integrated graphics
- 180 Hz display
- Local Vite server, development mode
- “Low-end” runs use Chrome's 6× CPU slowdown

`GPU-process CPU` comes from Chrome's `SystemInfo.getProcessInfo`. It measures work done by Chrome's GPU process, not the GPU engine's hardware utilization. It can exceed 100% when multiple process threads use more than one CPU core.

## Results

### 1920×1080, native CPU

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Grid cells | 19,044 | 2,331 | -87.8% |
| Main-thread work | 225.7 ms/s | 25.7 ms/s | -88.6% |
| GPU-process CPU | 158.1% | 11.5% | -92.7% |
| Simulation time | 0.289 ms/tick | 0.042 ms/tick | -85.5% |
| DOM update time | 1.339 ms/tick | 0.142 ms/tick | -89.4% |
| Long tasks | 0 | 0 | — |

### 1920×1080, 6× CPU slowdown

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Main-thread work | 949.7 ms/s | 149.3 ms/s | -84.3% |
| GPU-process CPU | 105.5% | 25.8% | -75.5% |
| Long tasks (15 seconds) | 108 / 6,228 ms total | 0 | eliminated |
| Frame interval p95 | 72.1 ms | 5.7 ms | -92.1% |
| Simulation time | 1.385 ms/tick | 0.102 ms/tick | -92.6% |
| DOM update time | 6.851 ms/tick | 0.887 ms/tick | -87.1% |

### 390×844, 6× CPU slowdown

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Grid cells | 3,600 | 435 | -87.9% |
| Main-thread work | 372.4 ms/s | 39.3 ms/s | -89.4% |
| GPU-process CPU | 114.9% | 4.2% | -96.3% |
| Long tasks | 0 | 0 | — |

## Cause and fix

The old grid was a square two viewport diagonals wide. At 1080p this produced 19,044 DOM nodes in an approximately 19-megapixel layer. The entire layer's transform was then changed on every display frame. On a high-refresh display that made Chrome continuously composite a layer far larger than the viewport; the Game of Life updates added repeated style and paint work.

The background now:

- sizes the grid only to the rotated viewport bounds;
- keeps a fixed one-degree rotation instead of transforming the layer every frame;
- pauses simulation while the page is hidden;
- disables simulation for `prefers-reduced-motion: reduce` users.

The cell simulation still runs every 140 ms, so the background remains animated without continuous whole-layer compositing.

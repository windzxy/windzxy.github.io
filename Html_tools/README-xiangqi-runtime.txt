Xiangqi runtime visibility fix (2026-09-11)
- xiangqi-card-v1.js contains game implementation.
- ensure-xiangqi-visible-v1.js guarantees Function Center registration after other shelf scripts run.
- .github/workflows/ensure-xiangqi-visible.yml injects both startup scripts after chess-card-v1.js.

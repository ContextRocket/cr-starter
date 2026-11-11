# Starter font assets

These locally served WOFF2 files follow ContextRocket's Ink & Paper type
system. Their SIL Open Font Licenses are in `licenses/`.

| File | Family source | Upstream web font |
| --- | --- | --- |
| `InterTight-Variable.woff2` | [Google Fonts Inter Tight](https://github.com/google/fonts/tree/main/ofl/intertight) | `https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsH8ahuQ2e8.woff2` |
| `Newsreader-Italic.woff2` | [Google Fonts Newsreader](https://github.com/google/fonts/tree/main/ofl/newsreader) | `https://fonts.gstatic.com/s/newsreader/v26/cY9XfjOCX1hbuyalUrK439vogqCz_goCYw7oRd6JFYYzbARA_n8.woff2` |

Forks can override `--font-sans`, `--font-mono`, and `--font-editorial` in
`config/site.json` under `theme.tokens`. Self-host any additional licensed
font files and declare their `@font-face` rules in `src/styles/global.css`.

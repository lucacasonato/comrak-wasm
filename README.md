# comrak-wasm

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/comrak@0.1.0/mod.ts)

WASM bindings for the
[comrak markdown renderer](https://github.com/kivikakk/comrak).

> Rust port of [GitHub's `cmark-gfm`](https://github.com/github/cmark-gfm).

> A 100% CommonMark and GFM compatible Markdown parser. The design is based on
> cmark, so familiarity with that will help.

## How to use

```ts
import * as comrak from "https://deno.land/x/comrak@0.1.0/mod.ts";
await comrak.init();

comrak.markdownToHTML("Hello, **世界**!"); // <p>Hello, <strong>世界</strong>!</p>\n
```

The second argument is an options bag that can be used to customize parsing
behaviour. The exact arguments can be found on the
[deno doc](https://doc.deno.land/https/deno.land/x/comrak@0.1.0/mod.ts) page.

## Thanks

Thanks to the authors of comrak
([Asherah Connor @kivikakk](https://github.com/sponsors/kivikakk)).

Additional thanks to the @denosaurs folks for the build.ts script this repo
uses.

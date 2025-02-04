# [WebLocal](https://weblocal.dev) - Instant, Isolated localhost environment in your web

## Motivation
Opensource implemention of Stackblitz and CodeSandBox's serviceworker-based tunneling strategy.

## API
```html
<iframe hidden onload="import('https://weblocal.dev').then(({ load }) => load(this))"></iframe>
```
```javascript
import { serve } from "https://weblocal.dev";

const handler = await serve({ directory: Directory });

handler.url // returns local-only address. e.g. https://zzer2zdjig.weblocal.dev

open(handler.url, "_blank");

handler.status.reloadType = "auto";

handler.close();
```

if you're using Vite, bundle exclusion is required.
```javascript
// vite.config.js

export default defineConfig({
	build: {
		rollupOptions: {
			external: ['https://weblocal.dev'],
		},
	},
});
```
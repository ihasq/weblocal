# [WebLocal](https://weblocal.dev) - Instant, Isolated localhost environment in your web

### [About](#about) | [Example](#example) | [Motivation](#motivation)

## About

Open source implemention of Stackblitz and CodeSandBox's ServiceWorker-based tunneling system.

## Example

**[Simple web server](#simple-web-server) | [Static site](#static-site)**

### Simple web server
```javascript
// From Client JavaScript!

import { serve } from "weblocal";

const server = await serve(() => new Response("<h1>Hello</h1>"));

open(server.url, "_blank"); // opens local-only address, https://zzer2zdjig.weblocal.dev

await server.clearSiteData()

await server.close();
```

### Static site
```javascript
import { serveStatic } from "weblocal";

const directoryHandle = await navigator.storage.getDirectory(); // from OPFS

const server = await serveStatic(directoryHandle);

open(server.url, "_blank");

server.reloadMode = "auto"; // automatically reloads when file changes
```

## Motivation
Developers have long used Object URL or Data URLs to display user-defined documents in serverless environments.\
This technique is the basic technique used by major technology sites such as MDN to display implementation examples, and has long been used in all demonstrations.\
Unfortunately, this method does not allow HTTPS-specific APIs, which makes impossible to demonstrate cutting-edge web technologies (e.g. WebGPU, FileSystem).

To run user-defined documents in HTTPS environments, major online IDEs StackBlitz and CodeSandBox have built a "bypass" system into their services with ServiceWorker and MessageChannel.\
This technique is memory-efficient and has low overhead compared to using Object URLs. Despite its usefulness, each company has kept its source private because of online IDE market's competitive situation.

So as an individual web dev, I reinvented the wheel as an open source low-level implementation from my imagination, with the CloudFlare's hardwired network.
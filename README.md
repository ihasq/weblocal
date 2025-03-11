# [🔌 WebLocal](https://weblocal.dev) - Instant, Isolated localhost environment in your web

### [About](#about) | [Example](#example) | [Motivation](#motivation)

## About

Open source implemention of StackBlitz and CodeSandBox's ServiceWorker-based tunneling system.

## Example

**[Simple web server](#simple-web-server) | [Static site](#static-site)**

### Simple web server
```javascript
// From Client JavaScript!

import { serve } from "weblocal";

const server = await serve(() => new Response("<h1>Hello</h1>"));

previewFrame.src = server.url // directly put into in-context iframe

server.openWindow(); // or open & initialize window! (must be triggered with trusted events)

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

### Hono in browser
```javascript
import { Hono } from "hono";
import { serve } from "weblocal";

const app = new Hono();

app.get("/", c => c.text("Hello Hono!"));

const server = await serve(app.fetch);

// ...
```

## Self hosted

## Motivation
Developers have long used object URLs and data URLs to display user-defined documentation in serverless environments.
This is the basic technique used by major technical sites such as MDN to display example implementations and has been used in all demos for a long time.
Unfortunately, however, this technique does not allow the use of HTTPS-specific APIs, making it impossible to demonstrate the most advanced web technologies (WebGPU, FileSystem, etc.).

To run user-defined documents in an HTTPS environment, leading online IDEs StackBlitz and CodeSandBox have incorporated a “bypass” system into their own services using ServiceWorker and MessageChannel.
This technique is memory efficient and has less overhead than using Object URLs. Despite its convenience, due to the competitive nature of the online IDE market, companies are keeping their sources private.

So, as an individual web developer, I reinvented the wheel as an open source low-level implementation from my imagination, using CloudFlare's sophisticated network.
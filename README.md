# [WebLocal](https://weblocal.dev) - Instant, Isolated localhost environment in your web

## About

Opensource implemention of Stackblitz and CodeSandBox's ServiceWorker-based tunneling system.

## Motivation
Developers have long used object or data URLs to display user-defined documents in serverless environments. This technique is the basic technique used by major technology sites such as MDN to display implementation examples, and has long been used in all demonstrations. Unfortunately, this method does not allow for HTTPS environments, which is a major limitation, especially when demonstrating cutting-edge web technologies (e.g. WebGPU, FileSystem).

To run user-defined documents in HTTPS environments, major online IDEs StackBlitz and CodeSandBox have built a "bypass" system into their services that combines ServiceWorker and MessageChannel. This technique is memory-efficient and has low overhead compared to using Object URLs. Despite its usefulness, the online IDE market is so competitive that each company has kept its source private.

So, as an individual developer, I reinvented an open source implementation from my imagination with the help of CloudFlare. 

## Raw server
```javascript
// From Client JavaScript!

import { serve } from "weblocal";

const server = await serve(() => new Response("<h1>Hello!</h1>"));

open(server.url, "_blank"); // opens local-only address. e.g. https://zzer2zdjig.weblocal.dev

server.reloadType = "auto";

server.close();
```

## Self-Hosting
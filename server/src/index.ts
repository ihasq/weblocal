const html = new Blob(["<script type='module' src='https://weblocal.pages.dev/server/client.js'></script>"], { type: "text/html" });
const sw = new Blob(["importScripts('https://weblocal.pages.dev/server/server.js')"], { type: "text/javascript" });

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		switch(pathname) {
			case "/": {
				if(request.headers.get("sec-fetch-dest") !== "iframe") break;
				return new Response(html, {
					headers: {
						"Content-Security-Policy": "frame-ancestors https://weblocal.pages.dev;"
					}
				});
			}
			case "/sw.js": {
				return new Response(sw);
			}
		}
		return new Response("", { status: 502 })
	},
} satisfies ExportedHandler<Env>;

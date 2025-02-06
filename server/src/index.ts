const html = new Blob(["<script type='module' src='https://weblocal.pages.dev/client.js'></script>"], { type: "text/html" });
const sw = new Blob(["importScripts('https://weblocal.pages.dev/server.js')"], { type: "text/javascript" });

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		switch(pathname) {
			case "/": {
				return new Response(html);
			}
			case "/sw.js": {
				return new Response(sw);
			}
			default: {
				return new Response("", { status: 404 })
			}
		}
	},
} satisfies ExportedHandler<Env>;

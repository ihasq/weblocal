const html = new Blob(["<script type='module' src='https://weblocal.dev/server/client.js'></script>"], { type: "text/html" });
const sw = new Blob(["importScripts('https://weblocal.dev/server/server.js');"], { type: "text/javascript" });

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		switch(pathname) {
			case "/":
			case "/index.html": {
				return new Response(html);
			}
			case "/sw.js": {
				return new Response(sw);
			}
		}
		return new Response("", { status: 502 })
	},
} satisfies ExportedHandler<Env>;

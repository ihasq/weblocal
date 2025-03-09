const html = new Blob(["<script type='module' src='https://weblocal.dev/server/client.js'></script>"], { type: "text/html" });
const connect = new Blob(["<script type='module' src='https://weblocal.dev/server/connect.js'></script>"], { type: "text/html" });
const sw = new Blob(["importScripts('https://weblocal.dev/server/server.js')"], { type: "text/javascript" });

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname } = new URL(request.url);
		return new Response(pathname == "./sw.js" ? sw : pathname == "./connect" ? connect : html)
	},
} satisfies ExportedHandler<Env>;

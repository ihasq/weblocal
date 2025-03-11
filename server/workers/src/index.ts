const resources = {
	"/": new Blob(["<script type='module' src='https://weblocal.dev/server/client.js'></script>"], { type: "text/html" }),
	"/connect": new Blob(["<script type='module' src='https://weblocal.dev/server/connect.js'></script>"], { type: "text/html" }),
	"/sw.js": new Blob(["importScripts('https://weblocal.dev/server/server.js')"], { type: "text/javascript" }),
	"/sh.js": new Blob(["importScripts('https://weblocal.dev/server/shared.js')"], { type: "text/javascript" })
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname } = new URL(request.url);
		return new Response(resources[pathname in resources ? pathname : "/"])
	},
} satisfies ExportedHandler<Env>;

const resources = {
	"/": new Blob(["<script type='module' src='https://weblocal.dev/server/client.js'></script>"], { type: "text/html" }),
	"/sw.js": new Blob(["importScripts('https://weblocal.dev/server/server.js')"], { type: "text/javascript" }),
	"/ping.txt": new Blob([""], { type: "text/plain" })
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname } = new URL(request.url);
		return new Response(resources[pathname in resources ? pathname : "/"], { headers: { "Cache-Control": "private, no-store" } })
	},
} satisfies ExportedHandler<Env>;

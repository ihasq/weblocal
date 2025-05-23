const resources = {
	"/": new Blob(["<script src='https://weblocal.dev/server/client.js'></script>"], { type: "text/html" }),
	"/sw.js": new Blob(["importScripts('https://weblocal.dev/server/server.js')"], { type: "text/javascript" })
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname } = new URL(request.url);
		return new Response(
			resources[pathname in resources ? pathname : "/"],
			{
				headers: {
					"Cache-Control": "private, no-store"
				}
			}
		)
	},
} satisfies ExportedHandler<Env>;

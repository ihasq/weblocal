/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.json`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
const html = new Blob([`<script>navigator.serviceWorker.register("./sw.js", { type: "module" })</script>`], { type: "text/html" });
const sw = new Blob([`self.addEventListener("fetch", e => e.respondWith(handleFetch(e)))`], { type: "text/html" });
const main = new Blob([/**FILE_PLACEHOLDER_SW*/], { type: "text/html" })

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return new URL(request.url).pathname == "/" && request.headers.get("sec-fetch-dest") !== "iframe"
		? new Response("", { status: 404 })
		: new Response(main, {
			headers: {
				"Content-Security-Policy": "frame-ancestors"
			}
		});
	},
} satisfies ExportedHandler<Env>;

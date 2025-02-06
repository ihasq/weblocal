export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname } = new URL(request.url);
		switch(pathname) {
			case "/": {
				return new Response(`<script type="module" src="${new URL("client.js", env.SW_FILE_HOST).href}"></script>`);
			}
			case "/sw.js": {
				return new Response(`import from "${new URL("server.js", env.SW_FILE_HOST).href}"`)
			}
			default: {
				return new Response("", { status: 404 })
			}
		}
	},
} satisfies ExportedHandler<Env>;

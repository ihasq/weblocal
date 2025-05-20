const

	promiseMap = {},
	
	rand = crypto.randomUUID.bind(crypto),

	p_port: Promise<{ data: MessagePort }> = new Promise(r_port => self.onmessage = r_port),

	reqKeys = Object.keys(Request.prototype),

	pingTag = rand(),

	handleFetch = async ({ request }) => {

		let id;
		while((id = rand()) in promiseMap);

		return new Response(...(
			URL.parse(request.url)?.pathname == `/${pingTag}`
				? ""
				: await new Promise(async r_fetch => {

					promiseMap[id] = r_fetch;

					(await p_port).data.postMessage([
						reqKeys.map(x => [x, x == "headers"
							? request[x]
							: Object.fromEntries(request[x])
						]),
						id
					])

				})
		) as any) // erases many annoying red underlines

	}
;

p_port.then(({ data: port }) => {
	port.onmessage = ({ data }) => promiseMap[data[2] || -1]?.(data);
	port.postMessage([pingTag]);
})

self.addEventListener("fetch", (e) => e.respondWith(handleFetch(e)));
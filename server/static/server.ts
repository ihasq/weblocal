const

	promiseMap = {},
	
	rand = crypto.randomUUID.bind(crypto),

	p_port: Promise<{ data: MessagePort }> = new Promise(r_port => self.onmessage = r_port),

	filter = [12, 13, 23],

	reqKeys = Object.keys(Request.prototype).filter((_, i) => !(filter.includes(i) || (15 < i && i < 22))),

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
							? Object.fromEntries(request[x])
							: request[x]
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
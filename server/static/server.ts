const
	promiseMap = {},
	rand = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
	p_port: Promise<{ data: MessagePort }> = new Promise(r_port => self.onmessage = r_port),
	pingTag = BigInt("" + rand() + rand() + rand() + rand()).toString(36),
	handleFetch = async ({ request }) => {

		let id;
		while((id = rand()) in promiseMap) {};

		const reqEntries = Object.entries(request);

		if(URL.parse(request.url)?.pathname == `/${pingTag}`) return new Response("", { headers: { "Content-Type": "text/html" } });

		(await p_port).data.postMessage({ code: "REQUEST", id, data: [reqEntries, Object.fromEntries(request.headers.entries())] })

		return await new Promise(r_fetch => promiseMap[id] = r_fetch).then(([body, responseInit]) => new Response(body, responseInit));

	}
;

p_port.then(({ data: port }) => {
	port.onmessage = ({ data: { code, id, data } }) => promiseMap[id]?.(data);
	port.postMessage({ code: "CONNECT", data: pingTag });
})

self.addEventListener("fetch", (e) => e.respondWith(handleFetch(e)));
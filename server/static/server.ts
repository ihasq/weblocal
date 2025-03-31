const
	promiseMap = {},
	rand = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
	p_port: Promise<{ data: MessagePort }> = new Promise(r_port => self.onmessage = r_port),
	pingTag = BigInt("" + rand() + rand() + rand() + rand()).toString(36),
	handleFetch = async ({ request }) => {

		let id;
		while((id = rand()) in promiseMap) {};

		const { body, cache, credentials, headers, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy, url } = request;

		if(URL.parse(url)?.pathname == `/${pingTag}`) return new Response("", { headers: { "Content-Type": "text/html" } });

		const serializedHeaders = Object.fromEntries(headers.entries());

		(await p_port).data.postMessage({ code: "REQUEST", id, data: [body, cache, credentials, serializedHeaders, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy, url] })

		return await new Promise(r_fetch => promiseMap[id] = r_fetch).then(([body, headers, status, statusText]) => new Response(body, { headers, status, statusText }));

	},
	keepalive = new BroadcastChannel(""),
	setConnectionTimeout = () => setTimeout(() => keepalive.close(), 3000)
;

p_port.then(({ data: port }) => {
	let keepaliveTimeoutId = setConnectionTimeout();
	port.onmessage = ({ data: { code, id, data } }) => {
		switch(code) {
			case "HEARTBEAT": {
				clearTimeout(keepaliveTimeoutId);
				keepaliveTimeoutId = setConnectionTimeout();
				break;
			}
			default: {
				promiseMap[id]?.(data)
			}
		}
	}
	port.postMessage({ code: "CONNECT", data: pingTag });
})

self.addEventListener("fetch", (e) => e.respondWith(handleFetch(e)));
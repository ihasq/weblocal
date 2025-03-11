const
	promiseMap = {},
	rand = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
	p_port: Promise<{ data: MessagePort }> = new Promise(r_port => self.onmessage = r_port),
	handleFetch = async ({ request }) => {

		let id;
		while((id = rand()) in promiseMap) {};

		const
			{ body, cache, credentials, headers, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy, url } = request,
			serializedHeaders = Object.fromEntries(headers.entries())
		;

		(await p_port).data.postMessage({ code: "REQUEST", id, data: [body, cache, credentials, serializedHeaders, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy, url] })

		return new Promise(r_fetch => promiseMap[id] = r_fetch);
	}
;

p_port.then(({ data: port }) => port.onmessage = ({ data: { id, data } }) => promiseMap[id]?.(data))

self.addEventListener("fetch", (e) => e.respondWith(handleFetch(e)));
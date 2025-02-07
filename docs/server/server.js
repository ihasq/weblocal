const
	p_port = new Promise(r_port => self.onmessage = r_port),
	promiseMap = {},

	getRand = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),

	onfetch = async ({ request }) => {

		const
			{ data: port } = await p_port,
			{ body, bodyUsed, cache, credentials, destination, duplex, headers, integrity, isHistoryNavigation, keepalive, method, mode, redirect, referrer, referrerPolicy, targetAddressSpace, url } = request,
			serializedHeaders = Object.fromEntries(headers.entries())
		;

		let id;
		while((id = getRand()) in promiseMap) {};

		port.postMessage({ code: "REQUEST", id, data: [body, bodyUsed, cache, credentials, destination, duplex, serializedHeaders, integrity, isHistoryNavigation, keepalive, method, mode, redirect, referrer, referrerPolicy, targetAddressSpace, url] }, body ? [body] : null);

		return new Promise(r_response => promiseMap[id] = r_response).then(([body, status, statusText, headers]) => new Response(body, { status, statusText, headers }))
	}
;

p_port.then(({ data: { port, url } }) => {

	port.onmessage = ({ data: { code, id, data } }) => {

		switch(code) {

			case "RESPONSE": {

				promiseMap[id]?.(data);
				delete promiseMap[id];

				break;
			}
		}
	}

	port.postMessage({ code: "INIT", data: { url } })
});

self.addEventListener("fetch", e => e.respondWith(onfetch(e)), true);
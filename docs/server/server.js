const
	promiseMap = {},

	rand = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
	handleFetch = async ({ request, target }) => {

		console.log("fetch")
	
		const
			{ data: port } = await p_port,
			{ body, bodyUsed, cache, credentials, destination, duplex, headers, integrity, isHistoryNavigation, keepalive, method, mode, redirect, referrer, referrerPolicy, targetAddressSpace, url } = request,
			serializedHeaders = Object.fromEntries(headers.entries())
		;
	
		let id;
		while((id = rand()) in promiseMap) {};
	
		port.postMessage({ code: "REQUEST", id, data: [body, bodyUsed, cache, credentials, destination, duplex, serializedHeaders, integrity, isHistoryNavigation, keepalive, method, mode, redirect, referrer, referrerPolicy, targetAddressSpace, url] }, body ? [body] : null);
	
		return await new Promise(r_response => promiseMap[id] = r_response).then(([body, status, statusText, headers]) => new Response(body, { status, statusText, headers }))
	}
;

// self.addEventListener("fetch", e => e.respondWith(handleFetch(e)));

// self.addEventListener('activate', () => self.clients.claim());

const
	compStream = new CompressionStream("gzip"),
	decompStream = new DecompressionStream("gzip")
;

/**@type { BroadcastChannel } */
const serverTunnel = new BroadcastChannel("wl-tunnel");

const handleFetchNew = ({ request }) => {
	let id;
	while((id = rand()) in promiseMap) {};
	const { body, cache, credentials, headers, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy, url } = request;
	const serializedHeaders = Object.fromEntries(headers.entries());
	serverTunnel.postMessage({ code: "REQUEST", id, data: [body, cache, credentials, serializedHeaders, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy, url] })
	return new Promise(r_fetch => promiseMap[id] = r_fetch);
}

self.addEventListener("fetch", e => e.respondWith(handleFetchNew(e)))

serverTunnel.onmessage = ({ data: { code, id, data } }) => {
	switch(code) {
		case "RESPONSE": {
			/**@type {{ body: Blob, headers: { [key: string]: string }, status: number, statusText: string }} */
			const { body, headers, status, statusText } = data
			promiseMap[id]?.(new Response(body.stream().pipeThrough(decompStream), { headers, status, statusText }));
			delete promiseMap[id];
			break;
		}
	}
};
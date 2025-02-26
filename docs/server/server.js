const
	promiseMap = {},

	rand = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),

	decompStream = new DecompressionStream("gzip")
;

/**@type { BroadcastChannel } */
const serverTunnel = new BroadcastChannel("wl-tunnel");

const handleFetch = ({ request }) => {

	let id;
	while((id = rand()) in promiseMap) {};

	const
		{ body, cache, credentials, headers, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy, url } = request,
		serializedHeaders = Object.fromEntries(headers.entries())
	;

	serverTunnel.postMessage({ code: "REQUEST", id, data: [body, cache, credentials, serializedHeaders, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy, url] })

	return new Promise(r_fetch => promiseMap[id] = r_fetch);
}

self.addEventListener("fetch", e => e.respondWith(handleFetch(e)))

serverTunnel.onmessage = ({ data: { code, id, data } }) => {
	switch(code) {
		case "RESPONSE": {
			/**@type {{ body: Blob, headers: { [key: string]: string }, status: number, statusText: string }} */
			const [body, headers, status, statusText] = data;
			promiseMap[id]?.(new Response(body.stream().pipeThrough(decompStream), { headers, status, statusText }));
			delete promiseMap[id];
			break;
		}
	}
};
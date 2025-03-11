const
	signal = new BroadcastChannel("--weblocal-connection-signal"),
	key = await crypto.subtle.importKey("raw", Uint8Array.from(localStorage.getItem("--weblocal-connection-key"), m => m.codePointAt(0)), { name: "RSA-OAEP", hash: "SHA-512" }, false, ["encrypt"]),
	{ data: port } = await new Promise(r_port => window.onmessage = r_port),
	channelTag = crypto.randomUUID(),
	tunnel = new BroadcastChannel(channelTag)
;

navigator.serviceWorker.register(`./sw.js#${channelTag}`);

await navigator.serviceWorker.ready;

location.href = location.href;
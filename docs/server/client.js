const
	signal = new BroadcastChannel("wl-signal"),
	key = await crypto.subtle.importKey("raw", Uint8Array.from(localStorage.getItem("--weblocal-connection-key"), m => m.codePointAt(0)), { name: "RSA-OAEP", hash: "SHA-512" }, false, ["encrypt"]),
	{ data: port } = await new Promise(r_port => window.onmessage = r_port),
	channelTag = crypto.randomUUID(),
	tunnel = new BroadcastChannel(channelTag)
;

signal.postMessage(await crypto.subtle.encrypt({ name: "RSA-OAEP", hash: "SHA-512" }, key, Uint8Array.from(channelTag, m => m.codePointAt(0))));

navigator.serviceWorker.register(`./sw.js#${channelTag}`);

await navigator.serviceWorker.ready;

location.href = location.href;
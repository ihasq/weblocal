import { get as getIKV } from "idb-keyval"

(async () => {
	const
		signal = new BroadcastChannel("--weblocal-connection-signal"),
		key = await getIKV("--weblocal-connection-key"),
		{ data: port } = await new Promise(r_port => window.onmessage = r_port),
		channelTag = crypto.randomUUID(),
		tunnel = new BroadcastChannel(channelTag)
	;

	navigator.serviceWorker.register(`./sw.js#${channelTag}`);

	await navigator.serviceWorker.ready;

	location.href = location.href;
})()
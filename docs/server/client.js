navigator.serviceWorker.register("./sw.js");

const [{ active: sw }, { data: port }] = await Promise.all([

	navigator.serviceWorker.ready,
	new Promise(r_msg => globalThis.onmessage = r_msg)

]);

sw.postMessage(port, [port]);
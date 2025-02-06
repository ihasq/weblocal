navigator.serviceWorker.register("./sw.js");

Promise.all([navigator.serviceWorker.ready, new Promise(r_msg => globalThis.onmessage = r_msg)]).then(([{ active: sw }, { data: port }]) => {
	sw.postMessage(port, [port]);
})
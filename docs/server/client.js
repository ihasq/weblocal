if(window !== window.parent && window.parent !== window.parent.parent) {

	navigator.serviceWorker.register("./sw.js");
	
	const [{ active: sw }, { data: port }] = await Promise.all([
	
		navigator.serviceWorker.ready,
		new Promise(r_port => globalThis.onmessage = r_port)
	
	]);
	
	sw.postMessage(port, [port]);

}

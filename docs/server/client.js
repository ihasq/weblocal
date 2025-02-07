if(window !== window.parent) {

	navigator.serviceWorker.register("./sw.js");
	
	const [{ active: sw }, { data: port }] = await Promise.all([
	
		navigator.serviceWorker.ready,
		new Promise(r_port => self.onmessage = r_port)
	
	]);
	
	sw.postMessage(port, [port]);

}

navigator.serviceWorker.register("./sw.js");

Promise.all([
	new Promise(r_port => window.onmessage = r_port),
	navigator.serviceWorker.ready
]).then(([{ data: port }, { active: sw }]) => {
	sw?.postMessage(port, [port]);
	setInterval(() => fetch("/", { method: "POST" }), 20 * 1000);
})
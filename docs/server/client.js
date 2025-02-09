const [address] = location.hostname.split(".");

const { target: connector } = await new Promise(r_connector => document.head.append(Object.assign(
	document.createElement("iframe"),
	{
		src: `https://weblocal.dev/local?addr=${encodeURI(address)}`,
		onload: r_connector
	}
)));

if(connector.contentWindow.title == "connect") {

	navigator.serviceWorker.register("./sw.js");
	
	const [{ active: sw }, { data: port }] = await Promise.all([
	
		navigator.serviceWorker.ready,
		new Promise(r_port => self.onmessage = r_port)
	
	]);
	
	sw.postMessage(port, [port]);
	
	open("./", "self");
} else {
	console.log("nah")
}

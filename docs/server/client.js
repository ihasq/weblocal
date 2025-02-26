const connectionToken = Object.fromEntries(new URLSearchParams(location.search).entries()).connect;

if(window !== parent && connectionToken) {

	const
		{ data: port } = await new Promise(r_port => window.onmessage = r_port),
		tunnel = new BroadcastChannel("wl-tunnel")
	;

	tunnel.onmessage = ({ data }) => port.postMessage(data);
	port.onmessage = ({ data }) => tunnel.postMessage(data);

	port.postMessage({ code: "CONNECT" })

} else {

	navigator.serviceWorker.register("./sw.js");

};
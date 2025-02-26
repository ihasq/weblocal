const connect = Object.fromEntries(new URLSearchParams(location.search).entries()).connect;

if(window !== parent && connect) {

	const
		{ data: port } = await new Promise(r_port => window.onmessage = r_port),
		tunnel = new BroadcastChannel("wl-tunnel")
	;

	tunnel.onmessage = ({ data: { code, id, data } }) => {
		switch(code) {
			case "REQUEST": {
				port.postMessage(data);
			}
		}
	}

	port.onmessage = ({ data }) => tunnel.postMessage(data);

	port.postMessage({ code: "CONNECT", data: { connect } });

} else {

	navigator.serviceWorker.register("./sw.js");
	await navigator.serviceWorker.ready;
	open(location.href, "_self");

};
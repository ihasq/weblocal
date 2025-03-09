import * as iKV from "idb-keyval";

const connect = Object.fromEntries(new URLSearchParams(location.search).entries()).connect;
const signal = new BroadcastChannel("wl-signal");

if(window !== parent && connect) {

	const
		key = await crypto.subtle.importKey("raw", Uint8Array.from(atob(connect), m => m.codePointAt(0)), { name: "RSA-OAEP", hash: "SHA-512" }, false, ["encrypt"]),
		{ data: port } = await new Promise(r_port => window.onmessage = r_port),
		tunnel = new BroadcastChannel("wl-tunnel"),
		signal = new BroadcastChannel("wl-signal")
	;

	await iKV.set("pubkey", key);

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

	const connectionToken = crypto.randomUUID();
	signal.postMessage(crypto.subtle.encrypt({ name: "RSA-OAEP", label:  }))
	navigator.serviceWorker.register(`./sw.js?connect=${connectionToken}`);
	await navigator.serviceWorker.ready;
	open(location.href, "_self");

};
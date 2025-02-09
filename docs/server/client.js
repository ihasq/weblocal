const [address] = location.hostname.split(".");

const { target: connector } = await new Promise(r_connector => document.head.append(Object.assign(
	document.createElement("iframe"),
	{
		src: `https://weblocal.dev/local?addr=${encodeURI(address)}&type=${window == parent ? "document" : "frame"}`,
		onload: r_connector
	}
)));

navigator.serviceWorker.register("./sw.js");

const [{ active: sw }, port] = await Promise.all([

	navigator.serviceWorker.ready,
	new Promise(r_port => self.onmessage = ({ data, target }) => target === connector.contentWindow ? r_port(data) : 0)

])

sw.onmessage = ({ data: { code } }) => {
	switch(code) {
		case "OK": {
			open("./", "self");
			break;
		}
	}
}

sw.postMessage(port, [port]);
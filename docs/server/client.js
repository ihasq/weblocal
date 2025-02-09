const
	[address] = location.hostname.split("."),
	{ target: connector } = await new Promise(r_connector => document.head.append(Object.assign(
		document.createElement("iframe"),
		{
			src: `https://weblocal.dev/local?addr=${encodeURI(address)}&type=${window == parent ? "document" : "frame"}`,
			onload: r_connector
		}
	))),
	port = new Promise(r_port => self.onmessage = ({ data, target }) => target === connector.contentWindow ? r_port(data) : 0)
;

navigator.serviceWorker.register("./sw.js");

const { active: sw } = navigator.serviceWorker.ready;

sw.onmessage = ({ data: { code } }) => {
	switch(code) {
		case "OK": {
			open("./", "self");
			break;
		}
	}
}

sw.postMessage(port, [port]);
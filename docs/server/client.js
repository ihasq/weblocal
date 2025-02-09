const
	[origin] = location.hostname.split("."),
	{ target: connector } = await new Promise(r_connector => document.head.append(Object.assign(
		document.createElement("iframe"),
		{
			src: `https://weblocal.dev/local?op=connect&origin=${encodeURI(origin)}&location=${location.origin}&destination=${window == parent ? "document" : "frame"}`,
			onload({ target }) {
				r_connector(target)
			}
		}
	))),
	port = new Promise(r_port => self.onmessage = ({ data, target }) => target === connector.contentWindow ? r_port(data) : 0)
;

navigator.serviceWorker.register("./sw.js");

navigator.serviceWorker.onmessage = ({ data: { code } }) => {
	switch(code) {
		case "OK": {
			open("./", "self");
			break;
		}
	}
}
const { active: sw } = await navigator.serviceWorker.ready;

sw.postMessage(port, [port]);
const rand = (length = 8, base = 36) => Math.floor(Math.random() * (base ** length - 1)).toString(base).padStart(length, "0");

const serverIdMap = {};

self.onmessage = ({ data: { code, data }, source }) => {
	const { pub } = data;
	let serverIdBuf;
	while((serverIdBuf = rand()) in serverIdMap){};
	serverIdMap[serverIdBuf] = {};
	const { port1: establisherPort, port2: establisherDest } = new MessageChannel();
	establisherPort.onmessage = () => {

	}
	source.postMessage([establisherDest, serverIdBuf]);
}

self.onfetch = e => e.respondWith(handleFetch(e));

const handleFetch = async ({ request, target }) => {
	if(request.headers.get("sec-fetch-dest") != "iframe") return new Response("", { status: 502 });
	const { addr, type } = Object.fromEntries(new URL(request.url).searchParams.entries());
	const [name, rand, serverId] = addr.split("-");
	serverIdMap[serverId]?.[`${name}-${rand}`]?.[type]
	target.postMessage();
	return new Response("", { status: 200 })
}
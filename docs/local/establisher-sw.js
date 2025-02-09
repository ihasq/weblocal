const rand = (length = 8, base = 36) => Math.floor(Math.random() * (base ** length - 1)).toString(base).padStart(length, "0");
const tEnc = new TextEncoder();
const serverIdMap = {};

self.onmessage = async ({ data: { code, data }, source }) => {
	const pubKey = await crypto.subtle.importKey("raw", tEnc.encode(decodeURI(data.pub)), { name: "ECDSA", hash: "SHA-512" }, false, ["verify"])
	let serverIdBuf;
	while((serverIdBuf = rand()) in serverIdMap){};
	const serverIdComponents = serverIdMap[serverIdBuf] = {};
	const { port1: serverEstablisherPort, port2: serverEstablisherDest } = new MessageChannel();
	serverEstablisherPort.onmessage = async ({ data: [msgId, address, encodedAddress, signature] }) => {
		const
			[name, rand, serverId] = address.split("-"),
			{ port1: serverPortForDocument, port2: serverDestForDocument } = new MessageChannel(),
			{ port1: serverPortForFrame, port2: serverDestForFrame } = new MessageChannel()
		;
		if(
			serverIdBuf !== serverId ||
			!(await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-512" }, pubKey, signature, encodedAddress))
		) return;

		Object.assign(serverIdComponents, {
			document: serverPortForDocument,
			frame: serverPortForFrame,
		});
		serverEstablisherPort.postMessage([serverDestForDocument, serverDestForFrame], [serverDestForDocument, serverDestForFrame])
	}
	source.postMessage([serverEstablisherDest, serverIdBuf], [serverEstablisherDest]);
}

// self.onfetch = e => e.respondWith(handleFetch(e));

// const handleFetch = async ({ request, target }) => {
// 	if(request.headers.get("sec-fetch-dest") != "iframe") return new Response("", { status: 502 });
// 	const
// 		{ addr, type } = Object.fromEntries(new URL(request.url).searchParams.entries()),
// 		[name, rand, serverId] = addr.split("-"),
// 		port = serverIdMap[serverId]?.[`${name}-${rand}`]?.[type]
// 	;
// 	if(!port) return new Response("", { status: 502 });
// 	target.postMessage(port, [port]);
// 	return new Response("", { status: 200 })
// }
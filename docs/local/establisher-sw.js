const
	rand = (length = 8, base = 36) => Math.floor(Math.random() * (base ** length - 1)).toString(base).padStart(length, "0"),
	tEnc = new TextEncoder("utf-16"),
	serverIdMap = {}
;

self.onmessage = async ({ data: { code, data }, source }) => {
	let serverIdBuf;
	while((serverIdBuf = rand()) in serverIdMap){};
	const
		serverIdComponents = serverIdMap[serverIdBuf] = {},
		{ port1: serverEstablisherPort, port2: serverEstablisherDest } = new MessageChannel()
	;
	serverEstablisherPort.onmessage = async ({ data: [msgId, address] }) => {
		const
			{ port1: serverPortForDocument, port2: serverDestForDocument } = new MessageChannel(),
			{ port1: serverPortForFrame, port2: serverDestForFrame } = new MessageChannel()
		;
		// if(serverIdBuf !== serverId) return;

		Object.assign(serverIdComponents, {
			[origin]: {
				document: serverPortForDocument,
				frame: serverPortForFrame,
			}
		});

		serverEstablisherPort.postMessage([serverDestForDocument, serverDestForFrame], [serverDestForDocument, serverDestForFrame])
	}
	source.postMessage([serverEstablisherDest, serverIdBuf], [serverEstablisherDest]);
};
const
	rand = (length = 8, base = 36) => Math.floor(Math.random() * (base ** length - 1)).toString(base).padStart(length, "0"),
	serverMap = {}
;

let serverIdMap = "";

self.onmessage = async ({ data: { code, data }, source }) => {
	console.log(code, data)
	switch(code) {
		case "OPEN": {
			let serverIdBuf;
			while(serverIdMap.includes(serverIdBuf = rand())){};
			serverIdMap += serverIdBuf + "\0"
			const
				{ port1: serverEstablisherPort, port2: serverEstablisherDest } = new MessageChannel()
			;
			serverEstablisherPort.onmessage = async ({ data: [msgId, origin] }) => {
				const
					{ port1: serverPortForDocument, port2: serverDestForDocument } = new MessageChannel(),
					{ port1: serverPortForFrame, port2: serverDestForFrame } = new MessageChannel()
				;
				// if(serverIdBuf !== serverId) return;
		
				serverMap[origin] = {
					document: serverPortForDocument,
					frame: serverPortForFrame,
				}
		
				serverEstablisherPort.postMessage([msgId, serverDestForDocument, serverDestForFrame], [serverDestForDocument, serverDestForFrame])
			}
			console.log(source)
			source.postMessage([serverEstablisherDest, serverIdBuf], [serverEstablisherDest]);
			break;
		}
		case "CONNECT": {
			const { origin, destination } = data;
			const port = serverMap[origin][destination];
			if(port) delete serverMap[origin][destination]
			source.postMessage(port, [port]);
		}
	}
};
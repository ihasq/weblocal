import { set as setIKV } from "idb-keyval";

(async () => {
	main: {
		if(window == parent) break main;

		const portal = new SharedWorker("./shared.js");

		portal.port.onmessage = (e) => {
			
		}
	
		const { data: port }: { data: MessagePort } = await new Promise(r_init => self.onmessage = r_init);
	
		if(!(port instanceof MessagePort)) break main;
	
		console.log("port recieved")
	
		const
			channelMap = {},
			signal = new BroadcastChannel("--weblocal-connection-signal"),
			tDec = new TextDecoder(),
			{ publicKey, privateKey } = await crypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-512' }, false, ['encrypt', 'decrypt'])
		;
	
		await setIKV("--weblocal-connection-key", publicKey);
	
		signal.onmessage = async ({ data: tag }: { data: ArrayBuffer }) => {
	
			const
				channel = tDec.decode(await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, tag)),
				channelPort = new BroadcastChannel(channel),
				channelPromises = {}
			;
	
			channelMap[channel] = {
				port: channelPort,
				promises: channelPromises
			};
	
			channelPort.onmessage = async ({ data: { code, id, data } }) => {
				switch(code) {
					case "REQUEST": {
						port.postMessage({ code, id, data });
						channelPort.postMessage({ code: "RESPONSE", id, data: await new Promise(r_post => channelPromises[id] = r_post) })
						break;
					}
				}
			}
	
		}
	
		port.onmessage = async ({ data: { code, id, data, channel } }) => {
			switch(code) {
				case "RESPONSE": {
					channelMap[channel]?.promises?.[id]?.(data);
					break;
				}
			}
		}
	
		port.postMessage({ code: "CONNECT" });
	}
})()

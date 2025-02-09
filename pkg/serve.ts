import { ESTABLISHER_ORIGIN, ADDRESS_ORIGIN } from "./var";
import { rand } from "./lib/math";

const
	tEnc = new TextEncoder(), tDec = new TextDecoder(),

	{ publicKey, privateKey: serverVerifierKey } = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-521" }, true, ["sign", "verify"]),

	encodedPublicKey = encodeURIComponent(tDec.decode(await crypto.subtle.exportKey("raw", publicKey))),

	
	{ target: serverEstablisherFrame }: Event = await new Promise(r_load => document.head.append(
		Object.assign(
			document.createElement("iframe"),
			{
				src: new URL(`/local?op=open&pub=${encodedPublicKey}`, ESTABLISHER_ORIGIN).href,
				onload: r_load

			}
		)
	)),

	[serverEstablisherPort, serverId]: [MessagePort, string] = await new Promise(
		r_msgPort =>
			globalThis.addEventListener(
				"message",
				async ({ data: [msgPort, serverId], source }) =>
					source === (serverEstablisherFrame as HTMLIFrameElement)?.contentWindow
						? r_msgPort([msgPort, serverId])
						: void 0
				,
				{ passive: true }
			)
	),

	establishmentMsgMap: { [key: string]: Function } = {},
	establishServer = (address: string, encodedAddress: Uint8Array, signature: ArrayBuffer): Promise<[MessagePort, MessagePort]> => {
		let msgId;
		while((msgId = rand()) in establishmentMsgMap){};
		serverEstablisherPort.postMessage([msgId, address, encodedAddress, signature], [encodedAddress.buffer, signature]);
		return new Promise(r_void => establishmentMsgMap[msgId] = r_void);
	},

	registrationMap = {},

	serve: WLServe = async (
		
		handler,
		options

	): Promise<WLServerHandler | undefined> => {

		if(!handler) return;

		const serverDriver = Object.assign({

			name: "local",
			origin: ADDRESS_ORIGIN,

		}, typeof handler == "function" ? Object.assign({ handler }, options) : handler);

		if(serverDriver.name.includes("-")) return;

		let address;

		if((address = serverDriver.name) in registrationMap) while((address = `${serverDriver.name}-${rand()}`) in registrationMap){};

		const
			encodedAddress = tEnc.encode(address),
			origin = serverDriver.origin(`${address}-${serverId}`),
			signature = await crypto.subtle.sign("ECDSA", serverVerifierKey, tEnc.encode(address)),

			serverCallback = async ({ data: { code, id, data }, source }: MessageEvent) => {

				switch(code) {
	
					case "REQUEST": {
	
						const
							[body, bodyUsed, cache, credentials, destination, duplex, headers, integrity, isHistoryNavigation, keepalive, method, mode, redirect, referrer, referrerPolicy, targetAddressSpace, url] = data,
							response = await serverDriver.handler(new Request(url, { body, cache, credentials, headers, integrity, keepalive, method, redirect, referrer, referrerPolicy })),
							{ status, statusText } = response
						;
	
						const responseBody = await response.arrayBuffer();
	
						(source as MessagePort).postMessage({ code: "RESPONSE", id, data: [responseBody, status, statusText, Object.fromEntries(response.headers.entries())] }, [responseBody])
	
						break;
					}
				}
			}
		;

		(await establishServer(address, encodedAddress, signature)).forEach(serverPort => serverPort.onmessage = serverCallback);

		// await new Promise(r_init => {

		// 	const { port1: signalPort, port2: signalDest } = new MessageChannel();

		// 	const { port1: serverPort, port2: serverDest } = new MessageChannel();

		// })

		return {
			url: origin,
			async reload() {

			},
			async close() {

			}
		}
	}
;

console.log(encodedPublicKey);


serverEstablisherPort.onmessage = ({ data: [msgId, serverPortForDocument, serverPortForFrame] }) => establishmentMsgMap[msgId]?.([serverPortForDocument, serverPortForFrame]);

export { serve }
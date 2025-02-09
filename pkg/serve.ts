import { ESTABLISHER_ORIGIN, ADDRESS_ORIGIN } from "./var";
import { rand } from "./lib/math";

const
	{ publicKey, privateKey: serverVerifierKey } = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-521" }, true, ["sign", "verify"]),
	tDec = new TextDecoder(),
	encodedPublicKey = encodeURI(tDec.decode(await crypto.subtle.exportKey("raw", publicKey))),

	{ target: serverEstablisherFrame }: Event = await new Promise(r_load => document.head.append(
		Object.assign(
			document.createElement("iframe"),
			{
				src: new URL(`/new?pub=${encodedPublicKey}`, ESTABLISHER_ORIGIN).href,
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
	establishServer = (address: string, encodedAddress: Uint8Array, signature: ArrayBuffer): Promise<MessagePort> => {
		let msgId;
		while((msgId = rand()) in establishmentMsgMap){};
		serverEstablisherPort.postMessage({ address, encodedAddress, signature }, [encodedAddress.buffer, signature]);
		return new Promise(r_void => establishmentMsgMap[msgId] = r_void);
	}
;

serverEstablisherPort.onmessage = ({ data: { msgId, serverPort } }) => establishmentMsgMap[msgId]?.(serverPort);

const registrationMap = {};

const tEnc = new TextEncoder();

export const serve: WLServe = async (
	
	handler,
	options

): Promise<WLServerHandler | undefined> => {

	if(!handler) return;

	const serverDriver = Object.assign({

		name: "local",
		origin: ADDRESS_ORIGIN,

	}, typeof handler == "function" ? Object.assign({ handler }, options) : handler);


	let address;

	if((address = serverDriver.name) in registrationMap) while((address = `${serverDriver.name}-${rand()}`) in registrationMap){};

	const
		encodedAddress = tEnc.encode(address),
		origin = serverDriver.origin(`${address}-${serverId}`),
		signature = await crypto.subtle.sign("ECDSA", serverVerifierKey, tEnc.encode(address)),
		serverDest = await establishServer(address, encodedAddress, signature)
	;

	serverDest.onmessage = async ({ data: { code, id, data }, source }) => {

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
};
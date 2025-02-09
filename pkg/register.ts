import { SIGNAL_ORIGIN } from "./var";
import { rand } from "./math";

const
	{ publicKey, privateKey: serverVerifierKey } = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-521" }, true, ["sign", "verify"]),
	tDec = new TextDecoder(),
	encodedPublicKey = encodeURI(tDec.decode(await crypto.subtle.exportKey("raw", publicKey))),
	serverId = rand(),
	{ target: serverEstablisherFrame }: Event = await new Promise(r_load => document.head.append(
		Object.assign(
			document.createElement("iframe"),
			{
				src: new URL(`/new?id=${serverId}&pub=${encodedPublicKey}`, SIGNAL_ORIGIN).href,
				onload: r_load

			}
		)
	)),
	serverEstablisherPort: MessagePort = await new Promise(
		r_msgPort =>
			globalThis.addEventListener(
				"message",
				async ({ data: msgPort, source }) =>
					source === (serverEstablisherFrame as HTMLIFrameElement)?.contentWindow
						? r_msgPort(msgPort)
						: void 0
				,
				{ passive: true }
			)
	),
	establishmentMsgMap: { [key: string]: Function } = {},
	establishServer = async (serverId: string, signature: ArrayBuffer): Promise<MessagePort> => {
		let msgId;
		while((msgId = rand()) in establishmentMsgMap){};
		serverEstablisherPort.postMessage({ serverId, signature }, [signature]);
		return await new Promise(r_void => establishmentMsgMap[msgId] = r_void);
	}
;

serverEstablisherPort.onmessage = ({ data: { msgId, serverPort } }) => establishmentMsgMap[msgId]?.(serverPort);

export { serverVerifierKey, serverId, establishServer };
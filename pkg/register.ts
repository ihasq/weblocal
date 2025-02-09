import { SIGNAL_ORIGIN } from "./var";
import { rand } from "./math";

const
	{ publicKey, privateKey: serverVerifierKey } = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-521" }, true, ["sign", "verify"]),
	tDec = new TextDecoder(),
	encodedPublicKey = encodeURI(tDec.decode(await crypto.subtle.exportKey("raw", publicKey))),
	serverId = rand(),
	p_serverEstablisher: Promise<Event> = new Promise(r_load => document.head.append(
		Object.assign(
			document.createElement("iframe"),
			{
				src: new URL(`/new?id=${serverId}&pub=${encodedPublicKey}`, SIGNAL_ORIGIN).href,
				onload: r_load

			}
		)
	)),
	p_establisherPort: Promise<MessagePort> = new Promise(
		r_msgPort =>
			globalThis.onmessage = async ({ data, source }) =>
				source === ((await p_serverEstablisher.target) as HTMLIFrameElement)?.contentWindow
					? r_msgPort(data)
					: void 0
	),
	establishPort = async (id: string, pub: string) => {
		
	}
;

export { serverVerifierKey, serverId, p_establisherPort };
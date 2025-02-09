import { rand36 } from "./math";

const
	{ publicKey, privateKey: serverVerifierKey } = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-521" }, true, ["sign", "verify"]),
	tDec = new TextDecoder(),
	encodedPublicKey = encodeURI(tDec.decode(await crypto.subtle.exportKey("raw", publicKey))),
	serverId = rand36(),
	{ target: serverLoader }: { target: HTMLIFrameElement } = await new Promise(r_load => document.head.append(
		Object.assign(
			document.createElement("iframe"),
			{
				src: `https://weblocal.dev/local?id=${serverId}&pubkey=${encodedPublicKey}`,
				onload: r_load

			}
		)
	))
;

export { serverLoader, serverVerifierKey, serverId };
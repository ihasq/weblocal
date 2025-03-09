main: {

	if(window == parent || !location.hash) break main;

	const { data: port } = await new Promise(r_init => self.onmessage = r_init);

	if(port instanceof MessagePort) break main;

	const
		signal = new BroadcastChannel("wl-signal"),
		tDec = new TextDecoder(),
		{ publicKey, privateKey } = await crypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-512' }, true, ['encrypt', 'decrypt'])
	;

	localStorage.setItem("--weblocal-connection-key", tDec.decode(await crypto.subtle.exportKey("raw", publicKey)));

	port.onmessage = async ({ data: { code, id, data, channel } }) => {

	}

	signal.onmessage = async ({ data: tag }) => {

		const
			channel = tDec.decode(await crypto.subtle.decrypt({ name: "RSA-OAEP", hash: "SHA-512" }, privateKey, Uint8Array.from(tag, m => m.codePointAt(0)))),
			portal = new BroadcastChannel(channel)
		;

		portal.onmessage = ({ data: { code, id, data } }) => port.postMessage({ code, id, data, channel });
	}
}
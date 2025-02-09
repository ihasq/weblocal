import { serverLoader, serverVerifierKey, serverId } from "./local"
import { rand36 } from "./math";

const registrationMap = {};

const tEnc = new TextEncoder();

export const serve: WLServe = async (
	
	handler,
	options

): Promise<WLServerHandler | undefined> => {

	if(!handler) return;

	const serverDriver = Object.assign({

		name: "local",
		origin: (address: string) => `https://${address}.weblocal.dev`,
		endpoint: "https://weblocal.pages.dev/new"

	}, typeof handler == "function" ? Object.assign({ handler }, options) : handler);


	let address;

	if((address = serverDriver.name) in registrationMap) while((address = `${serverDriver.name}-${rand36()}`) in registrationMap){};

	const origin = serverDriver.origin(`${address}-${serverId}`);
	
	const signature = await crypto.subtle.sign("ECDSA", serverVerifierKey, tEnc.encode(address))

	serverLoader.contentWindow?.postMessage({ code: "OPEN", data: { address, signature } }, "https://weblocal.dev", [signature])

	await new Promise(r_init => {

		const { port1: signalPort, port2: signalDest } = new MessageChannel();

		const { port1: serverPort, port2: serverDest } = new MessageChannel();

		serverPort.onmessage = async ({ data: { code, id, data }, source }) => {

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
	})

	return {
		url: origin,
		async reload() {

		},
		async close() {

		}
	}
};
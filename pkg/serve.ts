import { ADDRESS_ORIGIN } from "./var.ts";

const

	serverMap: { [key: string]: string } = {},

	serve = async (

		handler: (request: Request) => Response,

	): Promise<{
		url: string,
		close: () => void
	}> => {

		let id;
		while((id = crypto.randomUUID()) in serverMap) {};

		const
			url = ADDRESS_ORIGIN(id),
			{ target: loader }: { target: HTMLIFrameElement } = await new Promise(r_loader =>
				document.head.append(Object.assign(
					document.createElement("iframe"),
					{
						src: url,
						onload: r_loader
					}
				))
			),
			{ port1: serverFramePort, port2: serverFrameDest } = new MessageChannel()
		;
			
		loader.contentWindow?.postMessage(serverFrameDest, url, [serverFrameDest]);
		
		await new Promise(r_connect => serverFramePort.onmessage = async ({ data: { code, id, data } }) => {
			
			switch(code) {
				case "REQUEST": {
					const
						[req_body, cache, credentials, req_headers, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy, url] = data,
						{ body, headers, status, statusText } = await handler(new Request(url, { body: req_body, cache, credentials, integrity, headers: req_headers, keepalive, method, mode: "same-origin", redirect, referrer, referrerPolicy })),
						serializedHeaders = Object.fromEntries(headers.entries()),
						serializedBody = await new Response(body).arrayBuffer()
					;
					serverFramePort.postMessage({ code: "RESPONSE", id, data: [serializedBody, serializedHeaders, status, statusText] }, [serializedBody])
					break;
				}
				case "CONNECT": {
					r_connect(0);
					break;
				}
			}
		});

		setInterval(() => serverFramePort.postMessage({ code: "HEARTBEAT" }), 1000)

		return {
			get url() {
				return url;
			},
			close() {
				loader.remove();
			}
		}
	}
;

export { serve }
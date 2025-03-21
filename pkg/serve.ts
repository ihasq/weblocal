import { ADDRESS_ORIGIN } from "./var.ts";
import { rand } from "./lib/math.ts";

const

	serverMap = {},

	compStream = new CompressionStream("gzip"),

	serve: WLServe = async (

		handler,
		options

	) => {

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
			{ port1: serverFramePort, port2: serverFrameDest } = new MessageChannel(),
			{ port1: serverWindowPort, port2: serverWindowDest } = new MessageChannel(),
			definiteHandler = options
				? Object.assign(options, { handler })
				: typeof handler == "function"
					? { handler }
					: handler
			,
			msgHandler = async ({ data: { code, id, data } }: { data: { code: string, id: string, data: any } }) => {
				switch(code) {
					case "REQUEST": {
						const
							[req_body, cache, credentials, integrity, req_headers, keepalive, method, mode, redirect, referrer, referrerPolicy, url] = data,
							{ body, headers, status, statusText } = await definiteHandler.handler(new Request(url, { body: req_body, cache, credentials, integrity, headers: req_headers, keepalive, method, mode, redirect, referrer, referrerPolicy })),
							serializedHeaders = Object.fromEntries(headers.entries()),
							serializedBody = new Response(body?.pipeThrough(compStream)).arrayBuffer()
						;
						serverFramePort.postMessage({ code: "RESPONSE", id, data: [serializedBody, serializedHeaders, status, statusText] }, [serializedBody])
						break;
					}
					case "CONNECT": {
						r_connect(0);
						break;
					}
				}
			}
		;

		loader.contentWindow?.postMessage(serverFrameDest, url, [serverFrameDest]);

		await new Promise(r_connect => serverFramePort.onmessage = async ({ data: { code, id, data } }) => {
			
		});

		return {
			openWindow() {

			},
			async close() {

			},
			async reload() {

			}
		}
	}
;

export { serve }
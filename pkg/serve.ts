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
			url = new URL("connect", ADDRESS_ORIGIN(id)).href,
			{ target: loader }: { target: HTMLIFrameElement } = await new Promise(r_loader =>
				document.head.append(Object.assign(
					document.createElement("iframe"),
					{
						src: url,
						onload: r_loader
					}
				))
			),
			{ port1: serverPort, port2: serverDest } = new MessageChannel(),
			definiteHandler = options
				? Object.assign(options, { handler })
				: typeof handler == "function"
					? { handler }
					: handler
		;

		loader.contentWindow?.postMessage(serverDest, url, [serverDest]);

		await new Promise(r_connect => serverPort.onmessage = async ({ data: { code, id, data } }) => {
			switch(code) {
				case "REQUEST": {
					const
						[req_body, cache, credentials, integrity, req_headers, keepalive, method, mode, redirect, referrer, referrerPolicy, url] = data,
						{ body, headers, status, statusText } = await definiteHandler.handler(new Request(url, { body: req_body, cache, credentials, integrity, headers: req_headers, keepalive, method, mode, redirect, referrer, referrerPolicy })),
						serializedHeaders = Object.fromEntries(headers.entries()),
						serializedBody = new Response(body?.pipeThrough(compStream)).arrayBuffer()
					;
					serverPort.postMessage({ code: "RESPONSE", id, data: [serializedBody, serializedHeaders, status, statusText] }, [serializedBody])
					break;
				}
				case "CONNECT": {
					const [connect, user] = data;
					r_connect(0);
					break;
				}
			}
		});

		return {
			url,
			async close() {

			},
			async reload() {

			}
		}
	}
;

export { serve }
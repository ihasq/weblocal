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
			definiteHandler = options
				? Object.assign(options, { handler })
				: typeof handler == "function"
					? { handler }
					: handler
		;
			
		loader.contentWindow?.postMessage(serverFrameDest, url, [serverFrameDest]);
		
		await new Promise(r_connect => serverFramePort.onmessage = async ({ data: { code, id, data } }) => {
			
			switch(code) {
				case "REQUEST": {
					const
						[req_body, cache, req_headers, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy, url] = data,
						{ body, headers, status, statusText } = await definiteHandler.handler(new Request(url, { body: req_body, cache, integrity, headers: (req_headers || {}), keepalive, method, mode: "same-origin", redirect, referrer, referrerPolicy })),
						serializedHeaders = Object.fromEntries(headers.entries()),
						serializedBody = await new Response(body?.pipeThrough(compStream)).arrayBuffer()
					;
					console.log(data)
					serverFramePort.postMessage({ code: "RESPONSE", id, data: [serializedBody, serializedHeaders, status, statusText] }, [serializedBody])
					break;
				}
				case "CONNECT": {
					r_connect(0);
					break;
				}
			}
		});

		loader.remove();

		setInterval(() => serverFramePort.postMessage({ code: "HEARTBEAT" }), 1000)

		return {
			get url() {
				return url;
			}
		}
	}
;

export { serve }
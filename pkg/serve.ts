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
		
		const pingTag: string = await new Promise(r_connect => serverFramePort.onmessage = async ({ data: [req_entries, id] }) => {
			
			switch(!!id) {
				case true: {
					const
						reqInit = Object.assign(Object.fromEntries(req_entries), { mode: "same-origin" }),
						res = await handler(new Request(reqInit.url, reqInit)),
						isResponse = res instanceof Response,
						{ body, headers, status, statusText } = res,
						serializedHeaders = isResponse ? Object.fromEntries(headers) : headers
						// serializedBody = isResponse ? await new Response(body).arrayBuffer() : body
					;
					serverFramePort.postMessage([body, { headers: serializedHeaders, status, statusText }, id], [body]);
	
					// if(body) {
	
					// 	const
					// 		bodyReader = body.getReader()
					// 	;
	
					// 	while(true) {
					// 		const { done, value } = await bodyReader.read();
					// 		if(done) break;
					// 		serverFramePort.postMessage({ code: "RESPONSE_CHUNK", id, data: value }, [value])
					// 	}
					// };
	
					// serverFramePort.postMessage({ code: "RESPONSE_EOL", id })
	
					break;
				}
				default: {
					r_connect(req_entries);
					break;
				}
			}
		});

		const pingIntervalId = setInterval(() => loader.src = url + "/" + pingTag, 20 * 1000);

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
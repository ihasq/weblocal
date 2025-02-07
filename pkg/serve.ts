const registrationMap = {};

export const serve: WLServe = async (
	
	handler,
	options

): Promise<WLServerHandler | undefined> => {

	if(!handler) return;

	const serverDriver = Object.assign({

		name: "localhost",
		origin: (address: string) => `https://${address}.weblocal.dev`,
		endpoint: "https://weblocal.pages.dev/new"

	}, typeof handler == "function" ? { handler } : handler);


	let address;

	while((address = `${serverDriver.name}-${Math.floor(Math.random() * (36 ** 8 - 1)).toString(36).padStart(6, "0")}`) in registrationMap){}

	const origin = serverDriver.origin(address);

	const loader: HTMLIFrameElement = await new Promise(r_loader => document.head.append(Object.assign(
		document.createElement("iframe"),
		{
			src: origin,
			onload(e: UIEvent) {
				r_loader(e.target as HTMLIFrameElement);
			}
		}
	)));

	const { port1: serverPort, port2 } = new MessageChannel();

	loader.contentWindow?.postMessage(port2, origin, [port2]);

	await new Promise(r_init => serverPort.onmessage = async ({ data: { code, id, data } }) => {

		switch(code) {

			case "REQUEST": {

				const
					[body, bodyUsed, cache, credentials, destination, duplex, headers, integrity, isHistoryNavigation, keepalive, method, mode, redirect, referrer, referrerPolicy, targetAddressSpace, url] = data,
					response = await serverDriver.handler(new Request(url, { body, cache, credentials, headers, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy })),
					{ status, statusText } = response
				;

				const responseBody = await response.arrayBuffer()

				serverPort.postMessage({ code: "RESPONSE", id, data: [responseBody, status, statusText, Object.fromEntries(response.headers.entries())] }, [responseBody])

				break;
			}

			case "INIT": {

				r_init(undefined);

				break;
			}
		}
	})

	loader.remove();

	return {
		url: origin,
		async reload() {

		},
		async close() {

		}
	}
};
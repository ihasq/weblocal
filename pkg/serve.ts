export const serve: WLServe = async (
	
	handler,
	options

): Promise<WLServerHandler | undefined> => {

	if(!handler) return;

	const serverDriver = Object.assign({

		name: "localhost",
		origin: "https://weblocal.pages.dev",
		endpoint: "https://weblocal.pages.dev/new"

	}, typeof handler == "function" ? { handler } : handler);

	const loader: HTMLIFrameElement = await new Promise(r_loader => document.head.append(Object.assign(
		document.createElement("iframe"),
		{
			src: new URL(`?name=${encodeURIComponent(serverDriver.name)}`, serverDriver.endpoint).href,
			onload(e: UIEvent) {
				r_loader(e.target as HTMLIFrameElement);
			}
		}
	)));

	const { port1: serverPort, port2 } = new MessageChannel();

	loader.contentWindow?.postMessage(port2, serverDriver.origin, [port2]);

	const { url }: { url: string } = await new Promise(r_init => serverPort.onmessage = async ({ data: { code, id, data } }) => {

		switch(code) {

			case "REQUEST": {

				const [body, bodyUsed, cache, credentials, destination, duplex, headers, integrity, isHistoryNavigation, keepalive, method, mode, redirect, referrer, referrerPolicy, targetAddressSpace, url] = data;
				const response = await serverDriver.handler(new Request(url, { body, cache, credentials, headers, integrity, keepalive, method, mode, redirect, referrer, referrerPolicy }))

				break;
			}

			case "INIT": {

				r_init(data);

				break;
			}
		}
	})

	loader.remove();

	return {
		url,
		async reload() {

		},
		async close() {

		}
	}
};
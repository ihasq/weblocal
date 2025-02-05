type WebLocalCallback = (request: Request) => (Response | Promise<Response>)

type WebLocalHandler = 
	WebLocalCallback |
	{
		handler: WebLocalCallback
	}
;

interface ServerHandler {
	url: string,
	close: () => Promise<void>,
	reload: () => Promise<void>
}

interface StaticServerHandler extends ServerHandler {
	reloadMode: string,
}

export const serve = async (handler: WebLocalHandler): Promise<ServerHandler | undefined> => {
	if(!handler) return;

	const loader: HTMLIFrameElement = await new Promise(r_loader => document.head.append(Object.assign(
		document.createElement("iframe"),
		{
			onload(e: UIEvent) {
				r_loader(e.target as HTMLIFrameElement);
			}
		}
	)));

	const
		serverDriver = Object.assign({}, typeof handler == "function" ? { handler } : handler)

	const url = new URL("").href;

	loader.remove();

	return {
		url,
		async reload() {

		},
		async close() {

		}
	}
};

export const serveStatic = async (directoryHandle: FileSystemDirectoryHandle): Promise<StaticServerHandler> => {

	const server = await serve({
		async handler(req) {
			return new Response("")
		}
	});

	setInterval(() => {

	}, 0.5 * 1000)

	const url = new URL("").href;

	return {
		url,
		reloadMode: "app",
		async reload() {

		},
		async close() {
			return; 
		}
	}
}
type WebLocalHandler = (request: Request) => (Response | Promise<Response>)

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

	const loader = await new Promise(r_loader => document.head.append(Object.assign(
		document.createElement("iframe"),
		{
			onload({ target }: UIEvent) {
				r_loader(target);
			}
		}
	)));

	const
		typeofHandler = typeof handler
	;

	handler = typeofHandler == "function"
		? {
			handler
		}
		: Object.assign({

		}, handler)
	;

	const url = new URL("").href;

	return {
		url,
		async reload() {

		},
		async close() {

		}
	}
};

export const serveStatic = async (directoryHandle: FileSystemDirectoryHandle): Promise<StaticServerHandler> => {

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
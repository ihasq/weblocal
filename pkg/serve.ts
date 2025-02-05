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
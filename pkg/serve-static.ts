import { serve } from "./serve";

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
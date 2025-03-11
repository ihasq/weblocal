import { serve } from "./serve.ts";

export const serveStatic: WLServeStatic = async (
	
	directoryRoot,
	options

) => {

	const server = await serve({
		async handler(req) {
			return new Response("")
		}
	});

	if(directoryRoot instanceof FileSystemDirectoryHandle) {
		
	}

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
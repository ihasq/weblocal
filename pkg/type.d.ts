type WLServerCallback = (request: Request) => (Response | Promise<Response>);

type WLDirectoryRoot = FileSystemDirectoryHandle | FileSystemCreateWritableOptions;



interface WLServerOptions {
	origin?: string,
}

interface WLServerConfig extends WLServerOptions {
	handler: WLServerCallback
}

interface WLStaticServerConfig extends WLServerOptions {
	root: WLDirectoryRoot
}



interface WindowClient {
	focused: boolean,
	frameType: "window",
	id: "auxiliary" | "top-level" | "nested" | "none",
	type: string,
	url: "string",
	visibilityState: "hidden" | "visible" | "prerender" ,

	focus: () => Promise<WindowClient>,
	navigate: (url: string) => Promise<WindowClient>,
	postMessage: (message: any, transferables: Transferable[]) => void,
}

interface WLServerHandler {
	openWindow: () => void,
	close: () => Promise<void>,
	reload: () => Promise<void>
}

interface WLStaticServerHandler extends WLServerHandler {
	reloadMode: string,
}



type WLServe =
	((handler: WLServerCallback, options?: WLServerOptions) => Promise<WLServerHandler | undefined>) |
	((config: WLServerConfig) => Promise<WLServerHandler | undefined>)
;

type WLServeStatic =
	((directoryRoot: WLDirectoryRoot, options?: WLServerOptions) => Promise<WLServerHandler | undefined>) |
	((config: WLStaticServerConfig) => Promise<WLServerHandler | undefined>)
;
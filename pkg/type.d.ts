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



interface WLServerHandler {
	url: string,
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
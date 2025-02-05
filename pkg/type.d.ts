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

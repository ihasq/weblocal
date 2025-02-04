/**
 * @type { Promise<HTMLIFrameElement> }
 */
const loader = new Promise(r_loader => {
	const loader = Object.assign(document.createElement("iframe"), {
		onload({ target }) {
			r_loader(target);
		}
	});
	document.head.append(loader);
});

const submitBuild = () => new Promise(r_submission => {

})

/**
 * @typedef { (request: Request) => (Response | Promise<Response>) } WebLocalHandler
 * 
 * @param { WebLocalHandler | { handler: WebLocalHandler } } handler 
 * @returns { Promise<{ url: string, close: () => Promise<void> }> }
 */
export const serve = (handler) => new Promise(async r_serve => {
	const buildCompleted = await submitBuild();
	const typeofHandler = typeof handler;
	handler = typeofHandler == "function"
		? {
			
			handler
		}
		: handler
	;
	(await loader).src
	buildCompleted();
});
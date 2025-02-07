const
	p_port = new Promise(r_port => self.onmessage = r_port);
	promiseMap = {};

const onfetch = async ({ request }) => {
	const port = await p_port;
	port.postMessage({
		code: "REQUEST",
	})
}

self.addEventListener("fetch", e => e.respondWith(onfetch(e)), true);

p_port.then(port => {
	port.onmessage = ({ data: { code, id, data } }) => {
		switch(code) {
			case "RESPONSE": {
				promiseMap[id]?.(data);
				break;
			}
		}
	}
})
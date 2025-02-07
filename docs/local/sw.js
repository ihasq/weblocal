self.onmessage = ({ data: { code, id, data }, target }) => {
	switch(code) {
		case "INSTALL": {
			target.navigate("https://weblocal.dev/local")
			break;
		}
		case "CONNECT": {

		}
	}
}

const local = new Blob([`<title>connect</title><script type="module">if(window !== parent) (await navigator.serviceWorker.ready).active.postMessage({ code: "CONNECT" });</script>`], { type: "text/html" });

const handleFetch = async ({ request }) => {
	const { pathname, searchParams } = new URL(request.url);
	switch(pathname) {
		case "/local": {
			return new Response(local)
		}
	}
}

self.addEventListener("fetch", e => e.respondWith(handleFetch), true);
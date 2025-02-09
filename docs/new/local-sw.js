self.onmessage = ({ data, source }) => {
	
	source.postMessage({  })
}

self.onfetch = e => e.respondWith(handleFetch(e));

const handleFetch = async ({ request }) => {
	if(request.headers.get("sec-fetch-dest") != "iframe") return new Response("", { status: 502 });
	const { addr, type } = Object.fromEntries(new URL(request.url).searchParams.entries());
}
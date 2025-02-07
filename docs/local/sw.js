const handleFetch = async ({ request }) => {
	const { pathname, searchParams } = new URL(request.url)
	switch(pathname) {
		case "/local/": {
			return new Response("")
		}
	}
}

self.onfetch = e => e.respondWith(handleFetch(e))
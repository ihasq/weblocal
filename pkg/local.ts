const { target: loader }: { target: HTMLIFrameElement } = await new Promise(r_load => document.head.append(
	Object.assign(
		document.createElement("iframe"),
		{
			src: `https://weblocal.dev/local?type=load&hostname=${encodeURIComponent(location.hostname)}`,
			onload: r_load

		}
	)
));

if(loader.contentDocument?.title == "load") {
	await new Promise(r_ready => Object.assign(loader, {
		src: `https://weblocal.dev/local?hostname=${encodeURIComponent(location.hostname)}`,
		onload: r_ready
	}))
}

if(loader.contentDocument?.title == "connect") {

}

export { localPort };
await new Promise(r_load => document.head.append(
	Object.assign(
		document.createElement("iframe"),
		{
			src: `https://weblocal.dev/local?hostname=${encodeURIComponent(location.hostname)}`,
			onload: r_load

		}
	)
));

export { localPort };
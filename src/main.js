const $ = s => document.querySelector(s);

$`#directory`.onclick = async () => {
	const dirHandle = await globalThis.showDirectoryPicker({ startIn: "document" });
	const uuid = crypto.randomUUID();
	const loader = await new Promise(r => Object.assign($`#loader > iframe`, {
		src: `https://${uuid}.weblocal.dev`,
		onload({ target }) {
			r(target)
		}
	}));
}
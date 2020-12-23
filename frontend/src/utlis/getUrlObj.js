export default function getUrlObj(str) {
	const urlParams = new URLSearchParams(str)
	const entries = urlParams.entries()
	return Object.fromEntries(entries)
}

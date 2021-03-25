export const options = (method = "GET", body) => {
	return {
		method,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: body ? JSON.stringify(body) : null,
		credentials: "include",
	}
}

export const lightTheme = {
	theme: "light",
	body: "#edf1f5",
	header: "#3f4453",
	text: "#4c5264",
	scrollbar: "#e4e4e4",
	boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.05)",
	commentBg: "white",
}

export const darkTheme = {
	theme: "dark",
	body: "#161e29",
	header: "#f5f5f5",
	text: "#d3d3d3",
	scrollbar: "darkgrey",
	boxShadow: "0px 0px 10px 3px rgba(255, 255, 255, 0.3)",
	commentBg: "#32343b",
}

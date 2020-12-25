import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom"
import { createGlobalStyle, ThemeProvider } from "styled-components"
import Home from "./pages/HomePage"
import Login from "./pages/LoginPage"
import Search from "./pages/SearchPage"
import Anime from "./pages/AnimePage"
import Register from "./pages/RegisterPage"
import User from "./pages/UserPage"
import UserContext from "./UserContext"
import { tokenHandler } from "./api/user/auth"
import { getFavorites } from "./api/user/favorite"
import { lightTheme, darkTheme } from "./utlis/constants"

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
		box-sizing: border-box;
		font-family: 'Overpass', sans-serif;
	}
	body{
				background: ${({ theme }) => theme.body};
	}
	a {
		text-decoration: none;
	}
	h1, h2, h3, h4 {
		color: ${({ theme }) => theme.header};
	}
	p{
		color: ${({ theme }) => theme.text};
	}
`
export default function App() {
	const [user, setUser] = useState(null)
	const [theme, setTheme] = useState(lightTheme)

	const getUserData = async () => {
		const data = await tokenHandler()
		if (data) {
			const favorites = await getFavorites()
			setUser({ ...data, favorites })
		}
	}

	useEffect(() => {
		const userTheme = localStorage.getItem("theme")
		setTheme(userTheme === "dark" ? darkTheme : lightTheme)

		getUserData()
	}, [])
	const switchTheme = theme => {
		setTheme(theme === "dark" ? darkTheme : lightTheme)
		localStorage.setItem("theme", theme)
	}
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<GlobalStyle />
				<div className="App">
					<UserContext.Provider value={{ user, setUser }}>
						<Navbar user={user} theme={theme.theme} switchTheme={switchTheme} />
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/anime/:id" component={Anime} />
							<Route path="/search" component={Search} />
							<Route exact path="/me/:category">
								{user ? <User /> : <Redirect to="/login" />}
							</Route>
							<Route exact path="/login">
								{user ? <Redirect to={`/me/profile`} /> : <Login />}
							</Route>
							<Route exact path="/register">
								{user ? <Redirect to={`/me/profile`} /> : <Register />}
							</Route>
						</Switch>
					</UserContext.Provider>
				</div>
			</Router>
		</ThemeProvider>
	)
}

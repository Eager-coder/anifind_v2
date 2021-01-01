import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
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
import Footer from "./components/Footer"

export default function App() {
	const [user, setUser] = useState({ isLoggedIn: false, isLoading: true })
	const [theme, setTheme] = useState(lightTheme)

	const getUserData = async () => {
		const data = await tokenHandler()
		if (data) {
			const { data: favorites } = await getFavorites()
			console.log(favorites)
			setUser({ ...data, favorites, isLoading: false, isLoggedIn: true })
		} else {
			setUser({ ...user, isLoading: false })
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
						<main>
							<Switch>
								<Route exact path="/" component={Home} />
								<Route exact path="/anime/:id" component={Anime} />
								<Route exact path="/search" component={Search} />
								<Route exact path="/me/:category" component={User} />
								<Route exact path="/login" component={Login} />
								<Route exact path="/register" component={Register} />
							</Switch>
						</main>

						<Footer />
					</UserContext.Provider>
				</div>
			</Router>
		</ThemeProvider>
	)
}

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
		box-sizing: border-box;
		font-family: 'Overpass', sans-serif;
	}
	body {
		background: ${({ theme }) => theme.body};
	}

	main{
  	min-height: calc(100vh - 10rem);
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

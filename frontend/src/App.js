import { useEffect, useState, memo } from "react"
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
import User from "./pages/AccountPage"
import { lightTheme, darkTheme } from "./utlis/constants"
import Footer from "./components/Footer"
import { useDispatch, useSelector } from "react-redux"
import ModalMessage from "./components/ModalMessage"
import RootModal from "./components/RootModal"
import Member from "./pages/MemberPage"
import Character from "./pages/CharacterPage"
import DiscussionsListPage from "./pages/DiscussionsListPage"
import DiscussionPage from "./pages/DiscussionPage"
import NotFound from "./pages/NotFound"
import { requestAccessToken } from "./redux/actions/authActions"
import { getUser } from "./redux/actions/userActions"
import { getFavAnimes, getFavCharacters } from "./redux/actions/favActions"
const App = () => {
	const [theme, setTheme] = useState(lightTheme)
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(requestAccessToken()).then(isLoggedIn => {
			if (isLoggedIn) {
				dispatch(getUser())
				dispatch(getFavAnimes())
				dispatch(getFavCharacters())
			}
		})

		const userTheme = localStorage.getItem("theme")
		setTheme(userTheme === "dark" ? darkTheme : lightTheme)
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
					<Navbar theme={theme.theme} switchTheme={switchTheme} />
					<main>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/anime/:id" component={Anime} />
							<Route exact path="/character/:id" component={Character} />
							<Route exact path="/user/:username" component={Member} />
							<Route exact path="/search" component={Search} />
							<Route exact path="/me/:category" component={User} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/register" component={Register} />
							<Route
								exact
								path="/discussions/all"
								component={DiscussionsListPage}
							/>
							<Route
								exact
								path="/discussions/thread/:thread_id"
								component={DiscussionPage}
							/>
							<Route exact path="/404" component={NotFound} />
							<Route path="*" component={NotFound} />
						</Switch>
					</main>
					<Footer />
				</div>
			</Router>
			<ModalMessage />
			<RootModal />
		</ThemeProvider>
	)
}

export default memo(App)
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

	main {
  	min-height: calc(100vh - 10rem);
	}

	a {
		text-decoration: none;
	}
	h1, h2, h3, h4 {
		color: ${({ theme }) => theme.header};
	}
	p {
		color: ${({ theme }) => theme.text};
	}
`

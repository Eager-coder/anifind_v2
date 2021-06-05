import { useEffect, useState, memo, useContext } from "react"
import Navbar from "./components/Navbar"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { createGlobalStyle, ThemeProvider } from "styled-components"
import Home from "./pages/HomePage"
import Login from "./pages/LoginPage"
import AnimePage from "./pages/AnimePage"
import Register from "./pages/RegisterPage"
import User from "./pages/AccountPage"
import { lightTheme, darkTheme, Theme } from "./utlis/constants"
import Footer from "./components/Footer"
import ModalMessage from "./components/Modal/ModalMessage"
import RootModal from "./components/Modal/RootModal"
import Character from "./pages/CharacterPage"
import DiscussionsListPage from "./pages/DiscussionsListPage"
import DiscussionPage from "./pages/DiscussionPage"
import NotFound from "./pages/NotFound"
import { UserContext } from "./context/UserContext"
import MemberPage from "./pages/MemberPage"
import SearchPage from "./pages/SearchPage"
// import { FavoriteContext } from "./context/FavoriteContext"

const App = () => {
	const [theme, setTheme] = useState<Theme>(lightTheme)
	const { user, setUser } = useContext(UserContext)
	// const { fetchFavAnime, fetchFavCharacters, loadingFavAnime, loadingFavCharacters } =
	// useContext(FavoriteContext)
	useEffect(() => {
		setUser().then(ok => {
			if (ok) {
				// fetchFavAnime()
				// fetchFavCharacters()
			} else {
				// loadingFavAnime(false)
				// loadingFavCharacters(false)
			}
		})

		const userTheme = localStorage.getItem("theme")
		setTheme(userTheme === "dark" ? darkTheme : lightTheme)
	}, [])

	const switchTheme = (themeType: string) => {
		setTheme(themeType === "dark" ? darkTheme : lightTheme)
		localStorage.setItem("theme", themeType)
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
							<Route exact path="/anime/:id" component={AnimePage} />
							<Route exact path="/character/:id" component={Character} />
							<Route exact path="/user/:username" component={MemberPage} />
							<Route exact path="/search" component={SearchPage} />
							<Route exact path="/me/:category" component={User} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/register" component={Register} />
							<Route exact path="/discussions/all" component={DiscussionsListPage} />
							<Route exact path="/discussions/thread/:thread_id" component={DiscussionPage} />
							<Route exact path="/404" component={NotFound} />
							<Route path="*" component={NotFound} />
						</Switch>
					</main>
					<Footer />
				</div>
				<ModalMessage />
				<RootModal />
			</Router>
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
		background: ${({ theme }: any) => theme.body};
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

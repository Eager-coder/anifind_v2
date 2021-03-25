import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import styled from "styled-components"

const Nav = styled.nav`
	width: 100%;
	/* background-color: #4c5264; //current color */
	background-color: #32343b;

	.nav-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 50px;
		width: 100%;
		max-width: 1200px;
		height: 4rem;
		margin: auto;
		span.logo {
			cursor: pointer;
			border-radius: 7px;
			font-size: 2.5rem;
			font-weight: 600;
			color: white;
			&::after {
				content: "Find";
				color: #70c7a7;
			}
		}
	}
	.nav-links {
		display: flex;
		align-items: center;
		color: white;
		a {
			font-size: 1.2rem;
			color: white;
			font-weight: 600;
			border-bottom: 2px #70c7a7 solid;
		}
		img {
			cursor: pointer;
			height: 25px;
			filter: invert(1);
			margin-right: 20px;
		}
	}
	@media screen and (max-width: 768px) {
		.nav-container {
			height: 3.5rem;
			padding: 0 20px;
			span {
				font-size: 2rem;
			}
			.nav-links a {
				font-size: 1rem;
			}
		}
	}
`
export default function Navbar({ theme, switchTheme }) {
	const user = useSelector(state => state.user)

	const handleClick = () => {
		switchTheme(theme === "light" ? "dark" : "light")
	}
	return (
		<Nav>
			<div className="nav-container">
				<Link to="/">
					<span className="logo">Ani</span>
				</Link>
				<Link to="/discussions/all">Discussiosn</Link>
				<div className="nav-links">
					<img
						onClick={handleClick}
						src={`/assets/icons/${theme === "dark" ? "moon" : "sun"}.svg`}
						alt=""
					/>
					{user.isLoggedIn ? (
						<Link to={`/me/profile`}>{user.username}</Link>
					) : (
						<>
							<Link to="/login">Login</Link> |
							<Link to="/register">Register</Link>
						</>
					)}
				</div>
			</div>
		</Nav>
	)
}

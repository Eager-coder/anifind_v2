import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
const SideNav = styled.aside`
	width: 500px;
	.username span {
		text-transform: uppercase;
		font-size: 1.4rem;
		font-weight: 600;
	}
	.links {
		margin: 20px 30px;
		li {
			width: 100%;
			a {
				display: block;
				width: 100%;
				margin: 10px 0;
				text-transform: uppercase;
				font-size: 1.5rem;
			}
		}
	}
	.link {
		a {
			color: black;
		}
	}
	.link-active {
		a {
			border-left: #ff4834 4px solid;
			padding-left: 20px;
			color: #ff4834;
		}
	}
	@media (max-width: 1024px) {
		width: 350px;
	}
	@media (max-width: 768px) {
		.username span {
			font-size: 1.2rem;
		}
		width: 100%;
	}
`
export default function Sidebar() {
	const link = "profile"
	return (
		<SideNav>
			<div className="username">
				<span>Welcome, </span>
			</div>
			<ul className="links">
				<li className={link === "profile" ? "link-active" : "link"}>
					<Link to="/">Profile</Link>
				</li>
				<li className={link === "orders" ? "link-active" : "link"}>
					<Link to="/">Orders</Link>
				</li>
			</ul>
		</SideNav>
	)
}

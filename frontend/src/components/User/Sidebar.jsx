import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const SideNav = styled.aside`
	/* border: ${({ theme }) => theme.text} 2px solid; */
	/* background: ${({ theme }) => theme.commentBg}; */
	border-radius: 7px;
	margin-right: 100px;
	width: 200px;
	height: max-content;
	.links {
		margin: 20px 30px;
		list-style: none;
		li {
			width: 100%;
			a {
				display: block;
				width: 100%;
				margin: 10px 0;
				font-size: 1.5rem;
			}
		}
	}
	.link {
		a {
			color: ${({ theme }) => theme.header};
		}
	}
	.link-active {
		a {
			border-left: #70c7a7 4px solid;
			padding-left: 20px;
			color: #70c7a7;
		}
	}
	@media (max-width: 1024px) {
		width: 200px;
	}
	@media (max-width: 768px) {
		width: 100%;
	}
`
export default function Sidebar({ category }) {
	const link = "profile"
	return (
		<SideNav>
			<ul className="links">
				<li className={category === "profile" ? "link-active" : "link"}>
					<Link to="/me/profile">Profile</Link>
				</li>
				<li className={category === "favorites" ? "link-active" : "link"}>
					<Link to="/me/favorites">Favorites</Link>
				</li>
				<li className={category === "comments" ? "link-active" : "link"}>
					<Link to="/me/comments">Comments</Link>
				</li>
				<li className={category === "discussions" ? "link-active" : "link"}>
					<Link to="/me/discussions">Discussions</Link>
				</li>
				<li className={category === "settings" ? "link-active" : "link"}>
					<Link to="/me/settings">Settings</Link>
				</li>
			</ul>
		</SideNav>
	)
}

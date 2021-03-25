import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMember, removeMember } from "../redux/actions/memberActions"
import LoadingSpinner from "../components/LoadingSpinner"
import styled from "styled-components"
import { PrimaryBtn } from "../components/ButtonStyles"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import { followUser } from "../redux/actions/followActions"

export default function MemberPage({ match }) {
	const { username } = match.params
	const dispatch = useDispatch()
	const user = useSelector(state => state.user)
	const { info, isLoading } = useSelector(state => state.member)
	const followings = useSelector(state => state.follow.followings)
	const [isFollowing, setIsFollowing] = useState(false)

	const checkIsMemberFollowed = () => {
		return (
			followings?.list?.some(
				following => following.followed_id == info.user.user_id
			) || false
		)
	}
	useEffect(() => {
		if (info && user.isLoggedIn) {
			setIsFollowing(checkIsMemberFollowed())
		}
	}, [user, followings, info])

	useEffect(() => {
		dispatch(fetchMember(username))
		return () => {
			dispatch(removeMember())
		}
	}, [])
	if (!info || isLoading) return <LoadingSpinner />
	return (
		<Div>
			<Aside>
				<div className="avatar-container">
					<img src={info.user.avatar} alt="" />
				</div>
				<PrimaryBtn
					onClick={() => dispatch(followUser(info.user.user_id))}
					spinnerSize={6}
					isLoading={followings.isLoading}
					disabled={isFollowing}>
					{isFollowing ? "Following" : "Follow"}
				</PrimaryBtn>
				<PrimaryBtn>Message</PrimaryBtn>
			</Aside>
			<MainSection>
				<div className="top">
					<h1>{info.user.username}'s Profile</h1>
					<p>Member since {info.user.created_at}</p>
				</div>
				<div className="about">
					<h2>About</h2>
					<p>{info.user.about || "No about"}</p>
				</div>
				<div className="favorites">
					<h2>Favorites</h2>
					<div className="list">
						{info.favorites.map(item => (
							<Card key={item.id}>
								<img src={item.cover_image} alt="" />
								<p>{item.title}</p>
							</Card>
						))}
					</div>
				</div>
			</MainSection>
		</Div>
	)
}
const Div = styled.div`
	max-width: 1200px;
	padding: 0 50px;
	margin: auto;
	display: flex;
`
const MainSection = styled.div`
	width: 100%;
	.about {
		p {
			border: 1px solid black;
		}
	}
	.list {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, 120px);
		column-gap: 20px;
		row-gap: 20px;
	}
`
const Aside = styled.aside`
	margin-right: 100px;
	.avatar-container {
		width: 250px;
		height: 250px;
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
`

const Card = styled.div`
	width: 120px;
	display: flex;
	flex-direction: column;
	img {
		width: 120px;
		height: 170px;
		object-fit: cover;
		border-radius: 5px;
	}
	p {
		font-size: 0.9rem;
		height: 30px;
		margin-bottom: 5px;
	}
`

import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import styled from "styled-components"
const SocialEl = styled.div``

const UserCard = styled.div`
	width: 100px;
	img {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}
`
export default function Social() {
	const { followings, followers } = useSelector(state => state.follow)

	return (
		<SocialEl>
			<h1>Social</h1>
			<h2>Following</h2>
			{followings?.list?.map(following => (
				<UserCard key={following.followed_id}>
					<Link to={`/user/${following.username}`}>
						<img src={following.avatar} alt="" />
						<p>{following.username}</p>
					</Link>
				</UserCard>
			))}
			<h2>Followers</h2>
			{followers?.list?.map(follower => (
				<UserCard key={follower.follower_id}>
					<Link to={`/user/${follower.username}`}>
						<img src={follower.avatar} alt="" />
						<p>{follower.username}</p>
					</Link>
				</UserCard>
			))}
		</SocialEl>
	)
}

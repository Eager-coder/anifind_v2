import { formatDistanceStrict } from "date-fns"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import styled from "styled-components"
import client from "../utlis/client"

export default function DiscussionsListPage({ match, history }) {
	const [isLoading, setIsLoading] = useState(true)
	const [thread, setThread] = useState(null)
	const [posts, setPosts] = useState(null)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const getData = async () => {
		const { data, ok } = await client(
			`/discussions/thread/${match.params.thread_id}`
		)
		if (!data.thread) return history.replace("/404")
		setThread(data.thread)
		setPosts(data.posts)
		setIsLoading(false)
	}
	const user = useSelector(state => state.user)
	useEffect(() => getData(), [])

	return (
		<PageEl>
			{isLoading ? (
				<h1>Loading...</h1>
			) : (
				<>
					<ThreadEl>
						<h1>{thread.topic}</h1>
						{isEditOpen ? (
							<textarea
								defaultValue={thread.body}
								onChange={e => e.target.value}></textarea>
						) : (
							<p>{thread.body}</p>
						)}
						{thread.user_id === user.user_id ? (
							<button onClick={() => setIsEditOpen(true)}>Edit</button>
						) : null}
						<div className="user">
							<img src={thread.avatar} alt="" />
							<p>{thread.username}</p>
							<p>
								Posted{" "}
								{formatDistanceStrict(
									new Date(thread.created_at * 1000),
									new Date(),
									{
										addSuffix: true,
									}
								)}
							</p>
						</div>
					</ThreadEl>
					<div className="posts">
						{posts?.map(post => (
							<RenderPosts post={post} key={post.post_id} depth={0} />
						))}
					</div>
				</>
			)}
		</PageEl>
	)
}
const PageEl = styled.div`
	width: 100%;
	max-width: 1200px;
	padding: 0 50px;
	margin: 30px auto;
	.top {
		display: flex;
		font-size: 0.9rem;
		img {
			width: 35px;
			height: 35px;
		}
		.username {
			margin-left: 10px;
			margin-right: 15px;
		}
	}
	.body {
		margin: 15px 0;
	}
`
const PostEl = styled.div`
	margin: 15px 0;
	margin-left: ${({ depth }) => (depth ? depth + 15 : 0)}px;
	padding: 15px;
	border-left: 3px #b6b6b6 solid;
	border-radius: 4px;
	background-color: ${({ theme }) => theme.commentBg};
`
const ThreadEl = styled.div`
	img {
		width: 50px;
		height: 50px;
	}
`
const RenderPosts = ({ post, depth = 0 }) => (
	<PostEl key={post.post_id} depth={depth}>
		<div className="top">
			<img src={post.avatar} alt="" />
			<p className="username">{post.username}</p>
			<p>
				{formatDistanceStrict(new Date(post.created_at * 1000), new Date(), {
					addSuffix: true,
				})}
			</p>
		</div>
		<p className="body">{post.body}</p>

		{post?.children?.length
			? post.children.map(post => (
					<RenderPosts
						post={post}
						key={post.post_id}
						depth={Number(depth) + 1}
					/>
			  ))
			: null}
	</PostEl>
)

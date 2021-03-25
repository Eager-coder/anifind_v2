import { formatDistanceStrict } from "date-fns"
import { formatRelative } from "date-fns/esm"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import client from "../utlis/client"
export default function DiscussionListPage() {
	const [threads, setThreads] = useState({ isLoading: true, data: null })
	useEffect(() => {
		client("/discussions/all").then(res =>
			setThreads({ isLoading: false, data: res.data })
		)
	}, [])
	return (
		<PageEl>
			<h1>Discussions</h1>
			<p className="intro">
				Join open discussions about anime or open your own thread.
			</p>
			{!threads.isLoading
				? threads.data.map(thread => (
						<ThreadCard key={thread.thread_id}>
							<h2>
								<Link to={`/discussions/thread/${thread.thread_id}`}>
									{thread.topic}
								</Link>
							</h2>
							<p>{thread.body}</p>
							<p>{thread.username}</p>
							<p>
								{formatDistanceStrict(
									new Date(thread.created_at * 1000),
									new Date(),
									{ addSuffix: true }
								)}
							</p>
						</ThreadCard>
				  ))
				: "Loading..."}
		</PageEl>
	)
}

const PageEl = styled.div`
	max-width: 1200px;
	padding: 50px;
	margin: auto;
	h1 {
		font-size: 2.5rem;
	}
	p.intro {
		font-size: 1.2rem;
		margin-bottom: 20px;
	}
`
const ThreadCard = styled.div`
	background: ${({ theme }) => theme.commentBg};
	border-radius: 4px;
	padding: 20px;
	h2 a {
		font-size: 1.4rem;
		color: ${({ theme }) => theme.text};
	}
`

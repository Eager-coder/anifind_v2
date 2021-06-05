export const threadWithUserQuery = `
  SELECT
		EXISTS (
        SELECT 1 FROM discussions.thread_likes WHERE thread_likes.user_id = $2 
        AND thread_likes.thread_id = $1) AS is_liked,
		username,
		avatar,
		threads.user_id,
		threads.thread_id as thread_id,
		topic,
		body,
		is_edited,
		threads.created_at,
		is_deleted,
		COUNT(thread_likes) AS like_count
	FROM
			discussions.threads
	LEFT JOIN users.users 
		ON users.user_id = threads.user_id
	LEFT JOIN discussions.thread_likes 
		ON thread_likes.thread_id = threads.thread_id
	WHERE threads.thread_id = $1
	GROUP BY threads.thread_id, users.user_id`

export const threadWithoutUserQuery = `	
  SELECT
		threads.thread_id as thread_id,
		topic,
		body,
		is_edited,
		threads.created_at,
		threads.user_id,
		username,
		avatar,
		is_deleted,
		COUNT(thread_likes) AS like_count
	FROM
			discussions.threads
		LEFT JOIN users.users 
			ON users.user_id = threads.user_id
		LEFT JOIN discussions.thread_likes 
			ON thread_likes.thread_id = threads.thread_id
	WHERE threads.thread_id = $1
	GROUP BY threads.thread_id, users.user_id`

"use client";

import {
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from "@tanstack/react-query";
import { getPost, getComments } from "../services/api";
import { Post, Comment } from "../types";
import {
	CircularProgress,
	Typography,
	Card,
	CardContent,
	CardMedia,
	Avatar,
	Box,
	Divider,
	Button,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PostDetailProps = {
	postId: number;
};

export default function PostDetail({ postId }: PostDetailProps) {
	const queryClient = useQueryClient();
	const [fallbackToCache, setFallbackToCache] = useState(false);
	const router = useRouter();

	const cachedPost = useMemo(() => {
		return queryClient.getQueryData<Post>(["post", postId]);
	}, [queryClient, postId]);

	const queryOptions: UseQueryOptions<Post, Error, Post, (string | number)[]> =
		{
			queryKey: ["post", postId],
			queryFn: () => getPost(postId),
			staleTime: Infinity,
			retry: false,
		};

	const {
		data: post,
		isLoading: postLoading,
		error: postError,
	} = useQuery<Post, Error, Post, (string | number)[]>(queryOptions);

	const {
		data: comments,
		isLoading: commentsLoading,
		error: commentsError,
	} = useQuery<Comment[], Error>({
		queryKey: ["comments", postId],
		queryFn: () => getComments(postId),
		enabled: !!post || !!cachedPost,
	});

	const displayPost = postError && cachedPost ? cachedPost : post;

	if (postLoading) return <CircularProgress />;

	if (postError && !fallbackToCache) {
		console.error("Error fetching post:", postError);
		setFallbackToCache(true);
	}

	if (!displayPost) {
		return <Typography variant="h6">Post not found</Typography>;
	}

	const imageUrl = `https://via.assets.so/furniture.png?id=${displayPost.id}&q=95&w=360&h=360&fit=fill`;

	return (
		<Card sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
			<Button onClick={() => router.back()} sx={{ mt: 2 }}>
				Back
			</Button>
			<CardMedia
				component="img"
				height="300"
				image={imageUrl}
				alt="Furniture"
				sx={{ objectFit: "contain" }}
			/>
			<CardContent>
				<Typography variant="h4" component="h1" gutterBottom>
					{displayPost.title}
				</Typography>
				<Typography variant="body1" paragraph>
					{displayPost.body}
				</Typography>
				{fallbackToCache && (
					<Typography color="warning.main">
						Displaying cached data. Unable to fetch latest from server.
					</Typography>
				)}
				<Divider sx={{ my: 3 }} />
				<Typography variant="h5" component="h2" gutterBottom>
					Comments
				</Typography>
				{commentsLoading ? (
					<CircularProgress />
				) : commentsError ? (
					<Typography color="error">Error loading comments</Typography>
				) : (
					comments?.map((comment) => (
						<Box key={comment.id} sx={{ mb: 2 }}>
							<Box display="flex" alignItems="center" mb={1}>
								<Avatar sx={{ mr: 2 }}>{comment.name[0]}</Avatar>
								<Box>
									<Typography variant="subtitle1">{comment.name}</Typography>
									<Typography variant="subtitle2" color="text.secondary">
										{comment.email}
									</Typography>
								</Box>
							</Box>
							<Typography variant="body2">{comment.body}</Typography>
							<Divider sx={{ mt: 2 }} />
						</Box>
					))
				)}
			</CardContent>
		</Card>
	);
}

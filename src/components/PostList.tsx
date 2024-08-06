"use client";

import { useQuery } from "@tanstack/react-query";
import { getPosts, getPostsCount } from "../services/api";
import { Post } from "../types";
import {
	List,
	ListItem,
	ListItemText,
	Pagination,
	Box,
	CircularProgress,
	Alert,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export default function PostList() {
	const [page, setPage] = useState(1);
	const limit = 20;

	const {
		data: posts,
		isLoading: postsLoading,
		error: postsError,
	} = useQuery<Post[], Error, Post[], [string, number, number]>({
		queryKey: ["posts", page, limit],
		queryFn: getPosts,
	});

	const {
		data: totalPosts,
		isLoading: countLoading,
		error: countError,
	} = useQuery<number, Error>({
		queryKey: ["postsCount"],
		queryFn: getPostsCount,
	});

	if (postsLoading || countLoading) return <CircularProgress />;
	if (postsError || countError)
		return <Alert severity="error">An error occurred</Alert>;

	const totalPages = Math.ceil((totalPosts ?? 0) / limit);

	return (
		<Box>
			<List>
				{posts?.map((post: Post) => (
					<ListItem key={post.id} component={Link} href={`/posts/${post.id}`}>
						<ListItemText
							primary={post.title}
							secondary={post.body.substring(0, 200) + "..."}
						/>
					</ListItem>
				))}
			</List>
			<Pagination
				count={totalPages}
				page={page}
				onChange={(_, value) => setPage(value)}
			/>
		</Box>
	);
}

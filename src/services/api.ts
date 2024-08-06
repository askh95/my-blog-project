import axios from "axios";
import { Post, Comment } from "../types";
import { QueryFunction } from "@tanstack/react-query";

const api = axios.create({
	baseURL: "https://jsonplaceholder.typicode.com",
});

export const getPosts: QueryFunction<
	Post[],
	[string, number, number]
> = async ({ queryKey }) => {
	const [_, page, limit] = queryKey;
	const response = await api.get<Post[]>(`/posts`, {
		params: { _page: page, _limit: limit },
	});
	return response.data;
};

export const getPostsCount = async (): Promise<number> => {
	const response = await api.get<Post[]>("/posts");
	return response.data.length;
};

export const getPost = async (id: number): Promise<Post> => {
	const response = await api.get<Post>(`/posts/${id}`);
	return response.data;
};

export const getComments = async (postId: number): Promise<Comment[]> => {
	const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
	return response.data;
};

export const createPost = async (postData: Omit<Post, "id">): Promise<Post> => {
	const response = await api.post<Post>("/posts", postData);
	return response.data;
};

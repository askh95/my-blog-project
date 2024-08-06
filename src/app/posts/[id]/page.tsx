import { getPost, getComments } from "../../../services/api";
import dynamic from "next/dynamic";
const PostDetail = dynamic(() => import("../../../components/PostDetail"));
import {
	HydrationBoundary,
	dehydrate,
	QueryClient,
} from "@tanstack/react-query";

export default async function PostPage({ params }: { params: { id: string } }) {
	const postId = parseInt(params.id);
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["post", postId],
		queryFn: () => getPost(postId),
	});

	await queryClient.prefetchQuery({
		queryKey: ["comments", postId],
		queryFn: () => getComments(postId),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PostDetail postId={postId} />
		</HydrationBoundary>
	);
}

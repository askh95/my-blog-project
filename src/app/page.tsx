import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import { Typography, Box } from "@mui/material";

export default function Home() {
	return (
		<Box sx={{ mt: 4 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Latest Posts
			</Typography>
			<PostList />
			<Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
				Create New Post
			</Typography>
			<PostForm />
		</Box>
	);
}

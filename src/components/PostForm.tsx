"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../services/api";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { Post } from "../types";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
	title: Yup.string().required("Title is required"),
	body: Yup.string().required("Body is required"),
});

export default function PostForm() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: (newPost: Omit<Post, "id">) => createPost(newPost),
		onSuccess: (newPost) => {
			queryClient.setQueryData<Post[]>(["posts"], (oldData) => {
				return oldData ? [newPost, ...oldData] : [newPost];
			});

			queryClient.setQueryData(["post", newPost.id], newPost);

			queryClient.invalidateQueries({ queryKey: ["posts"] });

			// Переходим на страницу нового поста
			router.push(`/posts/${newPost.id}`);
		},
		onError: (error) => {
			console.error("Error creating post", error);
		},
	});

	const handleSubmit = (
		values: { title: string; body: string },
		{ resetForm }: { resetForm: () => void }
	) => {
		mutation.mutate({ ...values, userId: 1 });
		resetForm();
	};

	return (
		<Formik
			initialValues={{ title: "", body: "" }}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
		>
			{({ errors, touched, isSubmitting }) => (
				<Form>
					<Box sx={{ mt: 2 }}>
						<Field
							as={TextField}
							fullWidth
							name="title"
							label="Title"
							error={touched.title && errors.title}
							helperText={touched.title && errors.title}
							margin="normal"
							disabled={mutation.isPending}
						/>
						<Field
							as={TextField}
							fullWidth
							name="body"
							label="Body"
							multiline
							rows={4}
							error={touched.body && errors.body}
							helperText={touched.body && errors.body}
							margin="normal"
							disabled={mutation.isPending}
						/>
						<Button
							type="submit"
							variant="contained"
							sx={{ mt: 2 }}
							disabled={mutation.isPending}
							startIcon={
								mutation.isPending ? <CircularProgress size={20} /> : null
							}
						>
							{mutation.isPending ? "Creating..." : "Create Post"}
						</Button>
					</Box>
				</Form>
			)}
		</Formik>
	);
}

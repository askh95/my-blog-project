import { Providers } from "./providers";
import {
	AppBar,
	Toolbar,
	Typography,
	Container,
	CssBaseline,
	ThemeProvider,
	createTheme,
} from "@mui/material";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<CssBaseline />
					<AppBar position="static">
						<Toolbar>
							<Typography variant="h6">My Blog</Typography>
						</Toolbar>
					</AppBar>
					<Container>{children}</Container>
				</Providers>
			</body>
		</html>
	);
}

import React from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import AppContent from "./AppContent";

export default function App() {
	const theme = createTheme({
		palette: {
			mode: "dark",
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						scrollbarColor: "#6b6b6b #ff0000",
						"&::-webkit-scrollbar, & *::-webkit-scrollbar": {
							backgroundColor: "#00000000",
						},
						"&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
							borderRadius: 8,
							backgroundColor: "#6b6b6b",
							minHeight: 46,
							border: "3px solid #2b2b2b",
						},
						"&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
							backgroundColor: "#959595",
						},
						"&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
							backgroundColor: "#959595",
						},
						"&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
							backgroundColor: "#959595",
						},
						"&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
							backgroundColor: "#00000000",
						},
					},
				},
			},
		},
	});

	return (
		<>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppContent />
			</ThemeProvider>
		</>
	);
}

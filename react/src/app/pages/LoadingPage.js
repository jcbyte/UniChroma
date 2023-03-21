import React from "react";

import { CircularProgress, Typography } from "@mui/material";

export default function LoadingPage() {
	return (
		<>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
				}}
			>
				<CircularProgress sx={{ marginBottom: "10px" }} />
				<Typography variant="body1">Loading page</Typography>
			</div>
		</>
	);
}

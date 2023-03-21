import React from "react";

import { Typography } from "@mui/material";

export default function LedIcon({ size, col, glow }) {
	return (
		<>
			<div
				style={{
					height: size,
					width: size,
					backgroundColor: col,
					borderRadius: "50%",
					boxShadow: "0 0 " + glow + " " + col,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Typography variant="caption">{col}</Typography>
			</div>
		</>
	);
}

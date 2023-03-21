import React, { useState, useEffect } from "react";

import { Typography, IconButton, Grid } from "@mui/material";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";

export default function HomePage({ handlePageChange }) {
	const [iconSize, setIconSize] = useState(200);

	function getIconSize() {
		var newIconSize = Math.min((window.innerWidth - 40) / 2, (window.innerHeight - 420) / 2, 400 / 2);
		setIconSize(newIconSize);
	}

	useEffect(() => {
		getIconSize();
		window.addEventListener("resize", getIconSize);
	}, []);

	return (
		<>
			<div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
				<Typography component="h1" variant="h1" sx={{ margin: "50px", fontSize: iconSize / 2.4 }}>
					Uni
					<div class="rainbowText" style={{ display: "inline" }}>
						Chroma
					</div>
				</Typography>

				<Grid container sx={{ alignItems: "center" }}>
					{[
						{ name: "select", iconComponent: HighlightAltIcon, title: "Select LEDs" },
						{ name: "colour", iconComponent: ColorLensIcon, title: "Colour" },
						{ name: "save", iconComponent: SaveIcon, title: "Saves" },
						{ name: "settings", iconComponent: SettingsIcon, title: "Settings" },
					].map((e, index) => (
						<Grid item xs={6}>
							<div
								style={{
									float: index % 2 == 0 ? "right" : "left",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}
							>
								<IconButton
									onClick={() => {
										handlePageChange([e.name]);
									}}
									sx={{ width: iconSize }}
								>
									<e.iconComponent sx={{ fontSize: iconSize }} />
								</IconButton>
								<div style={{ fontSize: iconSize / 6 }}>{e.title}</div>
							</div>
						</Grid>
					))}
				</Grid>
			</div>
		</>
	);
}

import React, { Suspense } from "react";

import { Card } from "@mui/material";

export default function PageCard({ first, pageHeight, element, loadingElement }) {
	return (
		<>
			<Card
				sx={{
					position: "relative",
					margin: "10px",
					marginLeft: first ? "10px" : 0,
					width: "100%",
					height: pageHeight - 20,
				}}
			>
				<Suspense fallback={loadingElement}>{element}</Suspense>
			</Card>
		</>
	);
}

import React, { useEffect, useState } from "react";

import PageCard from "./PageCard";

export default function PageManager({ openPages, pageMap, homePage, loadingElement }) {
	const [pageHeight, setPageHeight] = useState(800);

	function getPageHeight() {
		var appBarHeight = document.getElementById("appBar").getBoundingClientRect().height;
		var ledCanvasHeight = document.getElementById("displayedLedCanvas").getBoundingClientRect().height;

		setPageHeight(window.innerHeight - appBarHeight - ledCanvasHeight);
	}

	useEffect(() => {
		getPageHeight();
		addEventListener("resize", getPageHeight);
	}, []);

	return (
		<>
			<div style={{ display: "flex", width: "100%", height: "100%" }}>
				{openPages.length > 0 ? (
					openPages.map((e, index) => (
						<PageCard pageHeight={pageHeight} element={pageMap[e]} first={index == 0} loadingElement={loadingElement} />
					))
				) : (
					<PageCard pageHeight={pageHeight} element={homePage} first loadingElement={loadingElement} />
				)}
			</div>
		</>
	);
}

import React, { useEffect } from "react";

export default function VLedBar({ barHeight, ledNum, vLedHardware }) {
	useEffect(() => {
		addEventListener("resize", () => {
			var displayedLedCanvas = document.getElementById("displayedLedCanvas");
			var displayedLedCanvasCtx = displayedLedCanvas.getContext("2d");
			var currentCWScale = displayedLedCanvas.cwscale;

			var newCWScale = displayedLedCanvas.width / ledNum;
			displayedLedCanvasCtx.scale(newCWScale / currentCWScale, displayedLedCanvas.height / 1);
			displayedLedCanvas.cwscale = newCWScale;

			displayedLedCanvas.width = window.innerWidth;
		});
	}, []);

	useEffect(() => {
		var imageData = new ImageData(ledNum, 1);
		var data = imageData.data;

		for (var i = 0; i < ledNum; i++) {
			data[i * 4] = vLedHardware[i][0];
			data[i * 4 + 1] = vLedHardware[i][1];
			data[i * 4 + 2] = vLedHardware[i][2];
			data[i * 4 + 3] = 255;
		}

		var singleLedCanvas = document.getElementById("singleLedCanvas");
		var singleLedCanvasCtx = singleLedCanvas.getContext("2d");
		singleLedCanvasCtx.putImageData(imageData, 0, 0);

		var displayedLedCanvas = document.getElementById("displayedLedCanvas");
		var displayedLedCanvasCtx = displayedLedCanvas.getContext("2d");

		var imageObject = new Image();
		imageObject.onload = () => {
			displayedLedCanvasCtx.clearRect(0, 0, displayedLedCanvas.width, displayedLedCanvas.height);
			displayedLedCanvasCtx.drawImage(imageObject, 0, 0, displayedLedCanvas.width, displayedLedCanvas.height);
		};
		imageObject.src = singleLedCanvas.toDataURL();
	}, [vLedHardware]);

	return (
		<>
			<canvas id="singleLedCanvas" width={ledNum} height="1px" hidden />
			<canvas
				id="displayedLedCanvas"
				width={window.innerWidth}
				height={barHeight}
				cwscale={1}
				style={{ display: "block" }}
			/>
		</>
	);
}

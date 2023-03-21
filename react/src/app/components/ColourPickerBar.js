import React, { useEffect, useState } from "react";

import { Slider, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { ColorPicker } from "material-ui-color";

import { rgbToHex, colorLerp } from "../tools/ColorTools";
import {
	useStateForceEffect,
	useStateWithPromiseLazy as useStatePromiseLazy,
	useStateWithPromiseLazyForceEffect as useStatePromiseLazyForce,
} from "../tools/ReactTools";

export default function ColourPickerBar({ colPos, setColPos, maxPos, loop, forceResize_FLAG }) {
	const [barData, setBarData] = useStatePromiseLazy(getInitialBarDataReturn());

	const [canvasWidth, setCanvasWidth] = useStateForceEffect(800);
	const [lastSelected, setLastSelected] = useState(0);

	const [wereUpdatingColPos_FLAG, setWereUpdatingColPos_FLAG] = useStatePromiseLazyForce(false);

	function getInitialBarDataReturn() {
		return colPos.length > 1
			? colPos.map((e) => ({ pos: (e.pos / maxPos) * 100, left: 0, col: e.col }))
			: [
					{ pos: 0, left: 0, col: colPos.length > 0 ? colPos[0].col : [0, 0, 0] },
					{ pos: 100, left: 0, col: colPos.length > 0 ? colPos[0].col : [0, 0, 0] },
			  ];
	}

	useEffect(() => {
		if (!wereUpdatingColPos_FLAG.value) {
			setBarData(getInitialBarDataReturn()).then(() => {
				resizeEvent();
				//updateAllColourPickerLeft();
			});
		}
	}, [colPos]);

	const LowSliderStyle = {
		height: 0,
		"& .MuiSlider-track": {
			border: "none",
		},
		"& .MuiSlider-thumb": {
			height: "20px",
			width: "10px",
			borderRadius: "4px",
			backgroundColor: "#fff",
			"&:focus, &:hover, &.Mui-active": {
				backgroundColor: "#ddd",
				"@media (hover: none)": {
					backgroundColor: "#fff",
				},
			},
		},
	};

	function handlePosChange(index, newValue) {
		setLastSelected(index);

		if ((index == 0) | (index == barData.length - 1)) return;

		var newBarData = [...barData];
		newBarData[index].pos = newValue;

		var width = getBarWidth();
		newBarData[index].left = (barData[index].pos / 100) * width;

		setBarData(newBarData);
	}

	function handleColourChange(index, newValue) {
		setLastSelected(index);

		var newBarData = [...barData];

		if (loop & ((index == 0) | (index == barData.length - 1))) {
			newBarData[0].col = newValue;
			newBarData[barData.length - 1].col = newValue;
		} else {
			newBarData[index].col = newValue;
		}

		setBarData(newBarData);
	}

	function handleAddPos() {
		var newBarData = [...barData];

		var topBarIndex = barData.length - 1;

		var newPos = (barData[topBarIndex - 1].pos + barData[topBarIndex].pos) / 2;
		var width = getBarWidth();
		var newLeft = (newPos / 100) * width;

		newBarData.splice(topBarIndex, 0, { pos: newPos, left: newLeft, col: [0, 0, 0] });

		setBarData(newBarData);

		setLastSelected(topBarIndex);
	}

	function handleRemovePos() {
		if ((lastSelected == 0) | (lastSelected == barData.length - 1)) return;

		var newBarData = [...barData];
		newBarData.splice(lastSelected, 1);
		setBarData(newBarData);
	}

	function updateAllColourPickerLeft() {
		var width = getBarWidth();

		var newBarData = [...barData];
		for (var i = 0; i < barData.length; i++) {
			newBarData[i].left = (barData[i].pos / 100) * width;
		}

		setBarData(newBarData);
	}

	function updateCanvas() {
		var canvas = document.getElementById("colourBarCanvas");
		var ctx = canvas.getContext("2d");

		var width = canvas.width;

		var imageData = new ImageData(width, canvas.height);
		var data = imageData.data;

		var colorLerps = [...Array(width)].fill([0, 0, 0]);
		var currentCol = 0;
		for (var i = 0; i < width; i++) {
			try {
				var currentPos = (i / width) * 100;
				if (barData[currentCol + 1].pos < currentPos) currentCol++;
				var d = (currentPos - barData[currentCol].pos) / (barData[currentCol + 1].pos - barData[currentCol].pos);
				colorLerps[i] = colorLerp(barData[currentCol].col, barData[currentCol + 1].col, d);
			} catch {}
		}

		for (var i = 0; i < width * canvas.height; i++) {
			data[i * 4] = colorLerps[i % width][0];
			data[i * 4 + 1] = colorLerps[i % width][1];
			data[i * 4 + 2] = colorLerps[i % width][2];
			data[i * 4 + 3] = 255;
		}

		ctx.putImageData(imageData, 0, 0);
	}

	function exportColPos() {
		var posModifier = maxPos ? maxPos / 100 : 1;
		setWereUpdatingColPos_FLAG(true).then(() => {
			setColPos(barData.map((e) => ({ pos: e.pos * posModifier, col: e.col }))).then(() => {
				setWereUpdatingColPos_FLAG(false);
			});
		});
	}

	useEffect(() => {
		exportColPos();
		updateCanvas();
	}, [barData]);

	useEffect(() => {
		exportColPos();
	}, [maxPos]);

	function getBarWidth() {
		var colourBarDiv = document.getElementById("colourBarDiv");
		return colourBarDiv ? colourBarDiv.getBoundingClientRect().width : null;
	}

	function resizeEvent() {
		setCanvasWidth(getBarWidth());
	}

	useEffect(() => {
		resizeEvent();
		window.addEventListener("resize", resizeEvent);
	}, []);

	useEffect(() => {
		resizeEvent();
	}, [forceResize_FLAG]);

	useEffect(() => {
		updateCanvas();
		updateAllColourPickerLeft();
	}, [canvasWidth]);

	return (
		<>
			<div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
				<div
					id="colourBarDiv"
					style={{
						margin: "10px",
						marginRight: "20px",
						width: "100%",
						minWidth: 0,
						height: "24px",
						position: "relative",
					}}
				>
					<Slider
						sx={LowSliderStyle}
						style={{ width: "100%", position: "absolute", zIndex: 1 }}
						value={barData.map((e) => e.pos)}
						onChange={(e, newValue, index) => {
							handlePosChange(index, newValue[index]);
						}}
						valueLabelDisplay="auto"
						min={0}
						max={100}
						step={0.1}
					/>
					<canvas
						id="colourBarCanvas"
						style={{ position: "relative", zIndex: 0 }}
						width={canvasWidth.value}
						height="24px"
					/>
					{barData.map((e, index) => (
						<div style={{ position: "absolute", top: "28px", left: e.left - 18 }}>
							<ColorPicker
								disableAlpha
								hideTextfield
								value={rgbToHex(e.col)}
								onChange={(e) => {
									handleColourChange(index, e.rgb);
								}}
							/>
						</div>
					))}
				</div>

				<IconButton onClick={handleAddPos}>
					<AddIcon />
				</IconButton>
				<IconButton onClick={handleRemovePos}>
					<DeleteIcon />
				</IconButton>
			</div>
		</>
	);
}

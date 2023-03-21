import React, { useEffect } from "react";

import { Typography, Checkbox, ButtonGroup, Button, Slider, Input } from "@mui/material";

import { List, AutoSizer } from "react-virtualized";

import LedIcon from "../components/LedIcon";
import { rgbToHex } from "../tools/ColorTools";

const vLedSize = 50;

export default function LedSelectPage({
	ledNum,
	vLedHardware,
	ledSelected,
	setLedSelected,
	ledSliderVal,
	setLedSliderVal,
	ledListScroll,
	setLedListScroll,
	useRgb,
}) {
	function handleLedClicked(i) {
		var newLedSelected = [...ledSelected];
		newLedSelected[i] = !ledSelected[i];
		setLedSelected(newLedSelected);
	}

	function handleSelectAllSet(val) {
		setLedSelected(Array(ledNum).fill(val));
	}

	function handleSliderSelectSet(val) {
		var newLedSelected = [...ledSelected];

		var sliderLow = ledSliderVal[0] - 1;
		var sliderHigh = ledSliderVal[1];

		var amt = sliderHigh - sliderLow;
		newLedSelected.splice(sliderLow, amt, ...Array(amt).fill(val));
		setLedSelected(newLedSelected);
	}

	function handleSelectSliderVal(high, value) {
		var newLedSliderVal = [...ledSliderVal];
		newLedSliderVal[high ? 1 : 0] = value;
		setLedSliderVal(newLedSliderVal);
	}

	useEffect(() => {
		var selectLedList = document.getElementById("selectLedList");

		function waitForInitialised(func, pollRate) {
			if (selectLedList.clientHeight > 0) {
				func();
			} else
				setTimeout(() => {
					waitForInitialised(func, pollRate);
				}, pollRate);
		}
		waitForInitialised(() => {
			selectLedList.scrollTo(0, ledListScroll);
		}, 10);

		selectLedList.addEventListener("scroll", () => {
			setLedListScroll(selectLedList.scrollTop);
		});
	}, []);

	return (
		<>
			<div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
				<div style={{ flex: "0 1 auto", margin: "10px" }}>
					<ButtonGroup variant="outlined" fullWidth>
						<Button
							onClick={() => {
								handleSelectAllSet(true);
							}}
						>
							Select All
						</Button>
						<Button
							onClick={() => {
								handleSelectAllSet(false);
							}}
						>
							Deselect ALl
						</Button>
					</ButtonGroup>
				</div>

				<div style={{ flex: "1 1 auto", display: "contents" }}>
					<div style={{ height: "100%", width: "100%" }}>
						<AutoSizer>
							{({ height, width }) => (
								<List
									id="selectLedList"
									width={width}
									height={height}
									rowHeight={vLedSize + 20}
									rowRenderer={({ index, style }) => {
										return (
											<div
												style={{
													...style,
													display: "flex",
													alignItems: "center",
													backgroundColor: ledSelected[index] ? "#22b2" : "#0000",
												}}
											>
												<div style={{ flex: 1, order: 1 }}>
													<div style={{ display: "flex", justifyContent: "center" }}>
														<Typography variant="subtitle1">{index + 1}</Typography>
													</div>
												</div>

												<div style={{ flex: 1, order: 2 }}>
													<div style={{ display: "flex", justifyContent: "center" }}>
														<LedIcon
															col={
																useRgb ? "rgb(" + vLedHardware[index].join(",") + ")" : rgbToHex(vLedHardware[index])
															}
															size={vLedSize}
															glow="10px"
														/>
													</div>
												</div>

												<div style={{ flex: 1, order: 3 }}>
													<div style={{ display: "flex", justifyContent: "center" }}>
														<Checkbox
															checked={ledSelected[index]}
															onChange={() => {
																handleLedClicked(index);
															}}
														/>
													</div>
												</div>
											</div>
										);
									}}
									rowCount={ledNum}
								/>
							)}
						</AutoSizer>
					</div>
				</div>

				<div style={{ flex: "0 1 auto", margin: "10px" }}>
					<ButtonGroup variant="outlined" fullWidth>
						<Button
							onClick={() => {
								handleSliderSelectSet(true);
							}}
						>
							Select
						</Button>
						<Button
							onClick={() => {
								handleSliderSelectSet(false);
							}}
						>
							Deselect
						</Button>
					</ButtonGroup>
					<div style={{ margin: "10px 10px 0 10px" }}>
						<Slider
							value={ledSliderVal}
							onChange={(e, newValue) => {
								setLedSliderVal(newValue);
							}}
							valueLabelDisplay="auto"
							min={1}
							max={ledNum}
						/>
					</div>
					<div style={{ display: "flex" }}>
						<Input
							value={ledSliderVal[0]}
							size="small"
							onChange={(e) => {
								handleSelectSliderVal(false, e.target.value);
							}}
							inputProps={{
								step: 10,
								min: 1,
								max: ledSliderVal[1],
								type: "number",
							}}
							sx={{ margin: "0 10px 0 10px" }}
							fullWidth
						/>
						<Input
							value={ledSliderVal[1]}
							size="small"
							onChange={(e) => {
								handleSelectSliderVal(true, e.target.value);
							}}
							inputProps={{
								step: 10,
								min: ledSliderVal[0],
								max: ledNum,
								type: "number",
							}}
							sx={{ margin: "0 10px 0 10px" }}
							fullWidth
						/>
					</div>
				</div>
			</div>
		</>
	);
}

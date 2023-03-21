import React, { useState, useEffect } from "react";

import {
	ToggleButtonGroup,
	ToggleButton,
	Typography,
	FormControlLabel,
	Checkbox,
	Slider,
	Input,
	Switch,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FlareIcon from "@mui/icons-material/Flare";
import LoopIcon from "@mui/icons-material/Loop";
import WavesIcon from "@mui/icons-material/Waves";

import { ColorPicker } from "material-ui-color";

import ColourPickerBar from "../components/ColourPickerBar";
import { rgbToHex } from "../tools/ColorTools";
import { useStateWithPromiseLazy as useStatePromiseLazy } from "../tools/ReactTools";
import { RESPONSE } from "../tools/ResponseCodes";

export default function SelectColourPage({
	ledNum,
	selectedColPos,
	setSelectedColPos,
	cycleTime,
	setCycleTime,
	colourMode,
	setColourMode,
	ledSelected,
	smartSave,
	setSmartSave,
	openPages,
	showAlert,
	savingServerColour_FLAG,
	setSavingServerColour_FLAG,
}) {
	const [ledSelectedNum, setLedSelectedNum] = useState(0);

	const [ledEnabled, setLedEnabled] = useState(false);
	const [waveSpread, setWaveSpread] = useState(20);
	const [waveWidth, setWaveWidth] = useState(1);
	const [flipWave, setFlipWave] = useState(false);

	const [saving_FLAG, setSaving_FLAG] = useStatePromiseLazy(false);
	const [colourPickerBarResizeEvent_FLAG, setColourPickerBarResizeEvent_FLAG] = useState(0);

	function getSmartState() {
		var selectedObjs = [];
		ledSelected.forEach((e, index) => {
			if (e) {
				var thisObj = smartSave.data[index];
				if (!selectedObjs.includes(thisObj)) selectedObjs.push(thisObj);
			}
		});
		if (selectedObjs.length == 1) {
			var selectedObj = smartSave.objects[selectedObjs[0]];
			switch (selectedObj.type) {
				case "disabled":
					setLedEnabled(false);
					break;
				case "enabled":
					setLedEnabled(true);
					break;
				case "static":
					setLedEnabled(true);
					setColourMode("static");
					setSelectedColPos([{ pos: 0, col: selectedObj.col }]);
					break;
				case "cycle":
					setLedEnabled(true);
					setColourMode("cycle");
					setCycleTime(selectedObj.cycleTime);
					setSelectedColPos(selectedObj.colPos);
					break;
				case "wave":
					setLedEnabled(true);
					setColourMode("wave");
					setCycleTime(selectedObj.cycleTime);
					setSelectedColPos(selectedObj.colPos);
					setWaveWidth(selectedObj.width);
					setFlipWave(selectedObj.flip);
					break;
			}
		} else if (selectedObjs.length > 1) {
			var enabled = false;
			var disabled = false;
			ledSelected.forEach((e, index) => {
				if (e) {
					if (smartSave.objects[smartSave.data[index]].type == "disabled") disabled = true;
					else enabled = true;
				}
			});
			setLedEnabled(enabled & disabled ? null : enabled ? true : false);
		}
	}

	function getLedSelectedNum() {
		setLedSelectedNum(ledSelected.filter((e) => e).length);
	}

	useEffect(() => {
		getLedSelectedNum();
		getSmartState();
	}, [ledSelected]);

	function handleEnableLeds(newValue) {
		var newSmartSave = { ...smartSave };

		var newObjKey = newSmartSave.objects.push({ type: newValue ? "enabled" : "disabled" }) - 1;

		ledSelected.forEach((e, index) => {
			if (e) {
				if (newValue) {
					if (smartSave.objects[smartSave.data[index]].type == "disabled") newSmartSave.data[index] = newObjKey;
				} else {
					newSmartSave.data[index] = newObjKey;
				}
			}
		});

		setSmartSave(newSmartSave);
		setLedEnabled(newValue);
	}

	function getSmartSaveReturn() {
		var newSmartSave = { ...smartSave };
		var newObj = { type: "disabled" };

		switch (colourMode) {
			case "static":
				newObj = { type: "static", col: selectedColPos[0].col };
				break;

			case "cycle":
				newObj = { type: "cycle", cycleTime: cycleTime, colPos: selectedColPos };
				break;

			case "wave":
				newObj = { type: "wave", cycleTime: cycleTime, colPos: selectedColPos, spread: waveSpread, flip: flipWave };
				break;
		}

		var newObjKey = newSmartSave.objects.push(newObj) - 1;
		ledSelected.forEach((e, index) => {
			if (e) newSmartSave.data[index] = newObjKey;
		});

		return newSmartSave;
	}

	function handleSave(real) {
		setLedEnabled(true);
		setSmartSave(getSmartSaveReturn()).then(() => {
			if (real) {
				setSaving_FLAG(true).then(() => {
					setSavingServerColour_FLAG({ do: true, result: null });
				});
			} else showAlert("Saved to virtual", "success");
		});
	}

	useEffect(() => {
		if (saving_FLAG) {
			if (savingServerColour_FLAG.result != null) {
				setSaving_FLAG(false);
				if (savingServerColour_FLAG.result == RESPONSE.OK) {
					showAlert("Saved", "success");
					return;
				} else if (savingServerColour_FLAG.result == RESPONSE.NOT_FOUND) {
					showAlert("Cannot connect to Server", "error");
					return;
				}
				showAlert("Unknown error", "error");
			}
		}
	}, [savingServerColour_FLAG]);

	useEffect(() => {
		setColourPickerBarResizeEvent_FLAG((prev) => ++prev);
	}, [openPages]);

	function handleWaveSpreadChange(newValue) {
		setWaveSpread(newValue);
		setWaveWidth(((newValue * ledNum) / cycleTime).toFixed(2));
	}

	function handleWaveWidthChange(newValue) {
		setWaveSpread(((newValue * cycleTime) / ledNum).toFixed(0));
		setWaveWidth(newValue);
	}

	useEffect(() => {
		handleWaveWidthChange(waveWidth);
	}, [cycleTime]);

	var renderModeMap = {
		static: (
			<>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<ColorPicker
						style={{ borderRadius: "10px" }}
						disableAlpha
						value={rgbToHex(selectedColPos[0].col)}
						onChange={(e) => {
							setSelectedColPos([{ pos: 0, col: e.rgb }]);
						}}
						hideTextfield
					/>
				</div>
			</>
		),

		cycle: (
			<>
				<ColourPickerBar
					colPos={selectedColPos}
					setColPos={setSelectedColPos}
					maxPos={cycleTime}
					loop
					forceResize_FLAG={colourPickerBarResizeEvent_FLAG}
				/>

				<div style={{ margin: "10px" }}>
					<Typography variant="body1" noWrap gutterBottom>
						Cycle Time
					</Typography>
					<div style={{ display: "flex", gap: "20px", width: "100%", marginBottom: "10px" }}>
						<Slider
							value={cycleTime}
							onChange={(e, newValue) => {
								setCycleTime(newValue);
							}}
							valueLabelDisplay="auto"
							min={10}
							max={10000}
						/>

						<Input
							value={cycleTime}
							onChange={(e) => {
								setCycleTime(e.target.value);
							}}
							inputProps={{
								min: 10,
								type: "number",
							}}
						/>

						<Typography>ms</Typography>
					</div>
				</div>
			</>
		),

		wave: (
			<>
				<ColourPickerBar
					colPos={selectedColPos}
					setColPos={setSelectedColPos}
					maxPos={cycleTime}
					loop
					forceResize_FLAG={colourPickerBarResizeEvent_FLAG}
				/>

				<div style={{ margin: "10px" }}>
					<Typography variant="body1" noWrap gutterBottom>
						Cycle Time
					</Typography>
					<div style={{ display: "flex", gap: "20px", width: "100%", marginBottom: "10px" }}>
						<Slider
							value={cycleTime}
							onChange={(e, newValue) => {
								setCycleTime(newValue);
							}}
							valueLabelDisplay="auto"
							min={10}
							max={10000}
						/>

						<Input
							value={cycleTime}
							onChange={(e) => {
								setCycleTime(e.target.value);
							}}
							inputProps={{
								min: 10,
								type: "number",
							}}
						/>

						<Typography>ms</Typography>
					</div>

					<Typography variant="body1" noWrap gutterBottom>
						Wave Spread
					</Typography>
					<div style={{ display: "flex", gap: "20px", width: "100%", marginBottom: "10px" }}>
						<Slider
							value={waveSpread}
							onChange={(e, newValue) => {
								handleWaveSpreadChange(newValue);
							}}
							valueLabelDisplay="auto"
							min={1}
							max={100}
						/>

						<Input
							value={waveSpread}
							onChange={(e) => {
								handleWaveSpreadChange(e.target.value);
							}}
							inputProps={{
								min: 1,
								type: "number",
							}}
						/>

						<Typography>ms</Typography>
					</div>

					<div style={{ marginBottom: "10px" }}>
						<Typography variant="body1" noWrap gutterBottom>
							Width
						</Typography>
						<Input
							value={waveWidth}
							onChange={(e) => {
								handleWaveWidthChange(e.target.value);
							}}
							inputProps={{
								min: 1,
								type: "number",
							}}
						/>
					</div>

					<div>
						<Typography variant="body1" noWrap gutterBottom>
							Flip direction
						</Typography>
						<Switch
							value={flipWave}
							onClick={() => {
								setFlipWave(!flipWave);
							}}
						/>
					</div>
				</div>
			</>
		),
	};

	return (
		<>
			<div style={{ display: "flex", alignItems: "center", margin: "10px" }}>
				<Typography variant="body2">Selected {ledSelectedNum} LEDs</Typography>
				<FormControlLabel
					sx={{ marginLeft: "auto" }}
					label="Enable"
					labelPlacement="start"
					control={
						<Checkbox
							checked={ledEnabled}
							indeterminate={ledEnabled == null}
							onChange={(e, newValue) => {
								handleEnableLeds(newValue);
							}}
						/>
					}
				/>
			</div>

			<div style={{ margin: "10px" }}>
				<ToggleButtonGroup
					value={colourMode}
					exclusive
					onChange={(e, newMode) => {
						if (newMode) setColourMode(newMode);
					}}
					fullWidth
				>
					<ToggleButton value="static">
						<FlareIcon sx={{ marginRight: "10px" }} />
						<Typography variant="body1">Static</Typography>
					</ToggleButton>
					<ToggleButton value="cycle">
						<LoopIcon sx={{ marginRight: "10px" }} />
						<Typography variant="body1">Cycle</Typography>
					</ToggleButton>
					<ToggleButton value="wave">
						<WavesIcon sx={{ marginRight: "10px" }} />
						<Typography variant="body1">Wave</Typography>
					</ToggleButton>
				</ToggleButtonGroup>

				<div style={{ margin: "10px" }}>{renderModeMap[colourMode]}</div>

				<div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
					<LoadingButton
						variant="contained"
						loading={saving_FLAG}
						fullWidth
						onClick={() => {
							handleSave(false);
						}}
						sx={{ maxWidth: "200px" }}
					>
						Save to virtual
					</LoadingButton>
					<LoadingButton
						variant="contained"
						loading={saving_FLAG}
						fullWidth
						onClick={() => {
							handleSave(true);
						}}
						sx={{ maxWidth: "200px" }}
					>
						Save
					</LoadingButton>
				</div>
			</div>
		</>
	);
}

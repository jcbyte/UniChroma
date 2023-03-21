import React, { useState, useEffect } from "react";

import { Typography, Button, Slider, Input, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { detectLedServer } from "../api/APIHandler";
import { WaitForSyncCalls } from "../tools/AsyncTools";
import { useStateWithPromiseLazy as useStatePromiseLazy } from "../tools/ReactTools";
import { RESPONSE } from "../tools/ResponseCodes";

export default function SettingsPage({
	apiServer,
	setApiServer,
	updateInterval,
	setUpdateInterval,
	vUpdateInterval,
	setVUpdateInterval,
	useRgb,
	setUseRgb,
	showAlert,
	saveLocalStorageSettings_FLAG,
	setSaveLocalStorageSettings_FLAG,
	saveServerSettings_FLAG,
	setSaveServerSettings_FLAG,
	refreshServerData,
}) {
	const [apiServerTmp, setApiServerTmp] = useState(apiServer);
	const [updateIntervalTmp, setUpdateIntervalTmp] = useState(updateInterval);
	const [vUpdateIntervalTmp, setVUpdateIntervalTmp] = useState(vUpdateInterval);
	const [useRgbTmp, setUseRgbTmp] = useState(useRgb);

	const [detectingApiServer_FLAG, setDetectingApiServer_FLAG] = useStatePromiseLazy(false);
	const [saving_FLAG, setSaving_FLAG] = useStatePromiseLazy(false);

	function handleUpdateIntervalChange(newValue) {
		setUpdateIntervalTmp(newValue);
	}

	function handleVUpdateInterval(newValue) {
		setVUpdateIntervalTmp(newValue);
	}

	function setApiServerAndRefresh(newApiServer) {
		setApiServer(newApiServer).then(() => {
			refreshServerData();
			setSaving_FLAG(true).then(() => {
				setSaveLocalStorageSettings_FLAG({ do: true, result: null });
				setSaveServerSettings_FLAG({ do: false, result: RESPONSE.OK });
			});
		});
	}

	function handleSave() {
		if (apiServer != apiServerTmp) {
			setApiServerAndRefresh(apiServerTmp);
		} else {
			WaitForSyncCalls([
				{ func: setUpdateInterval, params: [updateIntervalTmp] },
				{ func: setVUpdateInterval, params: [vUpdateIntervalTmp] },
				{ func: setUseRgb, params: [useRgbTmp] },
				{ func: setSaving_FLAG, params: [true] },
			]).then(() => {
				setSaveLocalStorageSettings_FLAG({ do: true, result: null });
				setSaveServerSettings_FLAG({ do: true, result: null });
			});
		}
	}

	useEffect(() => {
		if (saving_FLAG) {
			if ((saveLocalStorageSettings_FLAG.result != null) & (saveServerSettings_FLAG.result != null)) {
				setSaving_FLAG(false);
				if ((saveLocalStorageSettings_FLAG.result == RESPONSE.OK) & (saveServerSettings_FLAG.result == RESPONSE.OK)) {
					showAlert("Saved", "success");
					return;
				} else if (saveLocalStorageSettings_FLAG.result == RESPONSE.ERROR_SAVING) {
					showAlert("Cannot save to localstorage", "error");
					return;
				} else if (saveServerSettings_FLAG.result == RESPONSE.NOT_FOUND) {
					showAlert("Cannot connect to Server", "error");
					return;
				}
				showAlert("Unknown error", "error");
			}
		}
	}, [saveLocalStorageSettings_FLAG, saveServerSettings_FLAG]);

	function detectApiServer() {
		setDetectingApiServer_FLAG(true).then(() =>
			detectLedServer(window.location.hostname).then((server) => {
				setDetectingApiServer_FLAG(false);
				if (server) {
					if (server != apiServerTmp) {
						setApiServerAndRefresh(server);
					}
					showAlert("API Server found", "success");
				} else {
					showAlert("No API Server found", "error");
				}
			})
		);
	}

	useEffect(() => {
		setApiServerTmp(apiServer);
	}, [apiServer]);

	useEffect(() => {
		setUpdateIntervalTmp(updateInterval);
	}, [updateInterval]);

	useEffect(() => {
		setVUpdateIntervalTmp(vUpdateInterval);
	}, [vUpdateInterval]);

	useEffect(() => {
		setUseRgbTmp(useRgb);
	}, [useRgb]);

	return (
		<>
			<div style={{ margin: "auto", width: "60%", marginTop: "100px" }}>
				<div style={{ marginBottom: "20px" }}>
					<Typography variant="body1" noWrap gutterBottom>
						API Server
					</Typography>
					<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
						<TextField
							value={apiServerTmp}
							onChange={(e) => {
								setApiServerTmp(e.target.value);
							}}
							placeholder={window.location.hostname}
							disabled={detectingApiServer_FLAG}
							fullWidth
						/>

						<LoadingButton onClick={detectApiServer} loading={detectingApiServer_FLAG} variant="contained">
							Detect
						</LoadingButton>
					</div>
				</div>

				<div style={{ marginBottom: "80px" }}>
					<Typography variant="body1" noWrap gutterBottom>
						Update Interval
					</Typography>
					<div style={{ display: "flex", gap: "20px", width: "100%", marginBottom: "10px" }}>
						<Slider
							value={updateIntervalTmp}
							onChange={(e, newValue) => {
								handleUpdateIntervalChange(newValue);
							}}
							valueLabelDisplay="auto"
							min={10}
							max={1000}
						/>

						<Input
							value={updateIntervalTmp}
							onChange={(e) => {
								handleUpdateIntervalChange(e.target.value);
							}}
							inputProps={{
								min: 10,
								max: 1000,
								type: "number",
							}}
						/>

						<Typography>ms</Typography>
					</div>

					<div style={{ marginBottom: "10px" }}>
						<Typography variant="body1" noWrap gutterBottom>
							Virtual Update Interval
						</Typography>
						<div style={{ display: "flex", gap: "20px", width: "100%", marginBottom: "10px" }}>
							<Slider
								value={vUpdateIntervalTmp}
								onChange={(e, newValue) => {
									handleVUpdateInterval(newValue);
								}}
								valueLabelDisplay="auto"
								min={10}
								max={1000}
							/>

							<Input
								value={vUpdateIntervalTmp}
								onChange={(e) => {
									handleVUpdateInterval(e.target.value);
								}}
								inputProps={{
									min: 10,
									max: 1000,
									type: "number",
								}}
							/>

							<Typography>ms</Typography>
						</div>

						<div style={{ float: "right" }}>
							<Button
								variant="outlined"
								onClick={() => {
									handleVUpdateInterval(updateIntervalTmp);
								}}
							>
								Copy to virtual
							</Button>
						</div>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						height: "100%",
						width: "100%",
					}}
				>
					<div style={{ marginBottom: "40px" }}>
						<div>
							<Typography variant="body">Using </Typography>
							<Button
								onClick={() => {
									setUseRgbTmp(!useRgbTmp);
								}}
							>
								{useRgbTmp ? "RGB" : "HEX"}
							</Button>
						</div>
					</div>

					<div style={{ width: "50%" }}>
						<LoadingButton variant="contained" loading={saving_FLAG} fullWidth onClick={handleSave}>
							Save
						</LoadingButton>
					</div>
				</div>
			</div>
		</>
	);
}

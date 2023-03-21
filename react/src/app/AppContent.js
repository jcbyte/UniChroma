import React, { lazy, useState, useEffect, useRef } from "react";

import {
	AppBar,
	Switch,
	Typography,
	Toolbar,
	ToggleButton,
	ToggleButtonGroup,
	IconButton,
	Backdrop,
	CircularProgress,
	Collapse,
	Alert,
} from "@mui/material";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import RefreshIcon from "@mui/icons-material/Refresh";

import LedVirtualizer from "./components/LedVirtualizer";
import PageManager from "./components/PageManager";
import ServerColourManager from "./components/ServerColourManager";
import SettingsManager from "./components/SettingsManager";
import VLedBar from "./components/VLedBar";
import HomePage from "./pages/HomePage";
import LoadingPage from "./pages/LoadingPage";
const LedSelectPage = lazy(() => import("./pages/LedSelectPage")); //import LedSelectPage from "./pages/LedSelectPage";
const SelectColourPage = lazy(() => import("./pages/SelectColourPage")); //import SelectColourPage from "./pages/SelectColourPage";
const SavePage = lazy(() => import("./pages/SavePage")); //import SavePage from "./pages/SavePage";
const SettingsPage = lazy(() => import("./pages/SettingsPage")); //import SettingsPage from "./pages/SettingsPage";
import {
	useStateWithPromiseLazyForceEffect as useStatePromiseLazyForce,
	useStateWithPromiseLazy as useStatePromiseLazy,
} from "./tools/ReactTools";
import { RESPONSE } from "./tools/ResponseCodes";
import { cleanSmartSave } from "./tools/SmartSaveCleaner";

const ledNum = 400;

const minPageWidth = 400;
const alertTimeout = 2000;

export default function AppContent() {
	// AppContent Varibles
	const [openPages, setOpenPages] = useState([]);
	const [alertData, setAlertData] = useState({ open: false, text: "", severity: "success" });
	const alertTimeoutRef = useRef(null);

	// Flags
	const [loading_FLAG, setLoading_FLAG] = useStatePromiseLazy(true);
	const [loadLocalStorageSettings_FLAG, setLoadLocalStorageSettings_FLAG] = useState({ do: true, result: null });
	const [saveLocalStorageSettings_FLAG, setSaveLocalStorageSettings_FLAG] = useState({ do: false, result: null });
	const [loadServerSettings_FLAG, setLoadServerSettings_FLAG] = useState({ do: true, result: null });
	const [saveServerSettings_FLAG, setSaveServerSettings_FLAG] = useState({ do: false, result: null });
	const [savingServerColour_FLAG, setSavingServerColour_FLAG] = useState({ do: false, response: null });

	// Settings
	const [apiServer, setApiServer] = useStatePromiseLazyForce(
		window.localStorage.getItem("apiServer") ?? window.location.hostname
	);
	const [device, setDevice] = useStatePromiseLazyForce(false);
	const [enabled, setEnabled] = useStatePromiseLazyForce(false);
	const [updateInterval, setUpdateInterval] = useStatePromiseLazyForce(100);
	const [vUpdateInterval, setVUpdateInterval] = useStatePromiseLazyForce(100);
	const [useRgb, setUseRgb] = useStatePromiseLazyForce(true);

	// LedSelected Varibles
	const [ledSelected, setLedSelected] = useState(Array(ledNum).fill(false));
	const [ledSliderVal, setLedSliderVal] = useState([1, ledNum]);
	const [ledListScroll, setLedListScroll] = useState(0);

	// SelectColour Varibles
	const [selectedColPos, setSelectedColPos] = useStatePromiseLazy([{ pos: 0, col: [0, 0, 0] }]);
	const [cycleTime, setCycleTime] = useState(8000);
	const [colourMode, setColourMode] = useState("static");

	// Led Data
	const [smartSave, setSmartSaveRaw] = useStatePromiseLazy({
		objects: [{ type: "disabled" }],
		data: [...Array(ledNum)].fill(0),
	});
	const [vLedHardware, setVLedHardware] = useState([...Array(ledNum)].fill([0, 0, 0]));

	function handlePageChange(newOpenPages) {
		if (window.innerWidth < newOpenPages.length * minPageWidth) newOpenPages.splice(-2, 1);

		setOpenPages(newOpenPages);
	}

	function showAlert(text, severity) {
		setAlertData({ open: true, text: text, severity: severity });

		clearTimeout(alertTimeoutRef.current);
		alertTimeoutRef.current = setTimeout(() => {
			var newAlertData = { ...alertData, open: false };
			setAlertData(newAlertData);
		}, alertTimeout);
	}

	function refreshServerData() {
		setLoading_FLAG(true).then(() => {
			setLoadServerSettings_FLAG({ do: true, result: null });
		});
	}

	useEffect(() => {
		if (loading_FLAG) {
			if ((loadLocalStorageSettings_FLAG.result != null) & (loadServerSettings_FLAG.result != null)) {
				setLoading_FLAG(false);
				if ((loadLocalStorageSettings_FLAG.result == RESPONSE.OK) & (loadServerSettings_FLAG.result == RESPONSE.OK)) {
					//showAlert("Loaded", "success");
					return;
				} else if (loadLocalStorageSettings_FLAG.result == RESPONSE.ERROR_LOADING) {
					showAlert("Cannot load from localstorage", "error");
					return;
				} else if (loadServerSettings_FLAG.result == RESPONSE.NOT_FOUND) {
					showAlert("Cannot connect to Server", "error");
					return;
				}
				showAlert("Unknown error", "error");
			}
		}
	}, [loadLocalStorageSettings_FLAG, loadServerSettings_FLAG]);

	function setSmartSave(newSmartSave) {
		return setSmartSaveRaw(cleanSmartSave(newSmartSave));
	}

	return (
		<>
			<LedVirtualizer
				enabled={enabled.value}
				ledNum={ledNum}
				vUpdateInterval={updateInterval.value}
				smartSave={smartSave}
				setLedVHardware={setVLedHardware}
			/>
			<SettingsManager
				apiServer={apiServer}
				setApiServer={setApiServer}
				device={device}
				setDevice={setDevice}
				enabled={enabled}
				setEnabled={setEnabled}
				updateInterval={updateInterval}
				setUpdateInterval={setUpdateInterval}
				vUpdateInterval={vUpdateInterval}
				setVUpdateInterval={setVUpdateInterval}
				useRgb={useRgb}
				setUseRgb={setUseRgb}
				setSmartSave={setSmartSave}
				loadLocalStorageSettings_FLAG={loadLocalStorageSettings_FLAG}
				setLoadLocalStorageSettings_FLAG={setLoadLocalStorageSettings_FLAG}
				saveLocalStorageSettings_FLAG={saveLocalStorageSettings_FLAG}
				setSaveLocalStorageSettings_FLAG={setSaveLocalStorageSettings_FLAG}
				loadServerSettings_FLAG={loadServerSettings_FLAG}
				setLoadServerSettings_FLAG={setLoadServerSettings_FLAG}
				saveServerSettings_FLAG={saveServerSettings_FLAG}
				setSaveServerSettings_FLAG={setSaveServerSettings_FLAG}
			/>
			<ServerColourManager
				apiServer={apiServer.value}
				smartSave={smartSave}
				savingServerColour_FLAG={savingServerColour_FLAG}
				setSavingServerColour_FLAG={setSavingServerColour_FLAG}
			/>

			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: 1,
				}}
			>
				<Collapse in={alertData.open}>
					<Alert severity={alertData.severity}>{alertData.text}</Alert>
				</Collapse>
			</div>

			<AppBar id="appBar" position="static" sx={{ margin: 0 }}>
				<Toolbar>
					<IconButton
						sx={{ color: enabled.value ? "#fff" : "#666" }}
						onClick={() => {
							setEnabled(!enabled.value).then(() => {
								setSaveServerSettings_FLAG({ do: true, result: null });
							});
						}}
					>
						<PowerSettingsNewIcon />
					</IconButton>
					<Switch
						onClick={() => {
							setDevice(!device.value).then(() => {
								setSaveServerSettings_FLAG({ do: true, result: null });
							});
						}}
						checked={device.value}
					/>
					<Typography component="h6" variant="h6" sx={{ flexGrow: 1 }} noWrap>
						{device.value ? "My Control" : "PC Control"}
					</Typography>

					<IconButton sx={{ margin: "0 5px 0 5px" }} onClick={refreshServerData}>
						<RefreshIcon />
					</IconButton>

					<ToggleButtonGroup
						value={openPages}
						onChange={(e, newOpenPages) => {
							handlePageChange(newOpenPages);
						}}
					>
						<ToggleButton value="select">
							<HighlightAltIcon />
						</ToggleButton>
						<ToggleButton value="colour">
							<ColorLensIcon />
						</ToggleButton>
						<ToggleButton value="save">
							<SaveIcon />
						</ToggleButton>
						<ToggleButton value="settings">
							<SettingsIcon />
						</ToggleButton>
					</ToggleButtonGroup>
				</Toolbar>
			</AppBar>

			<VLedBar barHeight={6} ledNum={ledNum} vLedHardware={vLedHardware} />

			<PageManager
				openPages={openPages}
				pageMap={{
					select: (
						<LedSelectPage
							ledNum={ledNum}
							vLedHardware={vLedHardware}
							ledSelected={ledSelected}
							setLedSelected={setLedSelected}
							ledSliderVal={ledSliderVal}
							setLedSliderVal={setLedSliderVal}
							ledListScroll={ledListScroll}
							setLedListScroll={setLedListScroll}
							useRgb={useRgb.value}
						/>
					),

					colour: (
						<SelectColourPage
							ledNum={ledNum}
							selectedColPos={selectedColPos}
							setSelectedColPos={setSelectedColPos}
							cycleTime={cycleTime}
							setCycleTime={setCycleTime}
							colourMode={colourMode}
							setColourMode={setColourMode}
							ledSelected={ledSelected}
							smartSave={smartSave}
							setSmartSave={setSmartSave}
							openPages={openPages}
							showAlert={showAlert}
							savingServerColour_FLAG={savingServerColour_FLAG}
							setSavingServerColour_FLAG={setSavingServerColour_FLAG}
						/>
					),

					settings: (
						<SettingsPage
							apiServer={apiServer.value}
							setApiServer={setApiServer}
							updateInterval={updateInterval.value}
							setUpdateInterval={setUpdateInterval}
							vUpdateInterval={vUpdateInterval.value}
							setVUpdateInterval={setVUpdateInterval}
							useRgb={useRgb.value}
							setUseRgb={setUseRgb}
							showAlert={showAlert}
							saveLocalStorageSettings_FLAG={saveLocalStorageSettings_FLAG}
							setSaveLocalStorageSettings_FLAG={setSaveLocalStorageSettings_FLAG}
							saveServerSettings_FLAG={saveServerSettings_FLAG}
							setSaveServerSettings_FLAG={setSaveServerSettings_FLAG}
							refreshServerData={refreshServerData}
						/>
					),
					save: (
						<SavePage
							smartSave={smartSave}
							setSmartSave={setSmartSave}
							apiServer={apiServer.value}
							showAlert={showAlert}
							loadServerSettings_FLAG={loadServerSettings_FLAG}
						/>
					),
				}}
				homePage={<HomePage handlePageChange={handlePageChange} />}
				loadingElement={<LoadingPage />}
			/>

			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading_FLAG}>
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<CircularProgress sx={{ marginBottom: "10px" }} />
					<Typography variant="body1">Getting data</Typography>
				</div>
			</Backdrop>
		</>
	);
}

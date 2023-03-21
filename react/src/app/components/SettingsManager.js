import React, { useEffect } from "react";

import { apiGetOptions, apiSetOptions, apiGetSave } from "../api/APIHandler";
import { RESPONSE } from "../tools/ResponseCodes";

export default function SettingsManager({
	apiServer,
	setApiServer,
	device,
	setDevice,
	enabled,
	setEnabled,
	updateInterval,
	setUpdateInterval,
	vUpdateInterval,
	setVUpdateInterval,
	useRgb,
	setUseRgb,
	setSmartSave,
	loadLocalStorageSettings_FLAG,
	setLoadLocalStorageSettings_FLAG,
	saveLocalStorageSettings_FLAG,
	setSaveLocalStorageSettings_FLAG,
	loadServerSettings_FLAG,
	setLoadServerSettings_FLAG,
	saveServerSettings_FLAG,
	setSaveServerSettings_FLAG,
}) {
	useEffect(() => {
		if (loadLocalStorageSettings_FLAG.do) {
			async function asyncFunc() {
				var ls = window.localStorage;

				//var savedApiServer = ls.getItem("apiServer"); // Loads initially - saving handled in settings page
				//if (savedApiServer) await setApiServer(savedApiServer);
				var savedVUpdateInterval = ls.getItem("vUpdateInterval");
				if (savedVUpdateInterval) await setVUpdateInterval(JSON.parse(savedVUpdateInterval));
				var savedUseRgb = ls.getItem("useRgb");
				if (savedUseRgb) await setUseRgb(JSON.parse(savedUseRgb));

				setLoadLocalStorageSettings_FLAG({ do: false, result: RESPONSE.OK });
			}
			asyncFunc();
		}
	}, [loadLocalStorageSettings_FLAG]);

	useEffect(() => {
		if (saveLocalStorageSettings_FLAG.do) {
			var ls = window.localStorage;

			ls.setItem("apiServer", apiServer.value);
			ls.setItem("vUpdateInterval", JSON.stringify(vUpdateInterval.value));
			ls.setItem("useRgb", JSON.stringify(useRgb.value));

			setSaveLocalStorageSettings_FLAG({ do: false, result: RESPONSE.OK });
		}
	}, [saveLocalStorageSettings_FLAG]);

	useEffect(() => {
		if (loadServerSettings_FLAG.do) {
			async function asyncFunc() {
				var result = await apiGetOptions(apiServer.value)
					.then(async (options) => {
						await setDevice(options.device);
						await setEnabled(options.enabled);
						await setUpdateInterval(options.updateInterval);

						return await apiGetSave(apiServer.value, true)
							.then((data) => {
								setSmartSave(data);
								return RESPONSE.OK;
							})
							.catch(() => {
								return RESPONSE.NOT_FOUND;
							});
					})
					.catch(() => {
						return RESPONSE.NOT_FOUND;
					});

				setLoadServerSettings_FLAG({ do: false, result: result });
			}
			asyncFunc();
		}
	}, [loadServerSettings_FLAG]);

	useEffect(() => {
		if (saveServerSettings_FLAG.do) {
			async function asyncFunc() {
				var result = await apiSetOptions(apiServer.value, {
					device: device.value,
					enabled: enabled.value,
					updateInterval: updateInterval.value,
				})
					.then(() => {
						return RESPONSE.OK;
					})
					.catch(() => {
						return RESPONSE.NOT_FOUND;
					});

				setSaveServerSettings_FLAG({ do: false, result: result });
			}
			asyncFunc();
		}
	}, [saveServerSettings_FLAG]);

	return <></>;
}

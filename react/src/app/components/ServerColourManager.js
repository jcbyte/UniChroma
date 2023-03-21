import React, { useEffect } from "react";

import { apiSendSmartSave } from "../api/APIHandler";
import { RESPONSE } from "../tools/ResponseCodes";

export default function ServerColourManager({
	apiServer,
	smartSave,
	savingServerColour_FLAG,
	setSavingServerColour_FLAG,
}) {
	useEffect(() => {
		if (savingServerColour_FLAG.do) {
			apiSendSmartSave(apiServer, smartSave)
				.then(() => {
					setSavingServerColour_FLAG({ do: false, result: RESPONSE.OK });
				})
				.catch(() => {
					setSavingServerColour_FLAG({ do: false, result: RESPONSE.NOT_FOUND });
				});
		}
	}, [savingServerColour_FLAG]);

	return <></>;
}

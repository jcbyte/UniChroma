import React, { useRef, useEffect } from "react";

import { colorLerp } from "../tools/ColorTools";

export default function LedVirtualizer({ enabled, ledNum, vUpdateInterval, smartSave, setLedVHardware }) {
	const timeRef = useRef(0);
	const timeLoopRef = useRef(null);

	function timeLoop() {
		setColours();
		timeRef.current += vUpdateInterval;
	}

	// useEffect(() => {
	// 	timeLoopRef.current = setInterval(timeLoop, vUpdateInterval);
	// 	return () => {
	// 		clearTimeout(timeLoopRef.current);
	// 	};
	// }, []);

	useEffect(() => {
		clearTimeout(timeLoopRef.current);
		if (enabled) timeLoopRef.current = setInterval(timeLoop, vUpdateInterval);
		else setLedVHardware([...Array(ledNum)].fill([0, 0, 0]));
	}, [enabled, smartSave, vUpdateInterval]);

	function getCurrentColour(time, colourPositions, cycleTime) {
		var thisTime = time % cycleTime;

		var higherColPos = 1;
		while (colourPositions[higherColPos].pos <= thisTime) higherColPos++;

		var lower = colourPositions[higherColPos - 1];
		var higher = colourPositions[higherColPos];

		var relativeTime = thisTime - lower.pos;
		var relativeTimeMax = higher.pos - lower.pos;
		var d = relativeTime / relativeTimeMax;

		return colorLerp(lower.col, higher.col, d);
	}

	function getColour(object) {
		var objectData = { colour: [128, 0, 128], diy: false, type: object.type, diyData: null };

		switch (object.type) {
			case "disabled":
				objectData.colour = [0, 0, 0];
				break;

			case "enabled":
				objectData.colour = [50, 50, 50];
				break;

			case "static":
				objectData.colour = object.col;
				break;

			case "cycle":
				objectData.colour = getCurrentColour(timeRef.current, object.colPos, object.cycleTime);
				break;

			case "wave":
				objectData.diy = true;

				objectData.diyData = {
					cycleTime: object.cycleTime,
					colPos: object.colPos,
					spread: object.spread,
					flip: object.flip ? 1 : -1,
				};

				break;
		}

		return objectData;
	}

	function setColours() {
		var objectColours = smartSave.objects.map(getColour);

		var newLedVHardware = Array(ledNum);
		for (var i = 0; i < ledNum; i++) {
			var thisLedData = objectColours[smartSave.data[i]];
			var thisLedColour = thisLedData.colour;

			if (thisLedData.diy) {
				switch (thisLedData.type) {
					case "wave":
						thisLedColour = getCurrentColour(
							timeRef.current + thisLedData.diyData.spread * i * thisLedData.diyData.flip,
							thisLedData.diyData.colPos,
							thisLedData.diyData.cycleTime
						);
						break;
				}
			}

			newLedVHardware[i] = thisLedColour;
		}

		setLedVHardware(newLedVHardware);
	}
}

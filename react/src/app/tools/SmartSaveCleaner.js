export function cleanSmartSave(smartSave) {
	// Find duplicate objects
	var dupeMapping = {};
	for (var i = 0; i < smartSave.objects.length; i++)
		for (var j = i + 1; j < smartSave.objects.length; j++)
			if (JSON.stringify(smartSave.objects[i]) == JSON.stringify(smartSave.objects[j]))
				if (i in dupeMapping) dupeMapping[j] = dupeMapping[i];
				else dupeMapping[j] = i;

	// Set data of further down duplicates to original
	for (var i = 0; i < smartSave.data.length; i++) {
		var usedObj = smartSave.data[i];
		if (usedObj in dupeMapping) smartSave.data[i] = dupeMapping[usedObj];
	}

	// Find any objects which arent used
	var unusedObjects = [...Array(smartSave.objects.length)].map((e, index) => index);
	for (var i = 0; i < smartSave.data.length; i++) {
		var usedObj = smartSave.data[i];
		if (unusedObjects.includes(usedObj)) unusedObjects.splice(unusedObjects.indexOf(usedObj), 1);
	}

	// Remove unused object
	for (var i = unusedObjects.length - 1; i >= 0; i--) {
		var unusedObj = unusedObjects[i];
		smartSave.objects.splice(unusedObj, 1);
		for (var j = 0; j < smartSave.data.length; j++) {
			var usedObj = smartSave.data[j];
			if (usedObj > unusedObj) smartSave.data[j] = usedObj - 1;
		}
	}

	for (var i = 0; i < smartSave.objects.length; i++) {
		var curObj = smartSave.objects[i];
		if (curObj.colPos) {
			smartSave.objects[i].colPos = curObj.colPos.map((e) => ({ pos: Math.round(e.pos), col: e.col }));
		}
	}

	return smartSave;
}

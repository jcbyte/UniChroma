const serverTimeout = 2000;

async function fetchWithTimeout(resource, timeout, options) {
	const abortController = new AbortController();
	const abortTimeout = setTimeout(() => abortController.abort(), timeout);
	const response = await fetch(resource, {
		...options,
		signal: abortController.signal,
	});
	clearTimeout(abortTimeout);
	return response;
}

export function apiSendSmartSave(apiServer, smartSave) {
	return fetchWithTimeout("http://" + apiServer + "/api/setSmartSave", 2000, {
		method: "POST",
		headers: { "Content-Type": "text/json" },
		body: JSON.stringify(smartSave),
	});
}

export function apiGetOptions(apiServer) {
	return fetchWithTimeout("http://" + apiServer + "/api/getOptions", serverTimeout, { method: "GET" }).then((res) =>
		res.json()
	);
}

export function apiSetOptions(apiServer, options) {
	return fetchWithTimeout("http://" + apiServer + "/api/setOptions", serverTimeout, {
		method: "POST",
		headers: { "Content-Type": "text/json" },
		body: JSON.stringify(options),
	});
}

export async function apiGetSaves(apiServer) {
	return fetchWithTimeout("http://" + apiServer + "/api/getSaves", 2000, { method: "GET" }).then((res) => res.json());
}

export function apiGetSave(apiServer, current, name) {
	var options = current ? "current" : "name=" + name;
	return fetchWithTimeout("http://" + apiServer + "/api/getSave?" + options, 2000, { method: "GET" }).then((res) =>
		res.json()
	);
}

export function apiGetSetSave(apiServer, name) {
	var options = "name=" + name;
	return fetchWithTimeout("http://" + apiServer + "/api/getSetSave?" + options, 2000, { method: "GET" }).then((res) =>
		res.json()
	);
}

export function apiCreateSave(apiServer, name, smartSave) {
	var options = "name=" + name;
	return fetchWithTimeout("http://" + apiServer + "/api/createSave?" + options, 2000, {
		method: "POST",
		headers: { "Content-Type": "text/plain" },
		body: JSON.stringify(smartSave),
	});
}

export function apiRenameSave(apiServer, name, newName) {
	var options = "name=" + name + "&" + "newName=" + newName;
	return fetchWithTimeout("http://" + apiServer + "/api/renameSave?" + options, 2000, { method: "PATCH" });
}

export function apiDeleteSave(apiServer, name) {
	var options = "name=" + name;
	return fetchWithTimeout("http://" + apiServer + "/api/deleteSave?" + options, 2000, { method: "DELETE" });
}

export async function detectLedServer(myHostname) {
	const responseTimeout = 64;

	function addIp([ip0, ip1, ip2, ip3]) {
		if (ip3 >= 255) {
			return false;
		}

		ip3++;
		return [ip0, ip1, ip2, ip3];
	}

	function checkIp(ip) {
		if (!ip) return false;

		var hostname = ip.join(".");

		return fetchWithTimeout("http://" + hostname + "/ledServerSearch", responseTimeout, { method: "GET" })
			.then((res) => {
				if (res.ok)
					return res.text().then((data) => {
						if (data == "leds ready") return hostname;
						else return checkIp(addIp(ip));
					});
				else return checkIp(addIp(ip));
			})
			.catch(() => {
				return checkIp(addIp(ip));
			});
	}

	return fetchWithTimeout("http://" + myHostname + "/ledServerSearch", responseTimeout, { method: "GET" })
		.then((res) => {
			if (res.ok) {
				return myHostname;
			}
		})
		.catch(() => {
			var ip = myHostname.split(".");
			ip[3] = 140;
			return checkIp(ip);
		});
}

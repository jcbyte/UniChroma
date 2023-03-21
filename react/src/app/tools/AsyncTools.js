export function WaitForSyncCalls(calls) {
	return new Promise((resolve, reject) => {
		var completedCalls = 0;
		calls.forEach((e) => {
			e.func(...e.params)
				.then(() => {
					completedCalls++;
					if (completedCalls >= calls.length) {
						resolve();
					}
				})
				.catch(reject);
		});
	});
}

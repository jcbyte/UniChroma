function lerp(a, b, d) {
	return Math.round(a + (b - a) * d);
}

export function colorLerp([r0, g0, b0], [r1, g1, b1], d) {
	return [lerp(r0, r1, d), lerp(g0, g1, d), lerp(b0, b1, d)];
}

export function rgbToHex([r, g, b]) {
	return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

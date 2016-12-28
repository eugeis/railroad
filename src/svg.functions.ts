/**
 * Returns the cursor-position relative to the top-left corner of the svg
 * (to be precisely: it return the current cursor-position in svg-space, BUT
 * because we're (only) moving the svg-elements (and not the svg-viewport) this
 * resolves to the relative cursor position)
 */
export function cursorPoint(svg: SVGLocatable, pt: SVGPoint, evt: MouseEvent): [number, number]{
	let point: SVGPoint;
	pt.x = evt.clientX;
	pt.y = evt.clientY;
	point = pt.matrixTransform(svg.getScreenCTM().inverse());
	return [point.x, point.y];
}

/**
 * frame(v, min, max):
 * v      (min <= v <= max)
 * min    (v < min)
 * max    (v > max)
 */
export function frame(value: number, min: number, max: number) {
	return Math.max(Math.min(value, max), min);
}

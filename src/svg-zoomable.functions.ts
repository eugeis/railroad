/*
 * Copyright Siemens AG, 2016
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 * @author Jonas Möller
 */

/**
 * To understand the following you need to understand the concept of the
 * svg's panning and zooming.
 *
 * The component distinguishes between the svg- and the browser-space. These
 * spaces can be be mapped bidirectional to each other. Svg-space uses the
 * coordinate system established by the svg (e.g. <rect x="100" y="100" ... >
 * creates a rectangle at 100/100 - this does *not* mean, that the rectangle,
 * will be displayed at 100/100 to the user). The user sees everything from the
 * svg-space projected to the browser-space.
 *
 * It's very important to note, that when the user navigates through the svg,
 * the svg's viewport is *not* moving. Rather, the user moves the elements in
 * the svg.
 *
 * Let p_svg be a point in svg_space and p_browser a point in browser-space.
 * Further, let z be the (numeric) zoomlevel (e.g. 2 indicating a zoom of 200%)
 * and t be the translate-vector (e.g -150/-100 indicating a shift of 150 to the right
 * and 100 down):
 *
 * p_browser = p_svg * z - t
 *
 * If the user zoomes to 200% (z = 2) and moves the graphic by 100/100 (translate =
 * [-140,-150]), a point at 100/100 will be displayed at 340/350:
 *
 * [100,100] * 2 - [-140,-150] = [340,350]
 */

/**
 * Calculates the new translate after zooming
 *
 * The zooming works like the zooming in Google Maps. If you want to zoom into a
 * city, you place your cursor above it and zoom in (e.g. by using the mouse-wheel).
 * To generalise, if you place your cursor above a point, you want your mouse
 * to stay during zooming.
 *
 * Because the cursor-position is provided in the browser-space, we need to map
 * it into the svg space (see explanation above):
 *
 *     p_browser = p_svg * z - t
 * <=> p_svg = (p_browser - t) / z
 *
 * let c be the cursor-position when zooming, t_o the current translate, z_o the former
 * zoomlevel, z_n the new zoomlevel.
 *
 *     (c - t_o) / z_o = (c - t_n) / z_n
 * <=> ((c - t_o) / z_o) * z_n = c - t_n
 * <=> t_n = c - ((c - t_o) / z_o) * z_n     // f = z_n / z_o
 * <=> t_n = c - f * (c - t_o)
 *
 *     t_n = f(c, z_o, z_n, t_o) = calcTranslateOnZoom(c, z_o, z_n, t_o);
 */
export function calcTranslateOnZoom(cursorPos: [number, number], translate: [number, number], factor: number): [number, number] {
	return [
		cursorPos[0] - factor * (cursorPos[0] - translate[0]),
		cursorPos[1] - factor * (cursorPos[1] - translate[1])
	];
}

/**
 * Calculates the new translate after panning
 *
 * The panning works similar to zooming: The point (e.g a city) the cursor has
 * been on at pan-start is supposed to be the point the cursor is on at pan-end.
 *
 * Because the translate is not affected by the zoomlevel,
 * a simple addition is sufficient
 */
export function calcTranslateOnPan(translate: [number, number], movement: [number, number]): [number, number] {
	return [translate[0] + movement[0], translate[1] + movement[1]]
}

/**
 * Transforms the delta movement by the mousewheel to a number between 0.8 and 1.2
 */
export function getFactor(delta: number): number {
	return (1 + (frame(-delta / 265, -1, 1) / 5));
}

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

export function applyZoomConstraints(zoom: number, svgSize: [number, number], border: [[number,number],[number,number]]): number {
	zoom = frame(zoom, svgSize[0] / (border[1][0] - border[0][0]), zoom);
	zoom = frame(zoom, svgSize[1] / (border[1][1] - border[0][1]), zoom);
	return zoom;
}

export function applyTranslateConstraints(translate: [number, number], zoom: number, svgSize: [number, number], border: [[number,number],[number,number]]): [number, number] {
	return [
		applyTranslateConstraint(translate[0], zoom, svgSize[0], [border[0][0], border[1][0]]),
		applyTranslateConstraint(translate[1], zoom, svgSize[1], [border[0][1], border[1][1]])
	];
}

export function applyTranslateConstraint(translate: number, zoom: number, svgSize: number, border: [number,number]): number {
	return frame(translate, svgSize - border[1] * zoom, -border[0] * zoom);
}

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
 * Returns the mouse-position in SVG-space
 */
export function cursorPoint(svg: SVGLocatable, pt: SVGPoint, evt: MouseEvent): [number, number]{
	let point: SVGPoint;
	pt.x = evt.clientX;
	pt.y = evt.clientY;
	point = pt.matrixTransform(svg.getScreenCTM().inverse());
	return [point.x, point.y];
}

export function frame(value: number, min: number, max: number) {
	return Math.max(Math.min(value, max), min);
}

export function zoom(mousePos: [number, number],
		offset: [number, number],
		factor: number): [number, number] {
	return [
		(mousePos[0] - offset[0]) - ((mousePos[0] - offset[0]) / factor) + offset[0],
		(mousePos[1] - offset[1]) - ((mousePos[1] - offset[1]) / factor) + offset[1]
	];
}

export function pan(movement: [number, number], zoom: number, offset: [number, number]): [number, number] {
	return [offset[0] + movement[0] / zoom, offset[1] + movement[1] / zoom];
}

export function getZoomFactor(delta: number) {
	return (1 + (frame(-delta / 265, -1, 1) / 5));
}

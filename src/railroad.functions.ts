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
 * The applications switches between two spaces:
 * - the SVG-space, which uses the internal dimensionless quantity of the svg
 * - the browser-space, which is the rendered representation of the svg (in px)
 *
 * To switch between both, one has to apply the translation and zoom. Let "t" be
 * the translation of the svg and "z" the zoom. A point (p_svg) in the svg-space
 * will be mapped to the point (p_br) in browser-space:
 *
 * p_br = p_svg * z + t
 */


export function toSVGSpace(p: number, tp: number, z: number): number {
	return (p - tp) / z;
}

export function toBrowserSpace(p: number, tp: number, z: number): number {
	return (p * z) + tp;
}

export function calcTranslate(m: SVGPoint, zoom: [number, number], translate: [number, number]): [number, number] {
	return [
		-(toSVGSpace(m.x, translate[0], zoom[0]) * zoom[1] - m.x),
		-(toSVGSpace(m.y, translate[1], zoom[0]) * zoom[1] - m.y)
	];
}

/**
 * Given the current zoomlevel and the scrolling-delta, calcZoom calculates
 * the new zoomlevel (n).
 *
 * calcZoom(d, z) -> n
 *
 * d is the scrolling delta (normal scrolling: +/- 53, fast scrolling: +/- 250)
 * z is the zoomlevel (1 indicating a 100% zoom, 2 indicating a 200% zoom)
 * n ∈ [zoomlevel * 0.8, zoomlevel * 1.2]
 */
export function calcZoom(delta: number, zoomlevel: number): number {
	/**
	 */
	return zoomlevel * (1 + (frame(-delta / 265, -1, 1) / 5));
}

export function cursorPoint(svg: SVGLocatable, pt: SVGPoint, evt: MouseEvent): SVGPoint{
	pt.x = evt.clientX;
	pt.y = evt.clientY;
	return pt.matrixTransform(svg.getScreenCTM().inverse());
}

export function frame(value: number, min: number, max: number) {
	return Math.max(Math.min(value, max), min);
}

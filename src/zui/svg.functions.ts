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

import { Coordinate } from './types.model';

/**
 * Returns the cursor-position relative to the top-left corner of the svg in SVG-space
 */
export function cursorPoint(svg: SVGLocatable, pt: SVGPoint, evt: MouseEvent): Coordinate {
	let point: SVGPoint;
	pt.x = evt.clientX;
	pt.y = evt.clientY;
	point = pt.matrixTransform(svg.getScreenCTM().inverse());
	return new Coordinate(point.x, point.y);
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

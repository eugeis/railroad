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

import { Injectable } from '@angular/core';

import { frame } from './svg.functions';

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

import { Coordinate, Border } from './types.model';

@Injectable()
export class ZUIService {
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
	 *     t_n = f(c, z_o, z_n, t_o) = zoom(c, z_o, z_n, t_o);
	 */
	zoom(cursorPos: Coordinate, translate: Coordinate, factor: number): Coordinate {
		return new Coordinate(
			cursorPos.x - factor * (cursorPos.x - translate.x),
			cursorPos.y - factor * (cursorPos.y - translate.y)
		);
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
	pan(translate: Coordinate, movement: Coordinate): Coordinate {
		return new Coordinate(translate.x + movement.x, translate.y + movement.y)
	}

	/**
	 * Transforms the delta movement by the mousewheel to a number between 0.8 and 1.2
	 */
	getZoomFactor(delta: number): number {
		return (1 + (frame(-delta / 265, -1, 1) / 5));
	}

	limitZoom(zoom: number, svgSize: Coordinate, border: Border, maxZoom?: number): number {
		zoom = frame(zoom, svgSize.x / (border.max.x - border.min.x), maxZoom || zoom);
		zoom = frame(zoom, svgSize.y / (border.max.y - border.min.y), maxZoom || zoom);
		return zoom;
	}

	limitTranslate(translate: Coordinate, zoom: number, svgSize: Coordinate, border: Border): Coordinate {
		return new Coordinate(
			this._limitTranslate(translate.x, zoom, svgSize.x, [border.min.x, border.max.x]),
			this._limitTranslate(translate.y, zoom, svgSize.y, [border.min.y, border.max.y])
		);
	}

	_limitTranslate(translate: number, zoom: number, svgSize: number, border: [number,number]): number {
		return frame(translate, svgSize - border[1] * zoom, -border[0] * zoom);
	}
}

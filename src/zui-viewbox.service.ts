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

@Injectable()
export class ZUIViewboxService {
	applyOffsetConstraints(offset: [number, number], zoom: number, svgSize: [number, number], border: [[number, number],[number, number]]): [number, number] {
		return [
			frame(offset[0], border[0][0], border[1][0] - svgSize[0] / zoom),
			frame(offset[1], border[0][1], border[1][1] - svgSize[1] / zoom)
		];
	}

	applyZoomConstraints(zoom: number, svgSize: [number, number], border: [[number, number],[number, number]]) {
		zoom = frame(zoom, svgSize[0] / (border[1][0] - border[0][0]), zoom);
		zoom = frame(zoom, svgSize[1] / (border[1][1] - border[0][1]), zoom);
		return zoom;
	}

	zoom(mousePos: [number, number],
			offset: [number, number],
			factor: number): [number, number] {
		return [
			mousePos[0] - (mousePos[0] - offset[0]) / factor,
			mousePos[1] - (mousePos[1] - offset[1]) / factor
		];
	}

	pan(movement: [number, number], zoom: number, offset: [number, number]): [number, number] {
		return [offset[0] + movement[0] / zoom, offset[1] + movement[1] / zoom];
	}

	getZoomFactor(delta: number) {
		return (1 + (frame(-delta / 265, -1, 1) / 5));
	}
}

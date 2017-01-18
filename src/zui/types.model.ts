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

export class Coordinate {
	readonly x: number;
	readonly y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export class Border {
	readonly min: Coordinate;
	readonly max: Coordinate;

	constructor(min: Coordinate, max: Coordinate) {
		this.min = min;
		this.max = max;
	}
}

export class Padding {
	readonly left: number;
	readonly up: number;
	readonly right: number;
	readonly down: number;

	constructor(up: number, right: number, down: number, left: number) {
		this.left = left;
		this.up = up;
		this.right = right;
		this.down = down;
	}
}

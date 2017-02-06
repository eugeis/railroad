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

export function findGreatestSmallerThanOrGreatest(arr: number[], value: number): number {
	if (!arr) throw "Array is undefined";
	if (value == undefined) throw "Value is undefined";
	if (arr.length === 0) throw "Array is empty";

	let min: number = Number.MAX_VALUE;
	let ret: number = undefined;
	arr.forEach((d) => {
		if (ret === undefined) {
			if (d <= value) ret = d;
		} else {
			if (d <= value && d >= ret) ret = d;
		}
		min = Math.min(min, d);
	});

	if (ret === undefined) {
		return min;
	}

	return ret;
}

export function floorToGrid(lower: number, i: number): number {
	return lower - lower % i;
}

export function ceilToGrid(upper: number, i: number): number {
	return upper - upper % i + i;
}

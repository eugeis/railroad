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

import { findGreatestSmallerThanOrGreatest, floorToGrid, ceilToGrid } from './time-axis.functions';

describe("FindGreatestSmallerThanOrGreatest", () => {
	it("should throw when given an empty array", () => {
		expect(findGreatestSmallerThanOrGreatest).toThrow();
		expect(() => {findGreatestSmallerThanOrGreatest([], 0)}).toThrow();
		expect(() => {findGreatestSmallerThanOrGreatest([1,2], undefined)}).toThrow();
	});

	it("should find value in sorted array", () => {
		let array: number[] = [-4,-2,0,1,2,3,4,5,6,7,8,9,10];

		let io: [number, number][] = [[-5,-4],[-4,-4],[-3,-4],[-1,-2],[0,0],
		[1,1],[2,2],[2.5,2],[3,3], [4,4],[4.2,4],[4.4,4],[4.7,4],[8,8],[8.4,8],
		[11.4,10],[12,10],[13,10],[14,10]];

		io.forEach((d: [number, number]) => {
			expect(findGreatestSmallerThanOrGreatest(array, d[0])).toBe(d[1]);
		});
	});

	it("should find value in shuffled array", () => {
		let io: [number, number][] = [[-5,-4],[-4,-4],[-3,-4],[-1,-2],[0,0],
			[1,1],[2,2],[2.5,2],[3,3], [4,4],[4.2,4],[4.4,4],[4.7,4],[8,8],
			[8.4,8],[11.4,10],[12,10],[13,10],[14,10]];

		function shuffle(array: number[]) {
			for (let i = array.length - 1; i >= 0; i--) {
				let ptr = Math.floor(Math.random() * (i + 1));
				let t = array[i];
				array[i] = array[ptr];
				array[ptr] = t;
			}

			return array;
		}

		for (let i = 0; i < 10; i++) {
			let array: number[] = shuffle([-4,-2,0,1,2,3,4,5,6,7,8,9,10]);
			console.log(array);

			io.forEach((d: [number, number]) => {
				expect(findGreatestSmallerThanOrGreatest(array, d[0])).toBe(d[1]);
			});
		}
	});
});

describe("floorToGrid / ceilToGrid", () => {
	it("should round (floor) to grid", () => {
		let io: [number, number, number][] = [
			[2,3,0],[5,3,3],[10,3,9],[4,5,0],[6,5,5],[16,10,10],[19,7,14],[25,9,18],[2639,500,2500]
		];

		io.forEach((d: [number, number, number]) => {
			expect(floorToGrid(d[0], d[1])).toBe(d[2]);
		});
	});

	it("should round (ceil) to grid", () => {
		let io: [number, number, number][] = [
			[2,3,3],[5,3,6],[10,3,12],[4,5,5],[6,5,10],[16,10,20],[19,7,21],[25,9,27],[2639,500,3000]
		];

		io.forEach((d: [number, number, number]) => {
			expect(ceilToGrid(d[0], d[1])).toBe(d[2]);
		});
	});
});

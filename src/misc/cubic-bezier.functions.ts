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


/*
easeInOut(t) {
	return cubicBezier([0.42,0],[0.58,1])(t);
}

easeOut(t) {
	return cubicBezier([0,0],[0.58,1])(t);
}

easeIn(t) {
	return cubicBezier([0.42,0],[1,1])(t);
}

ease(t) {
	return cubicBezier([0.25,0.1],[0.25,1])(t);
}
*/
export function cubicBezier(p1: [number,number], p2: [number, number]) {
	if (p1[0] < 0 || p1[0] > 1) {
		throw "Wrong argument";
	}
	if (p2[0] < 0 || p2[0] > 1) {
		throw "Wrong argument";
	}

	return (t:number) => {
		if (t < 0 || t > 1) {
			throw "Wrong argument";
		}

		let p: [number, number][] = [[0,0], p1, p2, [1,1]];

		let newX = (-p[0][0] + 3*p[1][0] - 3*p[2][0] + p[3][0]) * t * t * t;
		newX += (3*p[0][0] - 6*p[1][0] + 3*p[2][0]) * t * t;
		newX += (-3*p[0][0] + 3*p[1][0]) * t + p[0][0];


		let newY = (-p[0][1] + 3*p[1][1] - 3*p[2][1] + p[3][1]) * t * t * t;
		newY += (3*p[0][1] - 6*p[1][1] + 3*p[2][1]) * t * t;
		newY += (-3*p[0][1] + 3*p[1][1]) * t + p[0][1];

		/*let ncr3 = (k) => {
			switch (k) {
				case 0: return 1;
				case 1: return 3;
				case 2: return 3;
				case 3: return 1;
				default: throw "Wrong argument";
			}
		};*/

		/*let res =  p.reduce((prev: [number, number], cur: [number, number], i: number) => {
			let multiplier = ncr3(i) * Math.pow(t, i) * Math.pow((1 - t), 3 - i);
			let result = [cur[0] * multiplier, cur[1] * multiplier];
			return [result[0] + prev[0], result[1] + prev[1]];
		});

		if (Math.abs(res[0] - newX) > 0.001) {
			console.error(res[0] + "!=" + newX);
			throw "Error!";
		}

		if (Math.abs(res[1] - newY) > 0.001) {
			console.error(res[1] + "!=" + newY);
			throw "Error!";
		}*/

		return [newX, newY];
	}
}

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

import { calcBarSize, calcBarPosition, calcMovementPosition } from './svg-scrollbar.functions';

describe("SVG-Scrollbar Functions", () => {
	it("should calculate the bar size", () => {
		expect(calcBarSize(1, 100, 100, [0,100])).toBe(100);
		expect(calcBarSize(1, 100, 200, [0,100])).toBe(200);
		expect(calcBarSize(1, 200, 100, [0,100])).toBe(200);

		expect(calcBarSize(2,100,100, [-100,100])).toBe(25);
		expect(calcBarSize(4,100,100, [-100,100])).toBeCloseTo(12.5);
	});
});

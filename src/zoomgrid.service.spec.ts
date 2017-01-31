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
import { ZoomGridService, GridResponse, Side } from './zoomgrid.service';

describe('ZoomGridService', () => {
	let zoomGridService: ZoomGridService;

	beforeEach(() => {
		zoomGridService = new ZoomGridService();
	});

	it('should trigger single subscription', () => {
		let sequence: number[] = [
/*^2*/		1.8,2.2,
/*^3*/		2.8,3.1,
/*v3*/		3.5,3.8,3.2,2.9,
/*^3*/		2.4,2.1,2.8,2.9,3.1,
/*^4*/		3.6,3.9,4.1,
/*^5*/		4.9,5.3,
/*v5*/		4.8,
/*v4*/		4.5,4.2,3.9,
/*v3*/		3.4,2.8
		]
		let expectedLevel: number[] = [2,3,3,3,4,5,5,4,3];
		let expectedSide: Side[] = [Side.RISING, Side.RISING, Side.FALLING,
			Side.RISING, Side.RISING, Side.RISING, Side.FALLING, Side.FALLING,
			Side.FALLING];
		let ptr: number = 0;

		expect(expectedLevel.length).toBe(expectedSide.length);

		zoomGridService.notifyOn([1,2,3,4,5]).subscribe((resp: GridResponse) => {
			expect(resp.level).toBe(expectedLevel[ptr]);
			expect(resp.side).toBe(expectedSide[ptr]);
			ptr++;
		});

		sequence.forEach((d) => {
			zoomGridService.zoomChange(d);
		});

		expect(ptr).toBe(expectedLevel.length);
	});

	it('should trigger double subscription', () => {
		let sequence: number[] = [
/*^2*/		1.1,1.4,1.8,2.1,
/*^3*/		2.3,2.6,2.9,3.2,
/*^.5*/		3.4,3.6,
/*v.5*/		3.7,3.6,3.55,3.4,
/*^.5*/		3.45,3.7,
/*^4*/		3.8,3.9,4.3,
/*v4*/		4.2,4.05,3.9
		]

		let expectedLevel1: number[] = [2,4,4];
		let expectedLevel2: number[] = [2,3,3.5,3.5,3.5];
		let calls = 0;

		{
			let expectedLevel = expectedLevel1;
			let expectedSide: Side[] = [Side.RISING, Side.RISING, Side.FALLING];
			let ptr: number = 0;

			expect(expectedLevel.length).toBe(expectedSide.length);

			zoomGridService.notifyOn([1,2,4]).subscribe((resp: GridResponse) => {
				expect(resp.level).toBe(expectedLevel[ptr]);
				expect(resp.side).toBe(expectedSide[ptr]);
				ptr++;
				calls++;
			});
		}

		{
			let expectedLevel = expectedLevel2;
			let expectedSide: Side[] = [Side.RISING, Side.RISING, Side.RISING,
				Side.FALLING, Side.RISING];
			let ptr: number = 0;

			expect(expectedLevel.length).toBe(expectedSide.length);

			zoomGridService.notifyOn([2,3,3.5]).subscribe((resp: GridResponse) => {
				expect(resp.level).toBeCloseTo(expectedLevel[ptr]);
				expect(resp.side).toBe(expectedSide[ptr]);
				ptr++;
				calls++;
			});
		}

		sequence.forEach((d) => {
			zoomGridService.zoomChange(d);
		});

		expect(calls).toBe(expectedLevel1.length + expectedLevel2.length);
	});
});

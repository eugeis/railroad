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

import { TestBed, inject } from '@angular/core/testing';

import { ZUIService } from './zui.service';
import { Coordinate, Padding, Border } from './types.model';

describe("ZUIService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			providers: [{provide: ZUIService, useClass: ZUIService}]
		});
	});

	it('should have a defined service', inject([ZUIService], (service: ZUIService) => {
		expect(service).toBeDefined();
	}));

	it("should calculate pan", inject([ZUIService], (service: ZUIService) => {
		{
			let result: Coordinate = service.pan(new Coordinate(0,0), new Coordinate(0,0));
			expect(result.x).toBe(0);
			expect(result.y).toBe(0);
		}

		{
			let result: Coordinate = service.pan(new Coordinate(15,20), new Coordinate(2,3));
			expect(result.x).toBe(17);
			expect(result.y).toBe(23);
		}

		{
			let result: Coordinate = service.pan(new Coordinate(15,20), new Coordinate(-5,-2));
			expect(result.x).toBe(10);
			expect(result.y).toBe(18);
		}

		{
			let result: Coordinate = service.pan(new Coordinate(15,20), new Coordinate(-25,4));
			expect(result.x).toBe(-10);
			expect(result.y).toBe(24);
		}
	}));

	it("should calculate zoom", inject([ZUIService], (service: ZUIService) => {
		{
			let result: Coordinate = service.zoom(new Coordinate(0,0), new Coordinate(0,0), 2);
			expect(result.x).toBe(0);
			expect(result.y).toBe(0);
		}

		{
			let result: Coordinate = service.zoom(new Coordinate(5,5), new Coordinate(0,0), 2);
			expect(result.x).toBe(-5);
			expect(result.y).toBe(-5);
		}

		{
			let result: Coordinate = service.zoom(new Coordinate(5,5), new Coordinate(5,3), 1);
			expect(result.x).toBe(5);
			expect(result.y).toBe(3);
		}

		{
			let result: Coordinate = service.zoom(new Coordinate(17,4), new Coordinate(12,9), 0.8);
			expect(result.x).toBe(13);
			expect(result.y).toBe(8);
		}
	}));

	it("should calculate zoomfactor", inject([ZUIService], (service: ZUIService) => {
		{
			let result: number= service.getZoomFactor(-1000);
			expect(result).toBeCloseTo(1.2);
		}

		{
			let result: number= service.getZoomFactor(1000);
			expect(result).toBeCloseTo(0.8);
		}

		{
			let result: number= service.getZoomFactor(0);
			expect(result).toBeCloseTo(1);
		}
	}));

	it("should apply the limit to zoom", inject([ZUIService], (service: ZUIService) => {
		{
			let border: Border = new Border(new Coordinate(0,0), new Coordinate(100,100));
			let result: number = service.limitZoom(1, new Coordinate(100, 100), border);
			expect(result).toBe(1);
		}

		{
			let border: Border = new Border(new Coordinate(0,0), new Coordinate(100,100));
			let result: number = service.limitZoom(2, new Coordinate(100, 100), border);
			expect(result).toBe(2);
		}

		{
			let border: Border = new Border(new Coordinate(100,100), new Coordinate(500,500));
			let result: number = service.limitZoom(0.5, new Coordinate(100, 100), border);
			expect(result).toBeCloseTo(0.5);
		}

		{
			let border: Border = new Border(new Coordinate(100,100), new Coordinate(500,500));
			let result: number = service.limitZoom(3, new Coordinate(100, 100), border, 2);
			expect(result).toBe(2);
		}
	}));

	it("should apply the limit to zoom", inject([ZUIService], (service: ZUIService) => {
		{
			let border: Border = new Border(new Coordinate(0,0), new Coordinate(500,500));
			let svgSize: Coordinate = new Coordinate(400,400);
			let result: Coordinate = service.limitTranslate(new Coordinate(0,0), 1, svgSize, border);
			expect(result.x).toBe(0);
			expect(result.y).toBe(0);
		}

		{
			let border: Border = new Border(new Coordinate(0,0), new Coordinate(500,500));
			let svgSize: Coordinate = new Coordinate(400,400);
			let result: Coordinate = service.limitTranslate(new Coordinate(100,100), 1, svgSize, border);
			expect(result.x).toBe(0);
			expect(result.y).toBe(0);
		}

		{
			let border: Border = new Border(new Coordinate(0,0), new Coordinate(500,500));
			let svgSize: Coordinate = new Coordinate(400,400);
			let result: Coordinate = service.limitTranslate(new Coordinate(-600,-600), 1, svgSize, border);
			expect(result.x).toBe(-100);
			expect(result.y).toBe(-100);
		}

		{
			let border: Border = new Border(new Coordinate(0,0), new Coordinate(500,500));
			let svgSize: Coordinate = new Coordinate(400,400);
			let result: Coordinate = service.limitTranslate(new Coordinate(-800,-800), 2, svgSize, border);
			expect(result.x).toBe(-600);
			expect(result.y).toBe(-600);
		}
	}));
});

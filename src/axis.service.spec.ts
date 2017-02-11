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

import { AxisService } from './axis.service';
import { Border, Coordinate } from './zui/types.model';

describe("AxisService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			providers: [{provide: AxisService, useClass: AxisService}]
		});
	});

	it('should have a defined service', inject([AxisService], (service: AxisService) => {
		expect(service).toBeDefined();
	}));

	it("should calculate x-position", inject([AxisService], (service: AxisService) => {
		expect(service.getX("SYJ")).toBe(100);
		expect(service.getX("1011")).toBe(100 + 100);
		expect(service.getX("HXXJ")).toBe(200 + 100);
		expect(service.getX("1010")).toBe(300 + 100);
		expect(service.getX("AZM")).toBe(400 + 100);
		expect(service.getX("1009")).toBe(500 + 100);
		expect(service.getX("BTC")).toBe(600 + 100);
		expect(service.getX("JDM")).toBe(700 + 100);
		expect(service.getX("1007")).toBe(800 + 100);
		expect(service.getX("1006")).toBe(900 + 100);
		expect(service.getX("MDY")).toBe(1000 + 100);
		expect(service.getX("XTC")).toBe(1100 + 100);
		expect(service.getX("ZCLU")).toBe(1200 + 100);
		expect(service.getX("ZCLI")).toBe(1300 + 100);
		expect(service.getX("HDHZ")).toBe(1400 + 100);
		expect(service.getX("1004")).toBe(1500 + 100);
		expect(service.getX("SZJ")).toBe(1600 + 100);
		expect(service.getX("1001")).toBe(1700 + 100);
		expect(service.getX("BG")).toBe(1800 + 100);
		expect(service.getX("PLU")).toBe(1900 + 100);
	}));

	it("should calculate y-position", inject([AxisService], (service: AxisService) => {
		let border: Border = new Border(new Coordinate(0,0), new Coordinate(2000,2000));
		let offset = new Date().getTimezoneOffset() * 60 * 1000;
		expect(service.getY(new Date(0+offset), border)).toBe(0);
		expect(service.getY(new Date(1000*21600+offset), border)).toBe(500);
		expect(service.getY(new Date(1000*43200+offset), border)).toBe(1000);
		expect(service.getY(new Date(1000*64800+offset), border)).toBe(1500);
	}));
});

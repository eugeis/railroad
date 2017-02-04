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
import { AxisService } from './axis.service';
import { Border, Coordinate } from './zui/types.model';

describe("AxisService", () => {
	let axisService: AxisService;

	beforeEach(() => {
		axisService = new AxisService;
	});

	it("should calculate x-position", () => {
		expect(axisService.getX("SYJ")).toBe(100);
		expect(axisService.getX("1011")).toBe(100 + 100);
		expect(axisService.getX("HXXJ")).toBe(200 + 100);
		expect(axisService.getX("1010")).toBe(300 + 100);
		expect(axisService.getX("AZM")).toBe(400 + 100);
		expect(axisService.getX("1009")).toBe(500 + 100);
		expect(axisService.getX("BTC")).toBe(600 + 100);
		expect(axisService.getX("JDM")).toBe(700 + 100);
		expect(axisService.getX("1007")).toBe(800 + 100);
		expect(axisService.getX("1006")).toBe(900 + 100);
		expect(axisService.getX("MDY")).toBe(1000 + 100);
		expect(axisService.getX("XTC")).toBe(1100 + 100);
		expect(axisService.getX("ZCLU")).toBe(1200 + 100);
		expect(axisService.getX("ZCLI")).toBe(1300 + 100);
		expect(axisService.getX("HDHZ")).toBe(1400 + 100);
		expect(axisService.getX("1004")).toBe(1500 + 100);
		expect(axisService.getX("SZJ")).toBe(1600 + 100);
		expect(axisService.getX("1001")).toBe(1700 + 100);
		expect(axisService.getX("BG")).toBe(1800 + 100);
		expect(axisService.getX("PLU")).toBe(1900 + 100);
	});

	it("should calculate y-position", () => {
		let border: Border = new Border(new Coordinate(0,0), new Coordinate(2000,2000));
		let offset = new Date().getTimezoneOffset() * 60 * 1000;
		expect(axisService.getY(new Date(0+offset), border)).toBe(0);
		expect(axisService.getY(new Date(1000*21600+offset), border)).toBe(500);
		expect(axisService.getY(new Date(1000*43200+offset), border)).toBe(1000);
		expect(axisService.getY(new Date(1000*64800+offset), border)).toBe(1500);
	});
});

import { frame } from './svg.functions';
import { ZUIViewboxService } from './zui-viewbox.service';

describe("Railroad functions", () => {
	it("should apply borders", () => {
		expect(frame(1, 0, 2)).toBe(1);
		expect(frame(1, 2, 4)).toBe(2);
		expect(frame(1, -1, 0)).toBe(0);
		expect(frame(5, -10, 10)).toBe(5);
		expect(frame(5, 5, 10)).toBe(5);
		expect(frame(5, 10, 20)).toBe(10);
		expect(frame(-10, -20, -6)).toBe(-10);
		expect(frame(-10, -9, -6)).toBe(-9);
		expect(frame(-10, -20, -12)).toBe(-12);
	});
});

describe("ZUI-Viewbox Servide", () => {
	beforeEach(() => {
		this.testService = new ZUIViewboxService();
	});

	it("should apply zoom constraints", () => {
		fail("not implemented");
		//this.testService.applyZoomConstraints
	});

	it("should apply offset constraints", () => {
		fail("not implemented");
		//this.testService.applyOffsetConstraints
	});


	it("should do calculate the zoomfactor", () => {
		fail("not implemented");
		//this.testService.getZoomFactor
	});

	it("should pan correctly", () => {
		fail("not implemented");
		//this.testService.pan
	});

	it("should zoom correctly", () => {
		{
			let ret = this.testService.zoom([200,200], [100, 100], 2);
			expect(ret[0]).toBe(150);
			expect(ret[1]).toBe(150);
		}

		{
			let ret = this.testService.zoom([400,250], [200, 200], 2);
			expect(ret[0]).toBe(300);
			expect(ret[1]).toBe(225);
		}

		{
			let ret = this.testService.zoom([200,200], [200, 200], 2);
			expect(ret[0]).toBe(200);
			expect(ret[1]).toBe(200);
		}

		{
			let ret = this.testService.zoom([400,400], [200, 200], 2);
			expect(ret[0]).toBe(300);
			expect(ret[1]).toBe(300);
		}
	});
});

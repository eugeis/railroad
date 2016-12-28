import { ZUIViewboxService } from './zui-viewbox.service';

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

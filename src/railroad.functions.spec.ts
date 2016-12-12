import { frame, zoom } from './railroad.functions';

describe("Railroad functions", () => {
	it("should apply borders", () => {
		expect(frame(1, 0, 2)).toBe(1);
		expect(frame(1, 2, 4)).toBe(2);
		expect(frame(1, -1, 0)).toBe(0);
		expect(frame(5, -10, 10)).toBe(5);
		expect(frame(5, 5, 10)).toBe(5);
		expect(frame(5, 10, 20)).toBe(10);
	});

	it("should calculate the translation", () => {
		let oldZoom: [number, number] = [1,1];
		let newZoom: [number, number] = [2,2];
		let translate: [number, number] = [100,100];

		let svg: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

		{
			let svgPoint: SVGPoint = svg.createSVGPoint();
			svgPoint.x = 100;
			svgPoint.y = 100;
		}
	});

	it("should zoom correctly", () => {
		{
			let ret = zoom([200,200], [100, 100], 2);
			expect(ret[0]).toBe(150);
			expect(ret[1]).toBe(150);
		}

		{
			let ret = zoom([400,250], [200, 200], 2);
			expect(ret[0]).toBe(300);
			expect(ret[1]).toBe(225);
		}

		{
			let ret = zoom([200,200], [200, 200], 2);
			expect(ret[0]).toBe(200);
			expect(ret[1]).toBe(200);
		}

		{
			let ret = zoom([400,400], [200, 200], 2);
			expect(ret[0]).toBe(300);
			expect(ret[1]).toBe(300);
		}
	});
});

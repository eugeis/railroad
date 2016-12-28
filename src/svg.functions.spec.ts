import { frame } from './svg.functions';

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

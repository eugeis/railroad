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
import { Component, Input, DoCheck, Inject } from '@angular/core';

import { CoordinateInterface } from './coordinate.interface';

@Component({
	selector: '[svg-time-axis]',
	styles: [`
		text {
			user-select: none;
			fill: black;
		}
		line {
			stroke: grey;
		}
	`],
	template: `
		<svg:g class="time-axis" *ngFor="let time of times; let i = index">
			<svg:text
				[attr.x]="2 / zoom"
				[attr.y]="time[1]"
				[attr.font-size]="16 / zoom">
				{{time[0] | date:'HH:mm:ss'}}
			</svg:text>
			<svg:line
				[attr.x1]="padding[3] / zoom"
				[attr.y1]="time[1]"
				[attr.x2]="svgSize[0] / zoom"
				[attr.y2]="time[1]"
				vector-effect="non-scaling-stroke">
			</svg:line>
		</svg:g>
	`
})

export class SVGTimeAxisComponent implements DoCheck {
	@Input() border: [[number, number], [number, number]];
	@Input() padding: [number, number, number, number];
	@Input() translate: [number, number];
	@Input() zoom: number = 1;

	@Input() svgSize: [number, number];
	@Input() contentSize: [number, number];

	oldZoom: number;
	oldTranslate: number;

	times: [Date, number][] = [];

	constructor(@Inject('CoordinateInterface') private coord: CoordinateInterface<string, Date>) { }

	ngDoCheck() {
		if (!this.svgSize || !this.translate || !this.padding || !this.border) {
			return;
		}

		if (this.zoom == this.oldZoom && this.translate[1] == this.oldTranslate) {
			return;
		}

		let lower = 24 * 60 * 60 * (this.translate[1] + this.zoom * this.border[0][1]) / (this.zoom * (this.border[0][1] - this.border[1][1]));
		let upper = 24 * 60 * 60 * (this.translate[1] - this.contentSize[1] + this.zoom * this.border[0][1]) / (this.zoom * (this.border[0][1] - this.border[1][1]));

		let timeOffset = new Date().getTimezoneOffset() * 60;
		lower = lower + timeOffset;
		upper = upper + timeOffset;

		let rawStep = (upper - lower) / 6;
		let step: number;
		if (rawStep > 3600) {
			step = 3600;
		} else if (rawStep > 1800) {
			step = 1800;
		} else if (rawStep > 900) {
			step = 900;
		} else if (rawStep > 300) {
			step = 300;
		} else if (rawStep > 60) {
			step = 60;
		} else if (rawStep > 30) {
			step = 30;
		} else if (rawStep > 15) {
			step = 15;
		} else if (rawStep > 5) {
			step = 5;
		} else {
			step = 1;
		}
		this.times = [];

		let realLower = lower - lower % step;
		let realUpper = upper - upper % step + step;

		for (let i = realLower; i < realUpper; i += step) {
			this.times.push([
				new Date(i * 1000),
				this.coord.getY(new Date(i * 1000), this.border)
			]);
		}

		this.oldZoom = this.zoom;
		this.oldTranslate = this.translate[1];
	}
}

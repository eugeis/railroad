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
import {
	Component,
	Input,
	OnChanges,
	Inject,
	ChangeDetectionStrategy
} from '@angular/core';

import { AxisServiceInterface } from './zui/axis.interface';
import { Coordinate, Border, Padding } from './zui/types.model';
import { findGreatestSmallerThanOrGreatest, floorToGrid, ceilToGrid } from './time-axis.functions';

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
				[attr.x1]="padding.left / zoom"
				[attr.y1]="time[1]"
				[attr.x2]="svgSize.x / zoom"
				[attr.y2]="time[1]"
				vector-effect="non-scaling-stroke">
			</svg:line>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class SVGTimeAxisComponent implements OnChanges {
	@Input() border: Border;
	@Input() padding: Padding;
	@Input() translate: Coordinate;
	@Input() zoom: number = 1;

	@Input() svgSize: Coordinate;
	@Input() contentSize: Coordinate;

	times: [Date, number][] = [];

	constructor(@Inject('AxisServiceInterface') private coord: AxisServiceInterface<string, Date>) { }

	ngOnChanges() {
		if (!this.svgSize || !this.translate || !this.padding || !this.border) {
			return;
		}

		let lower = 24 * 60 * 60 * (-this.translate.y - this.zoom * this.border.min.y) / (this.zoom * (this.border.max.y - this.border.min.y));
		let upper = 24 * 60 * 60 * (-this.translate.y + this.contentSize.y - this.zoom * this.border.min.y) / (this.zoom * (this.border.max.y - this.border.min.y));

		let timeOffset = new Date().getTimezoneOffset() * 60;
		lower = lower + timeOffset;
		upper = upper + timeOffset;

		let rawStep = (upper - lower + 1) / 4;
		let step: number = findGreatestSmallerThanOrGreatest([3600,1800,900,300,60,30,15,5,1], rawStep);
		this.times = [];

		let realLower = floorToGrid(lower, step);
		let realUpper = ceilToGrid(upper, step);

		for (let i = realLower; i < realUpper; i += step) {
			this.times.push([
				new Date(i * 1000),
				this.coord.getY(new Date(i * 1000), this.border)
			]);
		}
	}
}

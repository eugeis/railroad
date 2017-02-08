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
	Inject,
	ChangeDetectionStrategy
} from '@angular/core';

import { AxisServiceInterface } from './zui/axis.interface';
import { Padding, Coordinate } from './zui/types.model';

@Component({
	selector: '[svg-station-axis]',
	styles: [`
		text {
			user-select: none;
			fill: black;
		}

		line {
			stroke: black;
		}

		line:hover {
			cursor: pointer;
		}
	`],
	template: `
		<svg:g *ngFor="let station of stations; let i = index">
			<svg:text
				[attr.x]="coord.getX(station) * zoom"
				[attr.y]="24"
				[attr.font-size]="20">
				{{station}}
			</svg:text>
			<svg:line
				[attr.x1]="coord.getX(station) * zoom"
				[attr.y1]="padding.up"
				[attr.x2]="coord.getX(station) * zoom"
				[attr.y2]="svgSize.y"
				vector-effect="non-scaling-stroke">
			</svg:line>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class SVGStationAxisComponent {
	@Input() zoom: number;
	@Input() stations: string[];
	@Input() svgSize: Coordinate;
	@Input() padding: Padding;

	constructor(@Inject('AxisServiceInterface') private coord: AxisServiceInterface<string, Date>) { }
}

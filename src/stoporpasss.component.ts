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
import { Component, Input, OnChanges, ChangeDetectionStrategy, Inject } from '@angular/core';

import { CoordinateInterface } from './coordinate.interface';
import { StopOrPass } from './timetable.interface';

@Component({
	selector: '[stopOrPasss]',
	styles: [`
		path {
			stroke-linecap: round;
			stroke-width: 8px;
		}

		path.BEGIN {
			stroke: green;
		}

		path.PASS {
			stroke: yellow;
		}

		path.STOP {
			stroke: red;
		}

		path.END {
			stroke: black;
		}

		path:hover {
			cursor: pointer;
		}

		path {
			vector-effect: non-scaling-stroke;
			stroke: black;
			fill: none;
		}
	`],
	template: `
		<svg:path *ngFor="let s of sop" [attr.d]="getD(s)" [ngClass]="getClassName(s)" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class StopOrPasssComponent {
	@Input() sop: StopOrPass[];
	@Input() border: [[number, number], [number, number]];

	constructor (@Inject('CoordinateInterface') private coord: CoordinateInterface<string, Date>) { }

	getD(cur: StopOrPass) {
		return "M "
			+ this.coord.getX(cur.stationName)
			+ " "
			+ this.coord.getY(cur.plannedArrivalTime || cur.plannedDepartureTime, this.border)
			+ " L "
			+ this.coord.getX(cur.stationName)
			+ " "
			+ this.coord.getY(cur.plannedDepartureTime || cur.plannedArrivalTime, this.border)
	}

	getClassName(cur: StopOrPass) {
		let stopType = cur.stopType;
		if (stopType === "BEGIN"
			|| stopType === "END"
			|| stopType === "STOP"
			|| stopType === "PASS")
		{
			return stopType;
		}

		return "";
	}
}

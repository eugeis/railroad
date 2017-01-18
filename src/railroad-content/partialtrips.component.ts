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

import { CoordinateInterface } from '../zui/coordinate.interface';
import { PartialTrip, StopOrPass } from '../timetable.interface';

@Component({
	selector: '[partialTrips]',
	styles: [`
		path {
			stroke-width: 4px;
		}

		path {
			vector-effect: non-scaling-stroke;
			stroke: black;
			fill: none;
		}

		path:hover {
			cursor: pointer;
		}
	`],
	template: `
		<svg:path *ngFor="let pt of pts" [attr.d]="getD(pt)" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class PartialTripsComponent {
	@Input() pts: PartialTrip[];
	@Input() border: [[number, number], [number, number]];

	constructor (@Inject('CoordinateInterface') private coord: CoordinateInterface<string, Date>) { }

	getD(cur: PartialTrip) {
		return cur.stopOrPasss.reduce((prev: string, cur: StopOrPass, i: number) => {
			let d = this.coord.getX(cur.stationName)
				+ " "
				+ this.coord.getY(cur.plannedArrivalTime || cur.plannedDepartureTime, this.border)
				+ " L "
				+ this.coord.getX(cur.stationName)
				+ " "
				+ this.coord.getY(cur.plannedDepartureTime || cur.plannedArrivalTime, this.border);

			if (i === 0) {
				return prev + "M " + d + " ";
			} else {
				return prev + "L " + d + " ";
			}
		}, "");
	}
}

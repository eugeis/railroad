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
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, Inject } from '@angular/core';

import { AxisServiceInterface } from '../zui/axis.interface';
import { PartialTrip, StopOrPass } from '../timetable.interface';
import { ContextMenuStatus } from '../zui/contextmenu/contextmenu.interface';
import { Border } from '../zui/types.model';

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
			stroke: blue;
		}
	`],
	template: `
		<svg:path *ngFor="let pt of pts" [attr.d]="getD(pt)" (contextmenu)="handleCtx($event)" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class PartialTripsComponent {
	@Input() pts: PartialTrip[];
	@Input() border: Border;

	@Output("onContextMenu") contextMenuEmitter: EventEmitter<ContextMenuStatus> = new EventEmitter<ContextMenuStatus>();

	handleCtx(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		this.contextMenuEmitter.emit({
			show: true,
			items: [
				["Show trip-details", "show_trip_details"],
				["Mark trip", "mark_trip"]
			],
			x: e.layerX,
			y: e.layerY,
			target: e.target
		})
	}

	constructor (@Inject('AxisServiceInterface') private coord: AxisServiceInterface<string, Date>) { }

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

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
	Output,
	EventEmitter,
	ChangeDetectionStrategy,
	Inject
} from '@angular/core';

import { ContextMenuStatus } from '../zui/contextmenu/contextmenu.interface';

import { AxisServiceInterface } from '../zui/axis.interface';
import { Border } from '../zui/types.model';

import { StopOrPass } from '../timetable.interface';

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
			stroke: blue;
		}

		path {
			vector-effect: non-scaling-stroke;
			stroke: black;
			fill: none;
		}
	`],
	template: `
		<svg:path *ngFor="let s of sop" [attr.d]="getD(s)" [ngClass]="getClassName(s)" (contextmenu)="handleCtx($event)" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class StopOrPasssComponent {
	@Input() sop: StopOrPass[];
	@Input() border: Border;

	@Output("onContextMenu") contextMenuEmitter: EventEmitter<ContextMenuStatus> = new EventEmitter<ContextMenuStatus>();

	constructor (@Inject('AxisServiceInterface') private coord: AxisServiceInterface<string, Date>) { }

	handleCtx(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		this.contextMenuEmitter.emit({
			show: true,
			items: [
				["Show sop-details", "show_sop_details"],
				["Mark trip", "mark_trip"],
			],
			x: e.layerX,
			y: e.layerY,
			target: e.target
		});
	}

	getD(cur: StopOrPass) {
		return "M "
			+ this.coord.getX(cur.stationName)
			+ " "
			+ this.coord.getY(cur.plannedArrivalTime || cur.plannedDepartureTime, this.border)
			+ " L "
			+ this.coord.getX(cur.stationName)
			+ " "
			+ this.coord.getY(cur.plannedDepartureTime || cur.plannedArrivalTime, this.border);
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

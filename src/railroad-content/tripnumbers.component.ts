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
	OnInit,
	Output,
	EventEmitter,
	ChangeDetectionStrategy,
	Inject
} from '@angular/core';

import { Subscription } from 'rxjs';

import { ContextMenuStatus } from '../zui/contextmenu/contextmenu.interface';

import { AxisServiceInterface } from '../zui/axis.interface';
import { Border } from '../zui/types.model';
import { ZoomGridService, GridResponse } from '../zui/zoomgrid.service';

import { PartialTrip, StopOrPass } from '../timetable.interface';

@Component({
	selector: '[tripNumbers]',
	styles: [`
		text {
			user-select: none;
		}
	`],
	template: `
		<svg:g *ngIf="show">
			<svg:text *ngFor="let pt of pts"
				text-anchor="end"
				[attr.x]="coord.getX(pt.stopOrPasss[0].stationName) - 5 / zoom"
				[attr.y]="coord.getY(pt.stopOrPasss[0].plannedDepartureTime, border)"
				[attr.font-size]="12 / zoom">
					{{pt.tripNumber}}
			</svg:text>
		</svg:g>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class TripNumbersComponent implements OnInit {
	@Input() pts: PartialTrip[];
	@Input() border: Border;
	@Input() zoom: number;

	show: boolean;
	subscription: Subscription;

	constructor (
		private zg: ZoomGridService,
		@Inject('AxisServiceInterface') private coord: AxisServiceInterface<string, Date>
	) { }

	ngOnInit() {
		this.subscription = this.zg.notifyOn([2]).subscribe((response: GridResponse) => {
			this.show = (response.zoom > 2);
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

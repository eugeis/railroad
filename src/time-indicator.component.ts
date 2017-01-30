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
	OnInit,
	OnDestroy,
	Input,
	Inject,
	ChangeDetectionStrategy,
	ChangeDetectorRef
} from '@angular/core';

import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

import { AxisServiceInterface } from './zui/axis.interface';
import { Border } from './zui/types.model';


@Component({
	selector: '[svg-time-indicator]',
	styles: [`
		line {
			stroke: black;
			stroke-width: 2px;
		}
	`],
	template: `
		<svg:line *ngIf="x1 >= 0 && x2 >= 0 && y >= 0"
			[attr.x1]="x1"
			[attr.y1]="y"
			[attr.x2]="x2"
			[attr.y2]="y"
			vector-effect="non-scaling-stroke">
		</svg:line>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class SVGTimeIndicator implements OnInit, OnDestroy {
	@Input() border: Border;

	x1: number;
	x2: number;
	y: number;

	subscription: Subscription;

	constructor(
		private cd: ChangeDetectorRef,
		@Inject('AxisServiceInterface') private coord: AxisServiceInterface<string, Date>,
	) { }

	ngOnInit() {
		this.x1 = this.border.min.x;
		this.x2 = this.border.max.x;

		this.subscription = TimerObservable.create(0, 1000).subscribe(() => {
			this.y = this.coord.getY(new Date(), this.border);
			this.cd.markForCheck();
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

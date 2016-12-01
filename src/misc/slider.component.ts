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
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'slider',
	styles: [`
	input[type=range] {
		margin: 18px 0;
		-webkit-appearance: none;
	}
	input[type=range]:focus {
		outline: none;
	}
	input[type=range]::-webkit-slider-runnable-track {
		width: 100%;
		height: 7px;
		cursor: pointer;
		border-radius: 4px;
		border-top: 1px solid #a0a0a0;
		border-bottom: 1px solid #cdcdcd;
		border-left: 1px solid #b9b9b9;
		border-right: 1px solid #b9b9b9;
		background: linear-gradient(top, #d0d0d0 0%,#f3f3f3 100%);
		background: -webkit-linear-gradient(top, #d0d0d0 0%,#f3f3f3 100%);
		background: -moz-linear-gradient(top, #d0d0d0 0%,#f3f3f3 100%);
		background: -o-linear-gradient(top, #d0d0d0 0%,#f3f3f3 100%);
		box-shadow: inset 1px 1px 2px -1px rgba(107, 107, 107, 0.75);
	}
	input[type=range]::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 21px;
		height: 21px;
		margin-top: -8px;
		cursor: pointer;
		border-radius: 30px;
		border: 1.5px solid #b3b3b3;
		background: linear-gradient(top, #ffffff 0%,#d2d2d2 100%);
		background: -webkit-linear-gradient(top, #ffffff 0%,#d2d2d2 100%);
		background: -moz-linear-gradient(top, #ffffff 0%,#d2d2d2 100%);
		background: -o-linear-gradient(top, #ffffff 0%,#d2d2d2 100%);
	}
	`],
	template: `
		<div *ngIf="value">
			<input type="range"
				[attr.min]="min"
				[attr.max]="max"
				[attr.steps]="steps"
				[ngModel]="value"
				(ngModelChange)="updateData($event)"
				[ngStyle]="{'width': sliderWidth+'px'}">
		</div>
	`,
})

export class Slider {
	@Input() sliderWidth: number = 130;
	@Input() min: number = 0;
	@Input() max: number = 100;
	@Input() steps: number = 1;
	@Input() value: any;

	@Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

	updateData(event: any) {
		this.value = event;
		this.valueChange.emit(event);
	}
}

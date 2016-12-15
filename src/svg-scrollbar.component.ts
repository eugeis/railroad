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
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { applyOffsetConstraint } from './svg-zoomable.functions';

@Component({
	selector: '[ee-svg-scrollbar]',
	styles: [`
		.scrollbar {
			cursor: pointer;
			fill: rgba(166,166,166,0.8);
		}

		.scrollbar.vertical {
			width: 5px;
			transition: width 100ms;
		}

		.scrollbar.vertical:hover, .scrollbar.vertical.dragging {
			width: 10px;
		}

		.scrollbar.horizontal {
			height: 5px;
			transition: height 100ms;
		}

		.scrollbar.horizontal:hover, .scrollbar.horizontal.dragging {
			height: 10px;
		}
	`],
	template: `
		<svg:g *ngIf="border">
			<svg:rect *ngIf="horizontal && size != svgSize" class="scrollbar horizontal"
				y="10"
				[ngClass]="{'dragging': dragging}"
				[attr.x]="position"
				[attr.width]="size"
			/>
			<svg:rect *ngIf="!horizontal && size != svgSize" class="scrollbar vertical"
				x="10"
				[ngClass]="{'dragging': dragging}"
				[attr.y]="position"
				[attr.height]="size"
			/>
		</svg:g>
	`
})

export class SVGScrollbarComponent implements OnInit, OnChanges {
	@Input() svgSize: number;
	@Input() zoom: number;
	@Input() border: [number, number];
	@Input() offset: number;

	@Input() horizontal: any;

	@Output() offsetChange: EventEmitter<number> = new EventEmitter<number>();

	dragging: boolean = false;
	size: number = 0;
	position: number = 0;

	@HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
		if (e.button != 0) {
			return;
		}
		e.stopPropagation();
		this.dragging = true;
	}

	@HostListener('window:mousemove', ['$event']) onMouseMove(e: MouseEvent) {
		if (!this.dragging) {
			return;
		}

		let movement = (this.horizontal) ? e.movementX : e.movementY;
		this.offset = (this.position + movement) * (this.border[1] * this.zoom - this.svgSize) / (this.svgSize - this.size);
		this.offset = applyOffsetConstraint(this.offset, this.zoom, this.svgSize, this.border);
		this.offsetChange.emit(this.offset);
	}

	@HostListener('window:mouseup', ['$event']) onMouseUp(e: MouseEvent) {
		this.dragging = false;
	}

	@HostListener('contextmenu', ['$event']) onContextMenu(e: MouseEvent) {
		e.stopPropagation();
	}

	ngOnInit() {

	}

	ngOnChanges() {
		let borderSize = (this.border[1] - this.border[0]) * this.zoom;
		this.size = (this.svgSize / borderSize) * this.svgSize;

		this.position = this.offset / (this.border[1] * this.zoom - this.svgSize) * (this.svgSize - this.size) || 0;
	}
}

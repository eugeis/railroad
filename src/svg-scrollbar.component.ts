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
import { Component, OnChanges, Input, HostListener } from '@angular/core';

@Component({
	selector: '[ee-svg-scrollbar]',
	styles: [`
		.scrollbar.vertical {
			fill: yellow;
		}

		.scrollbar.vertical.dragging {
			fill: blue !important;
		}

		.scrollbar.horizontal {
			fill: red;
		}
	`],
	template: `
		<svg:g *ngIf="border">
			<svg:rect class="scrollbar vertical"
				x="10"
				width="20"
				[ngClass]="{'dragging': dragging}"
				[attr.y]="y"
				[attr.height]="height"
			/>
		</svg:g>
	`
})

export class SVGScrollbarComponent implements OnChanges {
	@Input() svgSize: [number, number];
	@Input() zoom: number;
	@Input() border: [[number, number], [number, number]];
	@Input() offset: [number, number];

	dragging: boolean = false;
	height: number = 0;
	y: number = 0;

	@HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
		if (e.button != 0) {
			return;
		}
		e.stopPropagation();
		this.dragging = true;
	}

	@HostListener('mousemove', ['$event']) onMouseMove(e: MouseEvent) {
		if (!this.dragging) {
			return;
		}
	}

	@HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent) {
		this.dragging = false;
	}

	@HostListener('contextmenu', ['$event']) onContextMenu(e: MouseEvent) {
		e.stopPropagation();
	}

	ngOnChanges() {
		this.height = (this.svgSize[1] * this.svgSize[1]) / ((this.zoom * this.zoom) * (this.border[1][1] - this.border[0][1]));
		this.y = (this.offset[1] / this.zoom) / (this.border[1][1] * this.zoom - this.svgSize[1]) * (this.svgSize[1] - this.height);
	}
}

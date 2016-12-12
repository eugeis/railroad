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
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { Railroad, Station } from './railroad.service';
import { ContextMenuStatus } from './contextmenu/contextmenu.interface';
import { frame, calcTranslate, cursorPoint, getFactor } from './railroad.functions';

var xmlns = "http://www.w3.org/2000/svg";

interface EventInterface<T> {
	(e: T): void;
}

@Component({
	selector: 'ee-zoomable-svg',
	styles: [`
		svg {
			width: 100%;
			height: 100%;
			border: 1px solid #000;
		}

		svg.dragging {
			cursor: move;
		}
	`],
	template: `
		<svg [ngClass]="{'dragging': dragging}">
			<g [attr.transform]="'translate(' + -offset[0] + ',' + -offset[1] + ')scale(' + zoom + ')'">
				<ng-content></ng-content>
			</g>
			<ng-content select=".svg-content-stationary"></ng-content>
		</svg>
	`
})

export class ZoomableSVGComponent implements OnInit {
	@Input() zoom: number = 1;
	@Input() offset: [number, number] = [0,0];
	@Input() border: [[number, number],[number, number]] = [[0,0],[2000,2000]];

	@Input() contextMenu: ContextMenuStatus = {
		show: false,
		items: [],
		x: 0,
		y: 0,
		target: null
	};

	@Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();
	@Output() offsetChange: EventEmitter<[number,number]> = new EventEmitter<[number,number]>();

	dragging: boolean = false;

	svg: any;
	pt: SVGPoint;
	svgSize: [number, number];

	constructor(private er: ElementRef) { }

	@HostListener('mousewheel', ['$event'])
	onMouseWheel(e: WheelEvent) {
		this.contextMenu.show = false;
		this.zooming(cursorPoint(this.svg, this.pt, e), getFactor(e.deltaY));
	}

	@HostListener('contextmenu', ['$event']) onContextMenu(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
	}

	@HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
		if (e.button != 0) {
			return
		}
		this.dragging = true;
	}

	@HostListener('mousemove', ['$event']) onMouseMove(e: MouseEvent) {
		if (!this.dragging) {
			return;
		}
		this.panning([-e.movementX, -e.movementY]);
	}

	@HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent) {
		this.dragging = false;
	}

	@HostListener("window:resize") onResize() {
		this.svgSize = [this.svg.clientWidth, this.svg.clientHeight];
	}

	ngOnInit() {
		this.svg = this.er.nativeElement.querySelector("svg");
		this.pt = this.svg.createSVGPoint();

		this.onResize();
	}

	zooming(mousePos: [number, number], factor: number) {
		let oldzoom: number = this.zoom;

		this.zoom *= factor;
		if (this.border) {
			this.zoom = this.applyZoomConstraints(this.zoom);
		}

		this.offset = calcTranslate(mousePos, oldzoom, this.zoom, this.offset);
		if (this.border) {
			this.offset = this.applyOffsetConstraints(this.offset);
		}

		this.zoomChange.emit(this.zoom);
		this.offsetChange.emit(this.offset);
	}

	/*
	 * Translate and move are not affected by the zoom
	 * There needs to be no conversion between browser- / svg-space
	 */
	panning(movement: [number, number]) {
		this.offset[0] += movement[0];
		this.offset[1] += movement[1];

		if (this.border) {
			this.offset = this.applyOffsetConstraints(this.offset);
		}

		this.offsetChange.emit(this.offset);
	}

	applyZoomConstraints(zoom: number): number {
		zoom = frame(zoom, this.svgSize[0] / (this.border[1][0] - this.border[0][0]), zoom);
		zoom = frame(zoom, this.svgSize[1] / (this.border[1][1] - this.border[0][1]), zoom);
		return zoom;
	}

	applyOffsetConstraints(offset: [number, number]): [number, number] {
		return [
			frame(offset[0], this.border[0][0] * this.zoom, this.border[1][0] * this.zoom - this.svgSize[0]),
			frame(offset[1], this.border[0][1] * this.zoom, this.border[1][1] * this.zoom - this.svgSize[1])
		];
	}

	select(item: string) {
		console.log(item);
	}

	onDestroy() { }
}

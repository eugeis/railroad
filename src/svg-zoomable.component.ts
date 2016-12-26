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
import { ContextMenuStatus } from './contextmenu/contextmenu.interface';
import { frame, getFactor, cursorPoint, calcTranslateOnZoom, calcTranslateOnPan, applyZoomConstraints, applyTranslateConstraints } from './svg-zoomable.functions';

interface EventInterface<T> {
	(e: T): void;
}

@Component({
	selector: 'ee-zoomable-svg',
	styles: [`
		svg {
			display: flex;
			flex: 1;
			border: 1px solid #000;
		}

		svg.dragging {
			cursor: move;
		}

		.scrollbar-group .scrollbar.vertical {
			fill: black;
		}

		.scrollbar-group .scrollbar.horizontal {
			fill: red;
		}
	`],
	template: `
		<svg [ngClass]="{'dragging': dragging}">
			<g [attr.transform]="'translate(' + translate[0] + ',' + translate[1] + ')scale(' + zoom + ')'">
				<ng-content></ng-content>
			</g>
			<g [attr.transform]="'translate(' + translate[0] + ',0)scale(' + zoom + ')'">
				<ng-content select=".svg-content-y-stationary"></ng-content>
			</g>
			<ng-content select=".svg-content-stationary"></ng-content>
		</svg>
	`
})

export class ZoomableSVGComponent implements OnInit {
	@Input() zoom: number = 1;
	@Input() translate: [number, number] = [0,0];
	@Input() border: [[number, number],[number, number]];

	@Input() contextMenu: ContextMenuStatus = {
		show: false,
		items: [],
		x: 0,
		y: 0,
		target: null
	};

	@Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();
	@Output() translateChange: EventEmitter<[number,number]> = new EventEmitter<[number,number]>();

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

	@HostListener('dblclick', ['$event']) onDoubleClick(e: MouseEvent) {
		this.contextMenu.show = false;
		this.zooming(cursorPoint(this.svg, this.pt, e), ((e.ctrlKey) ? 0.8 : 1.2));
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

	@HostListener('window:mousemove', ['$event']) onMouseMove(e: MouseEvent) {
		if (!this.dragging) {
			return;
		}
		this.panning([e.movementX, e.movementY]);
	}

	@HostListener('window:mouseup', ['$event']) onMouseUp(e: MouseEvent) {
		this.dragging = false;
	}

	@HostListener("window:resize") onResize() {
		this.svgSize = [this.svg.clientWidth, this.svg.clientHeight];

		if (this.border) {
			this.zoom = applyZoomConstraints(this.zoom, this.svgSize, this.border);
			this.translate = applyTranslateConstraints(this.translate, this.zoom, this.svgSize, this.border);
		}
	}

	ngOnInit() {
		this.svg = this.er.nativeElement.querySelector("svg");
		this.pt = this.svg.createSVGPoint();

		this.onResize();
	}

	zooming(mousePos: [number, number], factor: number) {
		this.zoom *= factor;
		if (this.border) {
			this.zoom = applyZoomConstraints(this.zoom, this.svgSize, this.border);
		}

		this.translate = calcTranslateOnZoom(mousePos, this.translate, factor);
		if (this.border) {
			this.translate = applyTranslateConstraints(this.translate, this.zoom, this.svgSize, this.border);
		}

		this.zoomChange.emit(this.zoom);
		this.translateChange.emit(this.translate);
	}

	/*
	 * Translate and move are not affected by the zoom
	 * There needs to be no conversion between browser- / svg-space
	 */
	panning(movement: [number, number]) {
		this.translate = calcTranslateOnPan(this.translate, movement);

		if (this.border) {
			this.translate = applyTranslateConstraints(this.translate, this.zoom, this.svgSize, this.border);
		}

		this.translateChange.emit(this.translate);
	}

	select(item: string) {
		console.log(item);
	}

	onDestroy() { }
}

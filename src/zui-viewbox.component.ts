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
import { ZUIViewboxService } from './zui-viewbox.service';
import { cursorPoint } from './svg.functions';

var xmlns = "http://www.w3.org/2000/svg";

interface EventInterface<T> {
	(e: T): void;
}

@Component({
	selector: 'ee-railroad-svg',
	styles: [`
		svg {
			border: 1px solid #000;
			display: flex;
			flex: 1;
		}

		svg.dragging {
			cursor: move;
		}

		svg.dragging text, svg.dragging tspan {
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}
	`],
	template: `
		<svg [ngClass]="{'dragging': dragging}"
			[attr.viewBox]="offset[0] + ' ' + offset[1] + ' ' + svgSize[0] / zoom + ' ' + svgSize[1] / zoom"
			preserveAspectRatio="none">
			<ng-content></ng-content>
		</svg>
		<context-menu [contextMenu]="contextMenu"></context-menu>
	`
})

export class ZUIViewboxComponent implements OnInit {
	@Input() zoom: number = 1;
	@Input() offset: [number, number] = [0,0];
	@Input() border: [[number,number],[number,number]];

	@Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();
	@Output() offsetChange: EventEmitter<[number,number]> = new EventEmitter<[number,number]>();

	contextMenu: ContextMenuStatus = {
		show: false,
		items: [],
		x: 0,
		y: 0,
		target: undefined
	};

	dragging: boolean = false;

	svg: any;
	pt: SVGPoint;
	svgSize: [number, number];

	constructor(private er: ElementRef, private vb: ZUIViewboxService) { }

	@HostListener('mousewheel', ['$event'])
	onMouseWheel(e: WheelEvent) {
		this.contextMenu.show = false;
		this.zooming(cursorPoint(this.svg, this.pt, e), this.vb.getZoomFactor(e.deltaY));
	}

	@HostListener('click', ['$event']) onClick() {
		this.contextMenu.show = false;
	}

	@HostListener('contextmenu', ['$event']) onContextMenu(e: MouseEvent) {
		//e.stopPropagation();
		//e.preventDefault();
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

	@HostListener('window:resize') onResize() {
		this.svgSize = [this.svg.clientWidth, this.svg.clientHeight];

		if (this.border) {
			this.zoom = this.vb.applyZoomConstraints(this.zoom, this.svgSize, this.border);
			this.offset = this.vb.applyOffsetConstraints(this.offset, this.zoom, this.svgSize, this.border);
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
			this.zoom = this.vb.applyZoomConstraints(this.zoom, this.svgSize, this.border);
		}

		this.offset = this.vb.zoom(mousePos, this.offset, factor);
		if (this.border) {
			this.offset = this.vb.applyOffsetConstraints(this.offset, this.zoom, this.svgSize, this.border);
		}

		this.zoomChange.emit(this.zoom);
		this.offsetChange.emit(this.offset);
	}

	panning(movement: [number, number]) {
		this.offset = this.vb.pan(movement, this.zoom, this.offset);

		if (this.border) {
			this.offset = this.vb.applyOffsetConstraints(this.offset, this.zoom, this.svgSize, this.border);
		}
		this.offsetChange.emit(this.offset);
	}

	select(item: string) {
		console.log(item);
	}

	onDestroy() { }
}

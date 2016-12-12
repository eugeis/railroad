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

import { pan, zoom, frame, getZoomFactor, cursorPoint } from './railroad.functions';
import { RailroadService, Railroad, Station } from './railroad.service';

var xmlns = "http://www.w3.org/2000/svg";

interface EventInterface<T> {
	(e: T): void;
}

@Component({
	selector: 'ee-railroad-svg',
	styles: [`
		svg {
			width: 600px;
			height: 600px;
			border: 1px solid #000;
			position: relative;
			display: block;
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

		.track, svg line {
			fill: transparent;
			stroke: black;
			stroke-width: 2;
			pointer-events: stroke;
		}
		.station {
			background: black;
			height: 15px;
			outline: 1px solid #fff;
		}
		.stationLabel {
			text-anchor: middle;
			font-size: 18pt;
			fill: #ffffff;
		}
	`],
	template: `
		<svg [ngClass]="{'dragging': dragging}"
			[attr.viewBox]="offset[0] + ' ' + offset[1] + ' ' + svgSize[0] / zoom[0] + ' ' + svgSize[1] / zoom[1]"
			preserveAspectRatio="none">
			<g svg-firefox [attr.transform]="'translate(' + border[0][0] + ', ' + border[0][1] + ')'"></g>
			<g svg-firefox [attr.transform]="'translate(' + border[0][0] + ', ' + (border[1][1]-150) + ')'"></g>
			<g svg-firefox [attr.transform]="'translate(' + (border[1][0]-150) + ', ' + border[0][1] + ')'"></g>
			<g svg-firefox [attr.transform]="'translate(' + (border[1][0]-150) + ', ' + (border[1][1]-150) + ')'"></g>
			<g svg-germany></g>
		<context-menu [contextMenu]="contextMenu"></context-menu>
	`
})

export class RailroadSVGComponent implements OnInit {
	@Input() zoom: [number, number] = [1,1];
	@Input() offset: [number, number] = [0,0];

	@Output() zoomChange: EventEmitter<[number,number]> = new EventEmitter<[number,number]>();
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

	border: [[number, number],[number, number]] = [[0,0],[1875,1000]];

	railroad: Railroad;
	stations: Station[];

	lines: string[] = [];

	constructor(private rs: RailroadService, private er: ElementRef) { }

	@HostListener('mousewheel', ['$event'])
	onMouseWheel(e: WheelEvent) {
		this.contextMenu.show = false;
		this.zooming(cursorPoint(this.svg, this.pt, e), getZoomFactor(e.deltaY));
	}

	@HostListener('click', ['$event']) onClick() {
		this.contextMenu.show = false;
		//this.zooming([200, 200], 2);
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
	}

	ngOnInit() {
		this.svg = this.er.nativeElement.querySelector("svg");
		this.pt = this.svg.createSVGPoint();

		this.railroad = this.rs.getRailroad();
		this.stations = this.rs.getAllStations();
		this.stations.reduce((sum: number, currentStation: Station) => {
			currentStation.x = sum;
			return sum + currentStation.width;
		}, 0);

		this.onResize();
	}

	zooming(mousePos: [number, number], factor: number) {
		this.zoom[0] *= factor;
		this.zoom[1] *= factor;		
		this.offset = zoom(mousePos, this.offset, factor);

		this.zoomChange.emit(this.zoom);
		this.offsetChange.emit(this.offset);
	}

	panning(movement: [number, number]) {
		this.offset = pan(movement, this.zoom, this.offset, this.svgSize, this.border);
		this.offsetChange.emit(this.offset);
	}

	select(item: string) {
		console.log(item);
	}

	onDestroy() { }
}

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

import { frame, calcTranslate, cursorPoint, calcZoom } from './railroad.functions';
import { RailroadService, Railroad, Station } from './railroad.service';

var xmlns = "http://www.w3.org/2000/svg";

interface EventInterface<T> {
	(e: T): void;
}

@Component({
	selector: 'ee-railroad-svg',
	styles: [`
		svg {
			width: inherit;
			height: inherit;
			border: 1px solid #000;
			position: relative;
			display: block;
		}

		svg.dragging {
			cursor: move;
		}

		svg.dragging .stationLabel {
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
			[attr.viewBox]="translate[0] + ' ' + translate[1] + ' 500 200'"
			preserveAspectRatio="none">
			<g>
			<!--<g [attr.transform]="'translate(' + translate[0] + ',' + 0 + ')scale(' + zoom[0] + ',1)'">-->
				<g *ngFor="let station of stations">
					<line [attr.x1]="station.x" y1="0" [attr.x2]="station.x" y2="1000" style="stroke:rgb(188,188,188);stroke-width:2" class="station" />
					<rect [attr.x]="station.x - (station.width / 4)" [attr.width]="station.width / 2" y="0" height="32" style="fill:black;" class="stationBackground" />
					<text [attr.x]="station.x" y="18" class="stationLabel">
						{{station.name}}
					</text>
				</g>
			</g>
			<!--<g [attr.transform]="'translate(' + translate[0] + ',' + translate[1] + ')scale(' + zoom[0] + ',' + zoom[1] + ')'">-->
			<!--<g>
				<path class="track"
					*ngFor="let line of lines"
					[attr.d]="line"
					[items]="['New line', 'Delete line', 'Hahahaha']"
					[contextMenu]="contextMenu"
					contextable>
				</path>
			</g>-->
		<context-menu [contextMenu]="contextMenu"></context-menu>
	`
})

export class RailroadSVGComponent implements OnInit {
	@Input() zoom: [number, number] = [1,1];
	@Input() translate: [number, number] = [0,0];

	@Output() zoomChange: EventEmitter<[number,number]> = new EventEmitter<[number,number]>();
	@Output() translateChange: EventEmitter<[number,number]> = new EventEmitter<[number,number]>();

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

	railroad: Railroad;
	stations: Station[];

	stationWidth: number = 0;
	minZoom: number = 1;

	lines: string[] = [];

	constructor(private rs: RailroadService, private er: ElementRef) { }

	@HostListener('mousewheel', ['$event'])
	onMouseWheel(e: WheelEvent) {
		this.contextMenu.show = false;
		this.zooming(cursorPoint(this.svg, this.pt, e), e.deltaY);
	}

	@HostListener('click', ['$event']) onClick() {
		this.contextMenu.show = false;
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

	@HostListener('window:resize') onResize() {
		this.svgSize = [this.svg.clientWidth, this.svg.clientHeight];

		if (this.stationWidth) {
			this.minZoom = this.svgSize[0] / this.stationWidth;

			if (this.zoom[0] < this.minZoom || this.zoom[1] < this.minZoom) {
				this.zoom[0] = this.minZoom;
				this.zoom[1] = this.minZoom;
			}
		}
	}

	ngOnInit() {
		this.svg = this.er.nativeElement.querySelector("svg");
		this.pt = this.svg.createSVGPoint();

		this.railroad = this.rs.getRailroad();
		this.stations = this.rs.getAllStations();
		this.stationWidth = this.stations.reduce((sum: number, currentStation: Station) => {
			currentStation.x = sum;
			return sum + currentStation.width;
		}, 0);

		this.onResize();
	}

	zooming(mousePos: SVGPoint, delta: number) {
		let oldzoom: [number, number] = this.zoom;

		this.zoom = calcZoom(delta, oldzoom);
		this.zoom[0] = Math.max(this.zoom[0], this.minZoom);
		this.zoom[1] = Math.max(this.zoom[1], this.minZoom);

		this.setTranslate(calcTranslate(mousePos, oldzoom, this.zoom, this.translate));
		this.zoomChange.emit(this.zoom);
		this.translateChange.emit(this.translate);
	}

	/*
	 * Translate and move are not affected by the zoom
	 * There needs to be no conversion between browser- / svg-space
	 */
	panning(movement: [number, number]) {
		this.setTranslate([
			this.translate[0] + movement[0],
			this.translate[1] + movement[1]
		]);
		this.translateChange.emit(this.translate);
	}

	select(item: string) {
		console.log(item);
	}

	setTranslate(translate: [number, number]) {
		if (translate[0] < 0) {
			translate[0] = 0
		}
		if (translate[1] < 0) {
			translate[1] = 0
		}
		if (translate[0] < this.stationWidth * this.zoom[0] + this.svgSize[0]) {
//			translate[0] = this.stationWidth * this.zoom[0] + this.svgSize[0]
		}

		this.translate[0] = translate[0];
		this.translate[1] = translate[1];
	}

	onDestroy() { }
}

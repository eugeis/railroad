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
import { frame, calcTranslate, cursorPoint, calcZoom } from './railroad.functions';

var xmlns = "http://www.w3.org/2000/svg";

interface EventInterface<T> {
	(e: T): void;
}

@Component({
	selector: 'ee-railroad-svg',
	styles: [`
		svg {
			width: 100%;
			height: 100%;
			border: 1px solid #000;
		}

		svg.dragging {
			cursor: move;
		}

		.track {
			fill: transparent;
			stroke: black;
			stroke-width: 2;
			pointer-events: stroke;
		}
	`],
	template: `
		<svg [ngClass]="{'dragging': dragging}">
			<g [attr.transform]="'translate(' + translate[0] + ',' + translate[1] + ')scale(' + zoom[0] + ',' + zoom[1] + ')'">
				<path class="track"
					*ngFor="let track of mockup"
					[attr.d]="track"
					[items]="['New line', 'Delete line', 'Hahahaha']"
					[contextMenu]="contextMenu"
					contextable>s d
				</path>
			</g>
		</svg>
		<context-menu [contextMenu]="contextMenu"></context-menu>
	`
})

export class RailroadSVGComponent implements OnInit {
	@Input() railroad: Railroad;
	@Input() stations: Station[];

	@Input() zoom: [number, number] = [1,1];
	@Input() translate: [number, number];

	@Output() zoomChange: EventEmitter<[number,number]> = new EventEmitter<[number,number]>();
	@Output() translateChange: EventEmitter<[number,number]> = new EventEmitter<[number,number]>();

	mockup: any[] = [
		/*"M 100 100 h 100 v 100 h -100 Z",
		"M 400 200 h 100 v 100 h -100 Z",
		"M 800 600 h 100 v 100 h -100 Z",
		"M 800 200 h 100 v 100 h -100 Z",
		"M 300 600 h 100 v 100 h -100 Z",
		"M10 10 C 20 80, 40 20, 50 10",
		"M70 10 C 70 20, 120 20, 520 10",
		"M130 10 C 20 320, 180 220, 170 10",
		"M180 60 C 570 480, 170 80, 120 60",
		"M250 60 C 120 280, 780 80, 670 60"*/
	];

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

	constructor(private er: ElementRef) { }

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
		this.panning([e.movementX, e.movementY]);
	}

	@HostListener('mouseup', ['$event']) onMouseUp(e: MouseEvent) {
		this.dragging = false;
	}

	ngOnInit() {
		this.svg = this.er.nativeElement.querySelector("svg");
		this.pt = this.svg.createSVGPoint();
	}

	zooming(mousePos: SVGPoint, delta: number) {
		let oldzoom: [number, number] = this.zoom;

		this.zoom = calcZoom(delta, oldzoom);
		this.translate = calcTranslate(mousePos, oldzoom, this.zoom, this.translate);
		this.zoomChange.emit(this.zoom);
		this.translateChange.emit(this.translate);
	}

	/*
	 * Translate and move are not affected by the zoom
	 * There needs to be no conversion between browser- / svg-space
	 */
	panning(movement: [number, number]) {
		this.translate = [
			this.translate[0] + movement[0],
			this.translate[1] + movement[1]
		];
		this.translateChange.emit(this.translate);
	}

	select(item: string) {
		console.log(item);
	}

	onDestroy() { }
}

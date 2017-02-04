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
	Output,
	EventEmitter,
	ElementRef,
	HostListener,
	ChangeDetectorRef,
	ChangeDetectionStrategy
} from '@angular/core';

import { ContextMenuStatus } from './contextmenu/contextmenu.interface';

import { ZoomGridService } from './zoomgrid.service';
import { ZUIService } from './zui.service';
import { Coordinate, Border, Padding } from './types.model';
import { cursorPoint } from './svg.functions';

interface EventInterface<T> {
	(e: T): void;
}

@Component({
	selector: 'ee-zui',
	styles: [`
		:host {
			display: flex;
			flex: 1;
		}

		svg {
			display: flex;
			flex: 1;
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
		<svg xmlns="http://www.w3.org/2000/svg" [ngClass]="{'dragging': dragging}" baseProfile="tiny">
			<g class="stationary">
				<ng-content select=".svg-content.stationary"></ng-content>
			</g>

			<g class="x-stationary" [attr.transform]="'translate(0,' + (translate.y + padding.up) + ')scale(' + zoom + ')'">
				<ng-content select=".svg-content-x-stationary"></ng-content>
			</g>

			<g class="y-stationary" [attr.transform]="'translate(' + (translate.x + padding.left) + ',0)scale(' + zoom + ')'">
				<ng-content select=".svg-content-y-stationary"></ng-content>
			</g>

			<g [attr.transform]="'translate(' + (translate.x + padding.left) + ',' + (translate.y + padding.up) + ')scale(' + zoom + ')'">
				<ng-content></ng-content>
			</g>

			<g *ngIf="border && contentSize" class="scrollbars">
				<g ee-svg-scrollbar
					[horizontal]="true"
					[contentSize]="contentSize"
					[zoom]="zoom"
					[border]="border"
					[translate]="translate"
					[padding]="padding"
					[positionOffset]="padding.up + contentSize.y - 10"
					(onScroll)="handleScroll($event)">
				</g>
				<g ee-svg-scrollbar
					[contentSize]="contentSize"
					[zoom]="zoom"
					[border]="border"
					[translate]="translate"
					[padding]="padding"
					[positionOffset]="padding.left + contentSize.x - 10"
					(onScroll)="handleScroll($event)">
				</g>
			</g>
		</svg>
		<context-menu *ngIf="contextMenu" [contextMenu]="contextMenu" (select)="handleSelect($event)"></context-menu>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ZUIComponent implements OnInit, OnDestroy {
	@Input() zoom: number = 1;
	@Input() translate: Coordinate = new Coordinate(0,0);
	@Input() padding: Padding = new Padding(0,0,0,0);
	@Input() border: Border;
	@Input() contextMenu: ContextMenuStatus;
	@Input() maxZoom: number;

	@Output("translateChange") translateEmitter: EventEmitter<Coordinate> = new EventEmitter<Coordinate>();
	@Output("zoomChange") zoomEmitter: EventEmitter<number> = new EventEmitter<number>();
	@Output("contextMenuChange") contextMenuEmitter: EventEmitter<ContextMenuStatus> = new EventEmitter<ContextMenuStatus>();
	@Output("onResize") resizeEmitter: EventEmitter<[Coordinate, Coordinate]> = new EventEmitter<[Coordinate, Coordinate]>();
	@Output("onContextSelect") contextSelectEmitter: EventEmitter<any> = new EventEmitter<any>();

	dragging: boolean = false;

	svg: any;
	pt: SVGPoint;
	svgSize: Coordinate;
	contentSize: Coordinate;

	eventFunctions: [string, Function][] = [
		["mousewheel", this.onMouseWheel.bind(this)],
		["dbclick", this.onDoubleClick.bind(this)],
		["contextmenu", this.onContextMenu.bind(this)],
		["keydown", this.onKeyDown.bind(this)],
		["mousedown", this.onMouseDown.bind(this)],
		["mousemove", this.onMouseMove.bind(this)],
		["mouseup", this.onMouseUp.bind(this)]
	];

	@HostListener("window:resize") onResize() {
		this.svgSize = new Coordinate(this.svg.clientWidth, this.svg.clientHeight);
		this.contentSize = new Coordinate(
			this.svgSize.x - this.padding.right - this.padding.left,
			this.svgSize.y - this.padding.up - this.padding.down
		);
		this.resizeEmitter.emit([this.svgSize, this.contentSize]);

		if (this.border) {
			this.zoom = this.tr.limitZoom(this.zoom, this.contentSize, this.border);
			this.translate = this.tr.limitTranslate(this.translate, this.zoom, this.contentSize, this.border);
			this.zoomEmitter.emit(this.zoom);
			this.translateEmitter.emit(this.translate);
		}
	}

	constructor(
		private tr: ZUIService,
		private er: ElementRef,
		private cd: ChangeDetectorRef,
		private zg: ZoomGridService
	) { }

	/**
	 * Initialization and Deletion
	 */
	ngOnInit() {
		this.svg = this.er.nativeElement.querySelector("svg");
		this.pt = this.svg.createSVGPoint();

		this.eventFunctions.forEach((d: [string, Function]) => {
			this.svg.addEventListener(d[0], d[1]);
		});

		this.zoomEmitter.subscribe((zoom: number) => {
			this.zg.zoomChange(zoom);
			this.cd.markForCheck();
		});

		this.translateEmitter.subscribe((zoom: number) => {
			this.cd.markForCheck();
		});

		this.resizeEmitter.subscribe((zoom: number) => {
			this.cd.markForCheck();
		});

		this.onResize();
	}

	ngOnDestroy() {
		this.eventFunctions.forEach((d: [string, Function]) => {
			this.svg.removeEventListener(d[0], d[1]);
		});
	}

	/**
	 * Zooming and Panning
	 */
	zooming(mousePos: Coordinate, factor: number) {
		let oldZoom = this.zoom;
		this.zoom *= factor;

		if (this.border) {
			this.zoom = this.tr.limitZoom(this.zoom, this.contentSize, this.border, this.maxZoom);
			factor = this.zoom / oldZoom;
		}

		mousePos = new Coordinate(
			mousePos.x - this.padding.left,
			mousePos.y - this.padding.up
		);

		this.translate = this.tr.zoom(mousePos, this.translate, factor);
		if (this.border) {
			this.translate = this.tr.limitTranslate(this.translate, this.zoom, this.contentSize, this.border);
		}

		this.zoomEmitter.emit(this.zoom);
		this.translateEmitter.emit(this.translate);
	}

	panning(movement: Coordinate) {
		this.translate = this.tr.pan(this.translate, movement);

		if (this.border) {
			this.translate = this.tr.limitTranslate(this.translate, this.zoom, this.contentSize, this.border);
		}

		this.translateEmitter.emit(this.translate);
	}

	/**
	 * ContextMenu
	 */
	showContextMenu(e: MouseEvent): void {
		this.contextMenuEmitter.emit({
			show: true,
			items: [
				["Back", "back"],
				["Forward", "forward"],
				["Save as...", "save_as"],
				["Print ...", "print"]
			],
			x: e.layerX,
			y: e.layerY
		});
	}

	hideContextMenu(): void {
		this.contextMenuEmitter.emit({show: false});
	}

	handleSelect(e: any) {
		this.contextSelectEmitter.emit(e);
	}

	/**
	 * Scrolling
	 */
	handleScroll(translate: Coordinate) {
		this.translate = translate;
		this.translateEmitter.emit(translate);
	}

	/**
	 * Eventhandlers
	 */
	onMouseWheel(e: WheelEvent) {
		this.hideContextMenu();
		if (e.shiftKey) {
			this.zooming(cursorPoint(this.svg, this.pt, e), this.tr.getZoomFactor(e.deltaY));
		} else {
			this.panning(new Coordinate(-e.deltaX, -e.deltaY));
		}
	}

	onDoubleClick(e: MouseEvent) {
		this.zooming(cursorPoint(this.svg, this.pt, e), ((e.ctrlKey) ? 0.8 : 1.2));
	}

	onContextMenu(e: MouseEvent) {
		this.showContextMenu(e);
		e.stopPropagation();
		e.preventDefault();
	}

	onKeyDown(e: KeyboardEvent) {
		if (e.key === "PageUp") {
			this.panning(new Coordinate(0, 0.8 * this.contentSize.y));
		} else if (e.key === "PageDown"){
			this.panning(new Coordinate(0, -0.8 * this.contentSize.y));
		}
	}

	onMouseDown(e: MouseEvent) {
		this.hideContextMenu();
		if (e.button != 0) {
			return
		}
		this.dragging = true;
	}

	onMouseMove(e: MouseEvent) {
		if (!this.dragging) {
			return;
		}
		this.panning(new Coordinate(e.movementX, e.movementY));
	}

	onMouseUp(e: MouseEvent) {
		this.dragging = false;
	}
}

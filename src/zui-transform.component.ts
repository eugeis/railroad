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
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ContextMenuStatus } from './contextmenu/contextmenu.interface';
import { ZUITransformService } from './zui-transform.service';
import { frame, cursorPoint } from './svg.functions';

interface EventInterface<T> {
	(e: T): void;
}

@Component({
	selector: 'ee-zui-transform',
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
		<svg #svg xmlns="http://www.w3.org/2000/svg" [ngClass]="{'dragging': dragging}" baseProfile="tiny">
			<g [attr.transform]="'translate(' + (translate[0] + padding[3]) + ',' + (translate[1] + padding[0]) + ')scale(' + zoom + ')'">
				<ng-content></ng-content>
			</g>

			<g class="stationary">
				<ng-content select=".svg-content-stationary"></ng-content>
			</g>

			<g class="x-stationary" [attr.transform]="'translate(0,' + (translate[1] + padding[0]) + ')scale(' + zoom + ')'">
				<ng-content select=".svg-content-x-stationary"></ng-content>
			</g>

			<g class="y-stationary" [attr.transform]="'translate(' + (translate[0] + padding[3]) + ',0)scale(' + zoom + ')'">
				<ng-content select=".svg-content-y-stationary"></ng-content>
			</g>

			<g *ngIf="border" class="scrollbars">
				<g ee-svg-scrollbar
					[horizontal]="true"
					[contentSize]="contentSize[0]"
					[zoom]="zoom"
					[border]="[border[0][0],border[1][0]]"
					[(offset)]="translate[0]"
					[padding]="padding[3]"
					[positionOffset]="padding[0] + contentSize[1] - 10">
				</g>
				<g ee-svg-scrollbar
					[contentSize]="contentSize[1]"
					[zoom]="zoom"
					[border]="[border[0][1],border[1][1]]"
					[(offset)]="translate[1]"
					[padding]="padding[0]"
					[positionOffset]="padding[3] + contentSize[0] - 10">
				</g>
			</g>
		</svg>
	`
})

export class ZUITransformComponent implements OnInit {
	@ViewChild("svg") svgRef: ElementRef;
	@Input() zoom: number = 1;
	@Input() translate: [number, number] = [0,0];
	@Input() border: [[number, number],[number, number]];
	@Input() padding: [number, number, number, number] = [0,0,0,0];

	@Input() contextMenu: ContextMenuStatus;

	@Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();
	@Output() translateChange: EventEmitter<[number,number]> = new EventEmitter<[number,number]>();
	@Output("onResize") resizeEmitter: EventEmitter<[[number,number],[number,number]]> = new EventEmitter<[[number,number],[number,number]]>();

	dragging: boolean = false;

	svg: any;
	pt: SVGPoint;
	svgSize: [number, number];
	contentSize: [number, number];

	constructor(private tr: ZUITransformService) { }

	@HostListener('mousewheel', ['$event'])
	onMouseWheel(e: WheelEvent) {
		if (this.contextMenu) this.contextMenu.show = false;
		if (e.shiftKey) {
			this.zooming(cursorPoint(this.svg, this.pt, e), this.tr.getZoomFactor(e.deltaY));
		} else {
			this.panning([-e.deltaX, -e.deltaY]);
		}
	}

	@HostListener('dblclick', ['$event']) onDoubleClick(e: MouseEvent) {
		if (this.contextMenu) this.contextMenu.show = false;
		this.zooming(cursorPoint(this.svg, this.pt, e), ((e.ctrlKey) ? 0.8 : 1.2));
	}

	@HostListener('contextmenu', ['$event']) onContextMenu(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
	}

	@HostListener("window:keydown", ['$event']) onKeyDown(e: KeyboardEvent) {
		if (e.key === "PageUp") {
			this.panning([0, 0.8 * this.contentSize[1]]);
		} else if (e.key === "PageDown"){
			this.panning([0, -0.8 * this.contentSize[1]]);
		}
	}

	@HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
		if (this.contextMenu) this.contextMenu.show = false;
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
		this.contentSize = [
			this.svgSize[0] - this.padding[1] - this.padding[3],
			this.svgSize[1] - this.padding[0] - this.padding[2]
		];
		this.resizeEmitter.emit([this.svgSize, this.contentSize]);

		if (this.border) {
			this.zoom = this.tr.limitZoom(this.zoom, this.contentSize, this.border);
			this.translate = this.tr.limitTranslate(this.translate, this.zoom, this.contentSize, this.border);
		}
	}

	ngOnInit() {
		this.svg = this.svgRef.nativeElement;
		this.pt = this.svg.createSVGPoint();

		this.onResize();
	}

	zooming(mousePos: [number, number], factor: number) {
		let oldZoom = this.zoom;
		this.zoom *= factor;

		if (this.border) {
			this.zoom = this.tr.limitZoom(this.zoom, this.contentSize, this.border);
			factor = this.zoom / oldZoom;
		}

		mousePos[0] -= this.padding[3];
		mousePos[1] -= this.padding[0];

		this.translate = this.tr.zoom(mousePos, this.translate, factor);
		if (this.border) {
			this.translate = this.tr.limitTranslate(this.translate, this.zoom, this.contentSize, this.border);
		}

		this.zoomChange.emit(this.zoom);
		this.translateChange.emit(this.translate);
	}

	/*
	 * Translate and move are not affected by the zoom
	 * There needs to be no conversion between browser- / svg-space
	 */
	panning(movement: [number, number]) {
		this.translate = this.tr.pan(this.translate, movement);

		if (this.border) {
			this.translate = this.tr.limitTranslate(this.translate, this.zoom, this.contentSize, this.border);
		}

		this.translateChange.emit(this.translate);
	}

	select(item: string) {
		console.log(item);
	}

	onDestroy() { }
}

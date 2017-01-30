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
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ContextMenuStatus } from './contextmenu/contextmenu.interface';
import { ZUITransformService } from './zui-transform.service';
import { frame, cursorPoint } from './svg.functions';
import { Coordinate, Border, Padding } from './types.model';

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
		<svg xmlns="http://www.w3.org/2000/svg" [ngClass]="{'dragging': dragging}" baseProfile="tiny">
			<g class="stationary">
				<ng-content select="stationary"></ng-content>
			</g>

			<g class="x-stationary" [attr.transform]="'translate(0,' + (translate.y + padding.up) + ')scale(' + zoom + ')'">
				<ng-content select=".x-stationary"></ng-content>
			</g>

			<g class="y-stationary" [attr.transform]="'translate(' + (translate.x + padding.left) + ',0)scale(' + zoom + ')'">
				<ng-content select=".y-stationary"></ng-content>
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
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ZUITransformComponent implements OnInit {
	@Input() zoom: number;
	@Input() translate: Coordinate;
	@Input() padding: Padding;
	@Input() border: Border;
	@Input() contentSize: Coordinate;

	@Output("onZoom") zoomEmitter: EventEmitter<number> = new EventEmitter<number>();
	@Output("onTranslate") translateEmitter: EventEmitter<Coordinate> = new EventEmitter<Coordinate>();
	@Output("onContextMenu") contextMenuEmitter: EventEmitter<ContextMenuStatus> = new EventEmitter<ContextMenuStatus>();

	dragging: boolean = false;

	svg: any;
	pt: SVGPoint;

	constructor(private tr: ZUITransformService, private er: ElementRef) { }

	@HostListener('mousewheel', ['$event'])
	onMouseWheel(e: WheelEvent) {
		this.hideContextMenu();
		if (e.shiftKey) {
			this.zooming(cursorPoint(this.svg, this.pt, e), this.tr.getZoomFactor(e.deltaY));
		} else {
			this.panning(new Coordinate(-e.deltaX, -e.deltaY));
		}
	}

	@HostListener('dblclick', ['$event']) onDoubleClick(e: MouseEvent) {
		this.zooming(cursorPoint(this.svg, this.pt, e), ((e.ctrlKey) ? 0.8 : 1.2));
	}

	@HostListener('contextmenu', ['$event']) onContextMenu(e: MouseEvent) {
		this.showContextMenu(e);
		e.stopPropagation();
		e.preventDefault();
	}

	@HostListener("window:keydown", ['$event']) onKeyDown(e: KeyboardEvent) {
		if (e.key === "PageUp") {
			this.panning(new Coordinate(0, 0.8 * this.contentSize.y));
		} else if (e.key === "PageDown"){
			this.panning(new Coordinate(0, -0.8 * this.contentSize.y));
		}
	}

	@HostListener('mousedown', ['$event']) onMouseDown(e: MouseEvent) {
		this.hideContextMenu();
		if (e.button != 0) {
			return
		}
		this.dragging = true;
	}

	@HostListener('window:mousemove', ['$event']) onMouseMove(e: MouseEvent) {
		if (!this.dragging) {
			return;
		}
		this.panning(new Coordinate(e.movementX, e.movementY));
	}

	@HostListener('window:mouseup', ['$event']) onMouseUp(e: MouseEvent) {
		this.dragging = false;
	}

	ngOnInit() {
		this.svg = this.er.nativeElement.querySelector("svg");
		this.pt = this.svg.createSVGPoint();
	}

	zooming(mousePos: Coordinate, factor: number) {
		let oldZoom = this.zoom;
		this.zoom *= factor;

		if (this.border) {
			this.zoom = this.tr.limitZoom(this.zoom, this.contentSize, this.border);
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

	/*
	 * Translate and move are not affected by the zoom
	 * There needs to be no conversion between browser- / svg-space
	 */
	panning(movement: Coordinate) {
		this.translate = this.tr.pan(this.translate, movement);

		if (this.border) {
			this.translate = this.tr.limitTranslate(this.translate, this.zoom, this.contentSize, this.border);
		}

		this.translateEmitter.emit(this.translate);
	}

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

	handleScroll(translate: Coordinate) {
		this.translate = translate;
		this.translateEmitter.emit(translate);
	}
}

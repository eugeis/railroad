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
	Inject,
	OnInit,
	Input,
	Output,
	EventEmitter,
	HostListener,
	ViewChild,
	ElementRef,
	ChangeDetectionStrategy
} from '@angular/core';

import { ContextMenuStatus } from './contextmenu/contextmenu.interface';

import { ZUITransformService } from './zui-transform.service';
import { Coordinate, Border, Padding } from './types.model';

@Component({
	selector: 'ee-zui',
	styles: [`
		:host {
			display: flex;
			flex: 1;
		}
	`],
	template: `
		<ee-zui-transform
			[zoom]="zoom"
			[translate]="translate"
			[padding]="padding"
			[border]="border"
			[contentSize]="contentSize"
			(onZoom)="updateZoom($event)"
			(onTranslate)="updateTranslate($event)"
			(onContextMenu)="updateCtx($event)">
			<ng-content></ng-content>
			<ng-content select=".svg-content-y-stationary" class="y-stationary"></ng-content>
			<ng-content select=".svg-content-x-stationary" class="x-stationary"></ng-content>
		</ee-zui-transform>
		<context-menu [contextMenu]="contextMenu" (select)="onSelect($event)"></context-menu>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ZUIComponent implements OnInit {
	@Input() zoom: number = 1;
	@Input() translate: Coordinate = new Coordinate(0,0);
	@Input() padding: Padding = new Padding(0,0,0,0);
	@Input() border: Border;
	@Input() contextMenu: ContextMenuStatus;

	@Output("zoomChange") zoomEmitter: EventEmitter<number> = new EventEmitter<number>();
	@Output("translateChange") translateEmitter: EventEmitter<Coordinate> = new EventEmitter<Coordinate>();
	@Output("onResize") resizeEmitter: EventEmitter<[Coordinate, Coordinate]> = new EventEmitter<[Coordinate, Coordinate]>();
	@Output("onContextMenu") contextMenuEmitter: EventEmitter<ContextMenuStatus> = new EventEmitter<ContextMenuStatus>();
	@Output("onContextSelect") contextSelectEmitter: EventEmitter<any> = new EventEmitter<any>();

	zui: any;
	svgSize: Coordinate;
	contentSize: Coordinate;

	constructor(
		private tr: ZUITransformService,
		private er: ElementRef
	) { }

	ngOnInit() {
		this.zui = this.er.nativeElement;
		this.updateSize();
	}

	updateCtx(contextMenu: ContextMenuStatus) {
		this.contextMenu = contextMenu;
		this.contextMenuEmitter.emit(this.contextMenu);
	}

	updateZoom(zoom: number) {
		this.zoom = zoom
		this.zoomEmitter.emit(zoom);
	}

	updateTranslate(translate: Coordinate) {
		this.translate = translate;
		this.translateEmitter.emit(translate);
	}

	updateSize() {
		this.svgSize = new Coordinate(this.zui.clientWidth, this.zui.clientHeight);
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

	onSelect(e: any) {
		this.contextSelectEmitter.emit(e);
	}
}

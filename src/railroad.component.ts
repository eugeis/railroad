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
	HostListener,
	Inject,
	ElementRef,
	ViewChild
} from '@angular/core';

import { ContextMenuStatus } from './zui/contextmenu/contextmenu.interface';
import { ContextHandlerInterface } from './zui/contextmenu/contexthandler.interface';

import { ZUITransformService } from './zui/zui-transform.service';
import { ZUIComponent } from './zui/zui.component';
import { AxisServiceInterface } from './zui/axis.interface';
import { Coordinate, Border, Padding } from './zui/types.model';

import { Timetable } from './timetable.interface';
import { RailroadService } from './railroad.service';
import { ZoomGridService, GridResponse } from './zoomgrid.service';

//Relevant for ./railroad.service
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

var svgNS = "http://www.w3.org/2000/svg";

@Component({
	selector: 'ee-railroad',
	styles: [`
		.railroad {
			display: flex;
			flex: 1;
			height: 100%;
		}

		.svg-content-y-stationary rect, .svg-content-stationary rect {
			fill: white;
		}

		line {
			stroke: black;
		}

		line:hover {
			cursor: pointer;
		}

		text {
			user-select: none;
			fill: black;
		}

		context-menu {
			position: absolute;
			top: 0px;
		}
	`],
	template: `
		<div class="railroad">
			<ee-zui #zuiElement
				[(zoom)]="zoom"
				[(translate)]="translate"
				[maxZoom]="1000"
				[padding]="padding"
				[border]="border"
				[contextMenu]="contextMenu"
				(onZoomChange)="updateZoom($event)"
				(onContextMenu)="updateCtx($event)"
				(onContextSelect)="handleCtx($event)"
				(onResize)="updateSize($event)">

				<svg:g *ngIf="timetable" class="partialTrips"
					[pts]="timetable.partialTrips.all"
					[border]="border"
					(onContextMenu)="updateCtx($event)"
					partialTrips>
				</svg:g>

				<svg:g *ngIf="timetable" class="stopOrPasss"
					[sop]="timetable.stopOrPasss.all"
					[border]="border"
					(onContextMenu)="updateCtx($event)"
					stopOrPasss>
				</svg:g>

				<svg:g svg-time-indicator [border]="border">
				</svg:g>

				<svg:g *ngIf="timetable && showX" class="svg-content-y-stationary">
					<svg:g *ngFor="let station of timetable.stations; let i = index">
						<svg:text
							[attr.x]="coord.getX(station)"
							[attr.y]="24 / zoom"
							[attr.font-size]="20 / zoom">
							{{station}}
						</svg:text>
						<svg:line
							[attr.x1]="coord.getX(station)"
							[attr.y1]="padding.up / zoom"
							[attr.x2]="coord.getX(station)"
							[attr.y2]="svgSize.y / zoom"
							vector-effect="non-scaling-stroke">
						</svg:line>
					</svg:g>
				</svg:g>

				<svg:g *ngIf="showY" class="svg-content-x-stationary">
					<svg:g svg-time-axis
						[border]="border"
						[padding]="padding"
						[translate]="translate"
						[zoom]="zoom"
						[svgSize]="svgSize"
						[contentSize]="contentSize">
					</svg:g>
				</svg:g>

				<svg:rect *ngIf="show" x="500" y="400" width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
			</ee-zui>
		</div>
	`
})

export class RailroadComponent implements OnInit {
	@ViewChild("zuiElement") zuiRef: ZUIComponent;
	border: Border = new Border(new Coordinate(0,0), new Coordinate(2100,5000));
	padding: Padding = new Padding(30,0,0,75);
	translate: Coordinate = new Coordinate(0,0);
	zoom: number = 1;

	timetable: Timetable;
	svgSize: Coordinate;
	contentSize: Coordinate;

	showX: boolean = true;
	showY: boolean = true;
	show: boolean = false;

	partialTrip: any = {};

	contextMenu: ContextMenuStatus = { show: false };

	@HostListener("window:resize") onResize() {
		this.zuiRef.updateSize();
	}

	constructor(
		private rs: RailroadService,
		private tr: ZUITransformService,
		private zg: ZoomGridService,
		private er: ElementRef,
		@Inject('AxisServiceInterface') private coord: AxisServiceInterface<string, Date>,
		@Inject('ContextHandlerInterface') private ctxHandler: ContextHandlerInterface
	) { }

	ngOnInit() {
		this.rs.getTimetable().subscribe(tt => {
			this.timetable = tt;

			tt.partialTrips.all.forEach(partialTrip => {
				partialTrip.stopOrPasss.sort((a, b) => {
					return this.coord.getX(a.stationName) - this.coord.getX(b.stationName);
				});
			});
		});

		this.zg.notifyOn([1,2]).subscribe((resp: GridResponse) => {
			console.log(resp);
			this.show = (resp.zoom >= 2);
		});
	}

	updateCtx(contextMenu: ContextMenuStatus) {
		this.contextMenu = contextMenu;
	}

	updateSize(sizes: [Coordinate, Coordinate]) {
		this.svgSize = sizes[0];
		this.contentSize = sizes[1];
	}

	updateZoom(zoom: number) {
		this.zoom = zoom;
		this.zg.zoomChange(zoom);
	}

	handleCtx(e: any) {
		this.contextMenu = {show: false};
		this.ctxHandler.handle(e);
	}
}

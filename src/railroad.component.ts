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
import { Component, HostListener, DoCheck } from '@angular/core';

import { ContextMenuStatus } from './contextmenu/contextmenu.interface';
import { RailroadService } from './railroad.service';
import { Timetable } from './timetable.interface';

@Component({
	selector: 'ee-railroad',
	styles: [`
		.railroad {
			display: flex;
			flex: 1;
			height: 100%;
		}

		ee-zui-viewbox, ee-zui-transform {
			display: flex;
			flex: 1;
		}

		.svg-content-y-stationary rect, .svg-content-stationary rect {
			fill: white;
		}

		line {
			stroke: black;
			stroke-width: 2px;
		}

		text {
			user-select: none;
			fill: black;
		}
	`],
	template: `
	<div class="railroad">
		<ee-zui-transform
			[(zoom)]="zoom"
			[(translate)]="translate"
			[padding]="padding"
			[border]="border"
			[contextMenu]="contextMenu"
			(onResize)="updateSize($event)">
			<svg:g class="background">
				<svg:defs>
					<svg:pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
						<svg:path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5"/>
					</svg:pattern>
					<svg:pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
						<svg:rect width="100" height="100" fill="url(#smallGrid)"/>
						<svg:path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="1"/>
					</svg:pattern>
				</svg:defs>

				<svg:rect x="0" y="0" [attr.width]="border[1][0]" [attr.height]="border[1][1]" fill="url(#grid)" />
				<svg:rect x="100" y="100" [attr.width]="border[1][0] - 200" [attr.height]="border[1][1] - 200" style="fill:transparent; stroke: grey;"/>
				<svg:rect x="200" y="200" [attr.width]="border[1][0] - 400" [attr.height]="border[1][1] - 400" style="fill:transparent; stroke: red;"/>
			</svg:g>

			<svg:g class="routes">
				<svg:g *ngFor="let partialroute of routes">
					<svg:line *ngFor="let route of partialroute"
						[attr.x1]="route[0][0]"
						[attr.y1]="route[0][1]"
						[attr.x2]="route[1][0]"
						[attr.y2]="route[1][1]"
						[contextMenu]="contextMenu"
						[items]="['Hallo', 'wie', 'gehts', 'dir', '???']"
						contextable>
					</svg:line>
				</svg:g>
			</svg:g>

			<svg:g class="svg-content-y-stationary">
				<svg:text *ngFor="let station of timetable.stations; let i = index"
					[attr.x]="i * 100"
					[attr.y]="24 / zoom"
					[attr.font-size]="20 / zoom">
					{{station}}
				</svg:text>
			</svg:g>

			<svg:g class="svg-content-x-stationary">

			</svg:g>

			<svg:g class="svg-content-stationary">
				<svg:rect [attr.width]="svgSize[0]" [attr.height]="padding[0]" />
				<svg:rect [attr.width]="svgSize[0]" [attr.height]="padding[2]" [attr.y]="svgSize[1] - padding[2]" />
				<svg:rect [attr.width]="padding[1]" [attr.height]="svgSize[1]" [attr.x]="svgSize[0] - padding[1]" />
				<svg:rect [attr.width]="padding[3]" [attr.height]="svgSize[1]" />
			</svg:g>
		</ee-zui-transform>
		<context-menu [contextMenu]="contextMenu"></context-menu>
	</div>
	`
})

export class RailroadComponent implements DoCheck {
	border: [[number, number], [number, number]] = [[0,0],[2000,2000]];
	padding: [number, number, number, number] = [30,0,0,30];
	translate: [number, number] = [0,0];
	zoom: number = 1;

	timetable: Timetable;
	svgSize: [number, number] = [1366,675];

	oldZoom: number = 1;
	oldTranslate: number = 0;

	contextMenu: ContextMenuStatus = {
		show: false,
		items: [],
		x: 0,
		y: 0,
		target: null
	};

	routes: [[number,number],[number,number]][][] = [[
		[[0,0],[0,50]],
		[[0,50],[100,100]],
		[[100,100],[200,200]],
		[[200,200],[600,400]],
		[[600,400],[600,550]],
		[[600,550],[300,800]],
		[[300,800],[300,900]],
		[[300,900],[100,1000]]
	],[
		[[500,0],[500,100]],
		[[500,100],[900,200]],
		[[900,200],[900,450]],
		[[900,450],[1600,900]],
		[[1600,900],[1600,1000]]
	],[
		[[1500,0],[1500,250]],
		[[1500,250],[900,600]],
		[[900,600],[200,850]],
		[[200,850],[200,1000]]
	],[
		[[1900,0],[1900,50]],
		[[1900,50],[1800,200]],
		[[1800,200],[1700,300]],
		[[1700,300],[1500,450]],
		[[1500,450],[1300,600]],
		[[1300,600],[1100,850]],
		[[1100,850],[700,1000]],
		[[700,1000],[700,1200]],
		[[700,1200],[400,1500]],
		[[400,1500],[400,1650]],
		[[400,1650],[600,1750]],
		[[600,1750],[650,1900]],
		[[650,1900],[800,2000]]
	]];
	times: string[] = ["100","200","300","400","500","600","700"];

	constructor(private rs: RailroadService) {
		this.timetable = rs.getTimetable();
		this.border = [[0,0],[this.timetable.stations.length * 100, 1000]];
	}

	updateSize(svgSize: [number, number]) {
		this.svgSize = svgSize;
	}

	ngDoCheck() {
	}
}

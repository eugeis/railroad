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
import { Component, OnInit } from '@angular/core';

import { ContextMenuStatus } from './contextmenu/contextmenu.interface';
import { RailroadService } from './railroad.service';
import { Timetable } from './timetable.interface';

@Component({
	selector: 'ee-railroad',
	styles: [`
		ee-zoomable-svg {
			display: flex;
			flex: 1;
		}

		svg.dragging {
			cursor: grabbing;
		}

		.railroad {
			flex-direction: column;
			height: 100%;
		}

		.railroad > .main {
			flex-direction: row;
		}

		.railroad, .main, .window, .stations, .stations > div {
			display: flex;
			flex: 1;
		}

		.stations > div {
			justify-content: center;
			min-width: 100px;
		}

		.header {
			height: 30px;
		}

		.side {
			width: 30px;
		}

		span.zoom {
			position:absolute;
			top:0px;
		}

		span.zoom:hover {
			display:none;
		}

		.sides .header rect {
			width: 100%;
			height: 30px;
			fill: grey;
		}

		.track {
			fill: transparent;
			stroke: black;
			stroke-width: 2;
		}

		text {
			text-anchor: center;
			fill: red;
		}

		line {
			stroke: black;
			stroke-width: 3px;
		}
	`],
	template: `
	<div class="railroad">
		<ee-zoomable-svg [(zoom)]="zoom" [(translate)]="translate" [border]="border">
		<!--
			<svg:g class="svg-content-y-stationary">
				<svg:g *ngFor="let station of timetable.stations; let i = index">
					<svg:rect [attr.x]="i * 60 + 10" y="0" width="40" height="20"></svg:rect>
					<svg:line y1="0" [attr.y2]="border[1][1]" [attr.x1]="i * 60 + 30" [attr.x2]="i * 60 + 30" />
					<svg:text [attr.x]="i * 60 + 10" y="10">{{station}}</svg:text>
				</svg:g>
			</svg:g>

			<svg:line y1="100" y2="200" x1="210" x2="270" />
			<svg:line y1="150" y2="230" x1="270" x2="330" />
		-->

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

		</ee-zoomable-svg>
		<context-menu [contextMenu]="contextMenu"></context-menu>
	</div>
	`
})

export class RailroadComponent implements OnInit {
	zoom: number = 1;
	translate: [number, number] = [0,0];
	border: [[number, number], [number, number]];

	contextMenu: ContextMenuStatus = {
		show: false,
		items: [],
		x: 0,
		y: 0,
		target: undefined
	};

	timetable: Timetable;

	constructor(private rs: RailroadService) { }

	ngOnInit() {
		this.border = [[100,100],[2000,2000]];
		//this.timetable = this.rs.getTimetable();
		//this.border = [[0,0],[this.timetable.stations.length * 60, 1000]];
	}
}

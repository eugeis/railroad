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
import { RailroadService, Railroad, Station } from './railroad.service';

@Component({
	selector: 'ee-railroad',
	styles: [`
		ee-zoomable-svg {
			width: 100%;
			height: 100%;
			display: block;
		}

		svg {
			width: 100%;
			height: 100%;
			border: 1px solid #000;
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
	`],
	template: `
	<div class="railroad">
		<div class="header">
			<div class="stations">
				<div *ngFor="let station of stations">{{station}}</div>
			</div>
		</div>
		<div class="main">
			<div class="left side"></div>
			<div class="window">
				<ee-zoomable-svg [(zoom)]="zoom" [(offset)]="offset">
					<svg:g svg-united-states transform="translate(100,100)"></svg:g>
					<svg:g svg-united-states transform="translate(970,1300)"></svg:g>
					<svg:rect x="100" y="100" width="1800" height="1800" style="fill:transparent; stroke: grey;"/>
					<svg:rect x="200" y="200" width="1600" height="1600" style="fill:transparent; stroke: red;"/>
					<svg:defs>
						<svg:pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
							<svg:path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5"/>
						</svg:pattern>
						<svg:pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
							<svg:rect width="100" height="100" fill="url(#smallGrid)"/>
							<svg:path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="1"/>
						</svg:pattern>
					</svg:defs>
					<svg:rect x="0" y="0" width="2000" height="2000" fill="url(#grid)" />
				</ee-zoomable-svg>
				<context-menu [contextMenu]="contextMenu"></context-menu>
			</div>
			<div class="right side"></div>
		</div>
		<div class="footer">
			<input type="text" [(ngModel)]="zoom">
			<input type="text" [(ngModel)]="offset[0]">
			<input type="text" [(ngModel)]="offset[1]">
		</div>
	</div>
	`
})

export class RailroadComponent implements OnInit {
	zoom: number = 1;
	offset: [number, number] = [100, 100];

	contextMenu: ContextMenuStatus = {
		show: false,
		items: [],
		x: 0,
		y: 0,
		target: undefined
	};

	railroad: Railroad;
	stations: Station[];

	constructor(private rs: RailroadService) { }

	ngOnInit() {
		this.railroad = this.rs.getRailroad();
		this.stations = this.rs.getAllStations();
	}
}

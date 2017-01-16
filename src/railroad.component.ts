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
import { Component, OnInit, HostListener, DoCheck } from '@angular/core';

import { ContextMenuStatus } from './contextmenu/contextmenu.interface';
import { RailroadService } from './railroad.service';
import { Timetable } from './timetable.interface';

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

		/deep/ path {
			stroke: black;
			stroke-linecap: round;
		}

		/deep/ path.BEGIN {
			stroke: green;
		}

		/deep/ path.PASS {
			stroke: yellow;
		}

		/deep/ path.STOP {
			stroke: red;
		}

		/deep/ path.END {
			stroke: black;
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
			(onResize)="updateSize($event)"
			[contextMenu]="contextMenu"
			[items]="['ShowX', 'HideX', 'ShowY', 'HideY']"
			contextable>
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

				<!--
				<svg:rect x="0" y="0" [attr.width]="border[1][0]" [attr.height]="border[1][1]" fill="url(#grid)" />
				<svg:rect x="100" y="100" [attr.width]="border[1][0] - 200" [attr.height]="border[1][1] - 200" style="fill:transparent; stroke: grey;"/>
				<svg:rect x="200" y="200" [attr.width]="border[1][0] - 400" [attr.height]="border[1][1] - 400" style="fill:transparent; stroke: red;"/>
				<svg:line [attr.x1]="border[0][0]" [attr.y1]="(border[1][1] - border[0][1]) / 2" [attr.x2]="border[1][0]" [attr.y2]="(border[1][1] - border[0][1]) / 2" style="stroke-width: 4px; stroke: red;"/>
				-->
			</svg:g>

			<svg:g class="routes">
				<svg:g *ngIf="timetable">
<!--
					<svg:circle *ngFor="let stopOrPass of timetable.stopOrPasss.all"
						[attr.cx]="stopOrPass.x"
						[attr.cy]="stopOrPass.y"
						r="1"
						[ngClass]="stopOrPass.stopType">
					</svg:circle>
-->
				</svg:g>

				<!--<svg:g *ngFor="let partialroute of routes">
					<svg:line *ngFor="let route of partialroute"
						[attr.x1]="route[0][0]"
						[attr.y1]="route[0][1]"
						[attr.x2]="route[1][0]"
						[attr.y2]="route[1][1]"
						[style.stroke-width]="3 / zoom"
						[contextMenu]="contextMenu"
						[items]="['Hallo', 'wie', 'gehts', 'dir', '???']"
						contextable>
					</svg:line>
				</svg:g>-->
			</svg:g>

			<svg:g *ngIf="timetable && showX" class="svg-content-y-stationary">
				<svg:g *ngFor="let station of timetable.stations; let i = index">
					<svg:text
						[attr.x]="getXPosition(station)"
						[attr.y]="24 / zoom"
						[attr.font-size]="20 / zoom">
						{{station}}
					</svg:text>
					<svg:line
						[attr.x1]="i * 100"
						[attr.y1]="padding[0] / zoom"
						[attr.x2]="i * 100"
						[attr.y2]="svgSize[1] / zoom"
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

			<svg:g *ngIf="svgSize && padding" class="svg-content-stationary">
				<svg:rect [attr.width]="svgSize[0]" [attr.height]="padding[0]" />
				<svg:rect [attr.width]="svgSize[0]" [attr.height]="padding[2]" [attr.y]="svgSize[1] - padding[2]" />
				<svg:rect [attr.width]="padding[1]" [attr.height]="svgSize[1]" [attr.x]="svgSize[0] - padding[1]" />
				<svg:rect [attr.width]="padding[3]" [attr.height]="svgSize[1]" />
			</svg:g>
		</ee-zui-transform>
		<context-menu [contextMenu]="contextMenu" (select)="onSelect($event)"></context-menu>
	</div>
	`
})

export class RailroadComponent implements OnInit {
	border: [[number, number], [number, number]] = [[0,0],[2000,2000]];
	padding: [number, number, number, number] = [30,0,0,75];
	translate: [number, number] = [0,0];
	zoom: number = 1;

	timetable: Timetable;
	svgSize: [number, number];
	contentSize: [number, number];

	showX: boolean = true;
	showY: boolean = true;

	contextMenu: ContextMenuStatus = {
		show: false,
		items: [],
		x: 0,
		y: 0,
		target: null
	};

	topology = {
		"SYJ": 0,
		"1011": 100,
		"HXXJ": 200,
		"1010": 300,
		"AZM": 400,
		"1009": 500,
		"BTC": 600,
		"JDM": 700,
		"1007": 800,
		"1006": 900,
		"MDY": 1000,
		"XTC": 1100,
		"ZCLU": 1200,
		"ZCLI": 1300,
		"HDHZ": 1400,
		"1004": 1500,
		"SZJ": 1600,
		"1001": 1700,
		"BG": 1800,
		"PLU": 1900
	}

	constructor(private rs: RailroadService) { }

	ngOnInit() {
		this.rs.getTimetable().subscribe(tt => {
			this.timetable = tt;
			this.border = [[0,0],[2000, 5000]];

			let el = document.querySelector(".routes");

			for (let trip of tt.trips.all) {
				for (let partialTrip of trip.partialTrips) {
					let path = document.createElementNS("http://www.w3.org/2000/svg", "path");

					partialTrip.stopOrPasss.sort((a, b) => {
						return this.getXPosition(a.stationName) - this.getXPosition(b.stationName);
					});

					let d = partialTrip.stopOrPasss.reduce((prev: string, cur) => {
						let d = this.getXPosition(cur.stationName)
							+ " "
							+ this.getYPosition(<any>(cur.plannedArrivalTime || cur.plannedDepartureTime))
							+ " L "
							+ this.getXPosition(cur.stationName)
							+ " "
							+ this.getYPosition(<any>(cur.plannedDepartureTime || cur.plannedArrivalTime));

						return prev + "L " + d + " ";
					}, "M 0 0");

					path.setAttributeNS(null, "d", d);
					path.setAttributeNS(null, "stroke", "black");
					path.setAttributeNS(null, "fill", "none");
					path.setAttributeNS(null, "stroke-width", "2px");
					path.setAttributeNS(null, "vector-effect", "non-scaling-stroke");

					el.appendChild(path);
				}
			}

			for (let cur of tt.stopOrPasss.all) {
				let dot = document.createElementNS("http://www.w3.org/2000/svg", "path");
				let d = "M "
					+ this.getXPosition(cur.stationName)
					+ " "
					+ this.getYPosition(<any>(cur.plannedArrivalTime || cur.plannedDepartureTime))
					+ " L "
					+ this.getXPosition(cur.stationName)
					+ " "
					+ this.getYPosition(<any>(cur.plannedDepartureTime || cur.plannedArrivalTime));

				dot.setAttributeNS(null, "d", d);
				dot.setAttributeNS(null, "vector-effect", "non-scaling-stroke");
				dot.setAttributeNS(null, "stroke-width", "6px");
				dot.setAttribute("class", this.getClassName(cur.stopType));
				el.appendChild(dot);
			}
		});
	}

	updateSize(newSize: [[number, number],[number, number]]) {
		this.svgSize = newSize[0];
		this.contentSize = newSize[1];
	}

	getClassName(stopType: string) {
		if (stopType === "BEGIN"
		|| stopType === "END"
		|| stopType === "STOP"
		|| stopType === "PASS") {
			return stopType;
		}

		return "";
	}

	getXPosition(station: string): any {
		return this.topology[station];
	}

	getYPosition(t: number): any{
		let time = new Date(t);
		return ((time.getHours() / 24) + (time.getMinutes() / 24 / 60 ) + (time.getSeconds() / 24 / 60 / 60))
			* (this.border[1][1] - this.border[0][1]) + this.border[0][1];
	}

	onSelect(s: string) {
		if (s === "ShowX") {
			this.showX = true;
		}
		if (s === "HideX") {
			this.showX = false;
		}
		if (s === "ShowY") {
			this.showY = true;
		}
		if (s === "HideY") {
			this.showY = false;
		}
	}
}

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
import { Component, HostListener } from '@angular/core';

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

		.svg-content-stationary rect {
			fill: black;
			fill-opacity: 0.7;
		}

		line {
			stroke: black;
			stroke-width: 2px;
		}

		text {
			user-select: none;
		}
	`],
	template: `
	<div class="railroad">
		<ee-zui-transform [padding]="padding" [border]="border" (onResize)="updateSize($event)">
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

			<svg:g class="time svg-content-stationary">
<!--
					<svg:g *ngFor="let time of times; let i = index">
					<svg:text x="10" [attr.y]="i * 20">
						{{("0" + time.getHours()).slice(-2)}}:{{("0" + time.getMinutes()).slice(-2)}}:{{("0" + time.getSeconds()).slice(-2)}}
					</svg:text>
				</svg:g>
-->
			</svg:g>

			<svg:g class="svg-content-stationary">
				<svg:rect [attr.width]="svgSize[0]" [attr.height]="padding[0]" />
				<svg:rect [attr.width]="svgSize[0]" [attr.height]="padding[2]" [attr.y]="svgSize[1] - padding[2]" />

				<svg:rect [attr.width]="padding[1]" [attr.height]="svgSize[1]" [attr.x]="svgSize[0] - padding[1]" />
				<svg:rect [attr.width]="padding[3]" [attr.height]="svgSize[1]" />
<!--
				<svg:text *ngFor="let station of timetable.stations; let i = index"
					[attr.x]="i * 100" y="20">
					{{station}}
				</svg:text>
-->
			</svg:g>
		</ee-zui-transform>
	</div>
	`
})

export class RailroadComponent {
	border: [[number, number], [number, number]] = [[0,0],[2000,2000]];
	padding: [number, number, number, number] = [80,80,80,80];

	timetable: Timetable;

	svgSize: [number, number] = [1366,675];

	constructor(private rs: RailroadService) {
		this.timetable = rs.getTimetable();

		this.border = [[0,0],[this.timetable.stations.length * 100, 1000]];
	}

	updateSize(svgSize: [number, number]) {
		this.svgSize = svgSize;
	}
}

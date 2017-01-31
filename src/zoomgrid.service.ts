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
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export enum Side {
	RISING, FALLING
}

export class GridResponse {
	readonly level: number;
	readonly side: Side;
	readonly zoom: number;
	readonly oldZoom: number;

	constructor(level: number, side: Side, zoom: number, oldZoom: number) {
		this.level = level;
		this.side = side;
		this.zoom = zoom;
		this.oldZoom = oldZoom;
	}
}

type GridSubject = Subject<GridResponse>;
type GridObservable = Observable<GridResponse>;

@Injectable()
export class ZoomGridService {
	oldZoom: number = undefined;
	levelIndex: number = undefined;
	gridSubjects: any = {};
	gridLevel: number[] = [];

	zoomChange(zoom: number) {
		if (this.oldZoom == undefined) {
			this.oldZoom = zoom;
			return;
		}

		if(this.levelIndex === undefined) {
			this.levelIndex = this.calcOldLevel(this.oldZoom);
		}

		this.handleZooming(zoom);

		this.oldZoom = zoom;
	}

	notifyOn(grid: number[]): GridObservable {
		let subject: GridSubject = new Subject<GridResponse>();
		grid.forEach((d) => {
			if (!this.gridSubjects[d]) {
				this.gridSubjects[d] = [];
				this.gridLevel.push(d);
			}
			this.gridSubjects[d].push(subject);
		});
		this.gridLevel.sort();
		this.levelIndex = undefined;

		return subject.asObservable();
	}

	private handleZooming(zoom: number) {
		if (zoom < this.oldZoom) {
			this.handleZoomOut(zoom);
		} else if (this.oldZoom < zoom) {
			this.handleZoomIn(zoom);
		}
	}

	private handleZoomOut(zoom: number) {
		const dir: Side = Side.FALLING;
		if (this.levelIndex < 0) {
			return;
		}

		const boundary = this.levelIndex;
		const level = this.gridLevel[boundary];
		if (zoom < level) {
			this.gridSubjects[level].forEach((subject) => {
				subject.next(new GridResponse(level, dir, zoom, this.oldZoom))
			});
			this.levelIndex--;
		}
	}

	private handleZoomIn(zoom: number) {
		const dir: Side = Side.RISING;
		if (this.levelIndex >= this.gridLevel.length - 1) {
			return;
		}

		const boundary = this.levelIndex + 1;
		const level = this.gridLevel[boundary];
		if (zoom > level) {
			this.gridSubjects[level].forEach((subject) => {
				subject.next(new GridResponse(level, dir, zoom, this.oldZoom))
			});
			this.levelIndex++;
		}
	}

	private calcOldLevel(zoom: number): number {
		if (this.oldZoom === undefined) return undefined;
		if (this.gridLevel.length === 0) return undefined;

		let arr = this.gridLevel;

		for (let i = 0; i < arr.length; i++) {
			if (zoom < arr[i]) {
				return i-1;
			}
		}

		return arr.length - 1;
	}
}

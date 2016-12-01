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
import { Component, Input, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';

import { ContextMenuStatus } from './contextmenu.interface';

@Component({
	selector: 'context-menu',
	styles: [`
		ul {
			margin: 0;
			padding: 5px 0;
			position: absolute;
			border-radius: 0;
			border: 1px solid #ccc;
			cursor: pointer;
			font-size: 14px;
			outline: none;
			background-color: white;
			box-shadow: 0 2px 4px rgba(0,0,0,0.2);
		}

		ul li {
			margin: 0;
			padding: 4px 0px 4px 8px;
			width: 150px;
			color: #333;
			list-style: none;
			position: relative;
			white-space: nowrap;
		}

		ul li:hover {
			background-color: #ddd;
		}
	`],
	template: `
		<ul [hidden]="!contextMenu.show" [style.left]="contextMenu.x  + 'px'" [style.top]="contextMenu.y + 'px'">
			<li *ngFor="let item of contextMenu.items" (click)="select(item)">{{item}}</li>
		</ul>
	`
})

export class ContextMenu implements OnInit {
	@Input() contextMenu: ContextMenuStatus;
	@Output("select") selectEmitter: EventEmitter<string> = new EventEmitter<string>();

	constructor(private er: ElementRef) { }

	ngOnInit() {
		this.er.nativeElement.querySelector("ul").addEventListener("click", (e: MouseEvent) => {
			e.stopPropagation();
		});
	}

	select(item: string) {
		this.contextMenu.show = false;
		this.selectEmitter.emit(item);
	}
}

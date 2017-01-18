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
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'

import { ContextMenu } from './contextmenu/contextmenu.component';
import { ZUITransformComponent } from './zui-transform.component';
import { SVGScrollbarComponent } from './svg-scrollbar.component';

import { ZUITransformService } from './zui-transform.service';
import { CoordinateService } from './coordinate.service';

@NgModule({
	imports: [BrowserModule, FormsModule, CommonModule],
	declarations: [ZUITransformComponent, SVGScrollbarComponent, ContextMenu],
	providers: [ZUITransformService, {provide: 'CoordinateInterface', useClass: CoordinateService}],
	exports: [ZUITransformComponent, ContextMenu]
})
export class ZUIModule { }

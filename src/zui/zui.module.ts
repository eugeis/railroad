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

import { CommonModule } from '@angular/common'

import { ContextMenuModule } from './contextmenu/contextmenu.module';
import { ContextMenu } from './contextmenu/contextmenu.component';

import { ZUIComponent } from './zui.component';
import { ZUITransformComponent } from './zui-transform.component';
import { ZUITransformService } from './zui-transform.service';
import { SVGScrollbarComponent } from './svg-scrollbar.component';

@NgModule({
	imports: [CommonModule, ContextMenuModule],
	declarations: [ZUIComponent, ZUITransformComponent, SVGScrollbarComponent],
	providers: [ZUITransformService],
	exports: [ZUIComponent, ContextMenu]
})
export class ZUIModule { }

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
import { HttpModule, JsonpModule } from '@angular/http';

import { ZUIModule } from './zui/zui.module';

import { StopOrPasssComponent } from './railroad-content/stoporpasss.component';
import { PartialTripsComponent } from './railroad-content/partialtrips.component';

import { ContextHandlerService } from './contexthandler.service';
import { SVGTimeAxisComponent } from './time-axis.component';
import { RailroadComponent } from './railroad.component';
import { RailroadService } from './railroad.service';
import { AxisService } from './axis.service';

@NgModule({
	imports: [CommonModule, HttpModule, JsonpModule, ZUIModule],
	declarations: [RailroadComponent, SVGTimeAxisComponent,
		StopOrPasssComponent, PartialTripsComponent],
	providers: [RailroadService,
		{provide: 'ContextHandlerInterface', useClass: ContextHandlerService},
		{provide: 'AxisServiceInterface', useClass: AxisService}],
	exports: [RailroadComponent]
})
export class RailroadModule { }

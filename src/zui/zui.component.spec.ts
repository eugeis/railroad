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

import { TestBed } from '@angular/core/testing';

import { ZUIComponent } from './zui.component';
import { ZUIService } from './zui.service';
import { ZoomGridService } from './zoomgrid.service';
import { ZUIModule } from './zui.module';

describe("ZUIComponent", () => {
	let component: ZUIComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ZUIModule],
			declarations: [],
			providers: [
				{provide: ZUIService, useClass: ZUIService},
				{provide: ZoomGridService, useClass: ZoomGridService}
			],
		});

		const fixture = TestBed.createComponent(ZUIComponent);
		component = fixture.componentInstance;
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});
})

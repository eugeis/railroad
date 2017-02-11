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

import { TestBed, async, fakeAsync } from '@angular/core/testing';

import { RailroadComponent } from './railroad.component';
import { RailroadModule } from './railroad.module';
import { RailroadService } from './railroad.service';

import { Observable } from 'rxjs/Observable';
import { Timetable } from './timetable.interface';

class MockupRailroadService extends RailroadService {
	getTimetable(): Observable<Timetable> {
		return new Observable<Timetable>();
	}
}

describe("RailroadComponent", () => {
	let component: RailroadComponent;

	beforeEach(async() => {
		TestBed.configureTestingModule({
			imports: [RailroadModule],
			providers: [{provide: RailroadService, useClass: MockupRailroadService}],
		});

		const fixture = TestBed.createComponent(RailroadComponent);
		component = fixture.componentInstance;
	});

	it("should be defined", fakeAsync(() => {
		expect(component).toBeDefined();
	}));
});

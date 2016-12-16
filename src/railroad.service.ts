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

import { Timetable } from './timetable.interface';

@Injectable()
export class RailroadService {
	constructor() { }

	getTimetable(): Timetable {
		return {
			"timestamp": new Date(),
			"partialTrips": {
				"all": []
			},
			"trips": {
				"all": []
			},
			"stopOrPasss": {
				"all": []
			},
			"stations": [
				"AZM",
				"1010",
				"BTC",
				"1009",
				"1007",
				"JDM",
				"MDY",
				"1006",
				"ZCLU",
				"XTC",
				"HDHZ",
				"ZCLI",
				"SZJ",
				"1004",
				"BG",
				"1001",
				"SYJ",
				"PLU",
				"HXXJ",
				"1011"
			]
		};
	}
}

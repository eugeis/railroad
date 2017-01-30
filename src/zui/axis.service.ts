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

import { AxisServiceInterface } from './axis.interface';
import { Border } from './types.model';

@Injectable()
export class AxisService implements AxisServiceInterface<string, Date> {
	topology = {
		"SYJ": 0 + 100,
		"1011": 100 + 100,
		"HXXJ": 200 + 100,
		"1010": 300 + 100,
		"AZM": 400 + 100,
		"1009": 500 + 100,
		"BTC": 600 + 100,
		"JDM": 700 + 100,
		"1007": 800 + 100,
		"1006": 900 + 100,
		"MDY": 1000 + 100,
		"XTC": 1100 + 100,
		"ZCLU": 1200 + 100,
		"ZCLI": 1300 + 100,
		"HDHZ": 1400 + 100,
		"1004": 1500 + 100,
		"SZJ": 1600 + 100,
		"1001": 1700 + 100,
		"BG": 1800 + 100,
		"PLU": 1900 + 100
	}

	getX(station: string): number {
		return this.topology[station];
	}

	getY(time: Date, border: Border): number{
		if (!time) return 0;

		return ((time.getHours() / 24) + (time.getMinutes() / 24 / 60 ) + (time.getSeconds() / 24 / 60 / 60))
			* (border.max.y - border.min.y) + border.min.y;
	}
}

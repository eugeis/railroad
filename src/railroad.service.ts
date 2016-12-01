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

export interface Halt {
	station: Station,
	time: Date
}

export type Station = string;
type Track = Halt[];
export type Railroad = Track[];

const stations: Station[] = [
	"A", "B", "C"
];

const railroad: Railroad = [
	[{
		station: stations[0],
		time: new Date(0, 0, 0, 10, 0, 0)
	},
	{
		station: stations[0],
		time: new Date(0, 0, 0, 10, 10, 0)
	},
	{
		station: stations[1],
		time: new Date(0, 0, 0, 11, 0, 0)
	},
	{
		station: stations[1],
		time: new Date(0, 0, 0, 11, 5, 0)
	},
	{
		station: stations[2],
		time: new Date(0, 0, 0, 11, 30, 0)
	}],
	[{
		station: stations[0],
		time: new Date(0, 0, 0, 10, 0, 0)
	},
	{
		station: stations[0],
		time: new Date(0, 0, 0, 10, 10, 0)
	},
	{
		station: stations[1],
		time: new Date(0, 0, 0, 11, 0, 0)
	},
	{
		station: stations[1],
		time: new Date(0, 0, 0, 11, 5, 0)
	},
	{
		station: stations[2],
		time: new Date(0, 0, 0, 11, 30, 0)
	}],
	[{
		station: stations[0],
		time: new Date(0, 0, 0, 10, 0, 0)
	},
	{
		station: stations[0],
		time: new Date(0, 0, 0, 10, 10, 0)
	},
	{
		station: stations[1],
		time: new Date(0, 0, 0, 11, 0, 0)
	},
	{
		station: stations[1],
		time: new Date(0, 0, 0, 11, 5, 0)
	},
	{
		station: stations[2],
		time: new Date(0, 0, 0, 11, 30, 0)
	}]
];

@Injectable()
export class RailroadService {
	constructor() { }

	getRailroad(): Railroad {
		return railroad;
	}

	getAllStations(): Station[] {
		return stations;
	}
}

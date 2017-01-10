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
import { Http, Response } from '@angular/http';

import { Timetable } from './timetable.interface';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class RailroadService {
	private heroesUrl = 'data/timetableContainer.min.json';  // URL to web API

	constructor(private http: Http) { }

	private handleError (error: Response | any) {
		// In a real world app, we might use a remote logging infrastructure
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}

	private extractData(data :any) {
		let dat:Timetable = data.json();

		console.log(dat);

		/*
		dat.trips.all.splice(1);
		dat.partialTrips.all = dat.partialTrips.all.filter(d => {
			return dat.trips.all[d.tripId - 9001];
		});
		dat.stopOrPasss.all = dat.stopOrPasss.all.filter(d => {
			return !!dat.partialTrips.all[d.partialTripId - 9001];
		});
		*/
		console.log(dat);

		dat.trips.all.forEach(d => {
			d.partialTrips = [];
		});

		dat.partialTrips.all.forEach(d => {
			d.trip = dat.trips.all[d.tripId - 9001];
			d.trip.partialTrips.push(d);

			d.stopOrPasss = [];
		});

		dat.stopOrPasss.all.forEach(d => {
			d.partialTrip = dat.partialTrips.all[d.partialTripId - 9001];
			d.partialTrip.stopOrPasss.push(d);

			d.plannedDepartureTime = d.plannedDepartureTime && new Date(d.plannedDepartureTime);
			d.plannedArrivalTime = d.plannedArrivalTime && new Date(d.plannedArrivalTime);
		});

		let begin = dat.stopOrPasss.all.filter(a => {
			return a.stopType === "BEGIN";
		});
		let pass = dat.stopOrPasss.all.filter(a => {
			return a.stopType === "PASS";
		});
		let end = dat.stopOrPasss.all.filter(a => {
			return a.stopType === "END";
		});
		let stop = dat.stopOrPasss.all.filter(a => {
			return a.stopType === "STOP";
		});

		console.log("begin", begin);
		console.log("pass", pass);
		console.log("end", end);
		console.log("stop", stop);

		return dat;
	}

	getTimetable(): Observable<Timetable> {
		return this.http.get(this.heroesUrl)
			.map(this.extractData)
			.catch(this.handleError);
	}
}

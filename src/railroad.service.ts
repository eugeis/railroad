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

		dat.trips.all = dat.trips.all.filter((t) => {
			return t.id % 50 == 0;
		});
		dat.trips.all.forEach((t) => t.partialTrips = []);
		dat.partialTrips.all.forEach((pt) => pt.stopOrPasss = []);

		//assign trip
		dat.partialTrips.all.forEach((pt) => {
			pt.trip = dat.trips.all.find((t) => {
				return t.id === pt.tripId;
			});

			if (pt.trip) {
				pt.trip.partialTrips.push(pt);
			}
		});
		dat.partialTrips.all = dat.partialTrips.all.filter((pt) => { return !!pt.trip; });

		//asign partial trip
		dat.stopOrPasss.all.forEach((sop) => {
			sop.partialTrip = dat.partialTrips.all.find((pt) => {
				return pt.id === sop.partialTripId;
			});

			if (sop.partialTrip) {
				sop.partialTrip.stopOrPasss.push(sop);
			}
		});
		dat.stopOrPasss.all = dat.stopOrPasss.all.filter((sop) => { return !!sop.partialTrip; });

		dat.stopOrPasss.all.forEach(d => {
			d.plannedDepartureTime = d.plannedDepartureTime && new Date(<any>d.plannedDepartureTime);
			d.plannedArrivalTime = d.plannedArrivalTime && new Date(<any>d.plannedArrivalTime);
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

		return dat;
	}

	getTimetable(): Observable<Timetable> {
		return this.http.get(this.heroesUrl)
			.map(this.extractData)
			.catch(this.handleError);
	}
}

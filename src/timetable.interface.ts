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

type Station = string;
type StationTrack = string;
type TrainTypeName = string;
type TrainName = string;

export interface PartialTrip {
//	"destinationId": null,
//	"drivingMode": null,
	id: number;
//	"lastChanged": Date,
//	"lineDirection": string
//	"lineName": string,
//	"minimumTurnTime": null,
//	"operatingChacteristic": null,
//	"partialTripNaturalKey": Object
//	"partialTripType": string,
//	"priority": null,
//	"sortOrder": number,
	stopOrPasss: StopOrPass[];
//	"timeSlack": null,
//	"trainIdToc": string,
//	"trainNumber": null,
//	"trainCategory": null,
//	"trainCharacteristicId": null,
//	"trainTypeName": string,
	trip: Trip;
	tripId: number;
	tripNumber: string,
//	"turningAllowed": null,
}

export interface StopOrPass {
//	arrivalStatus: "FUTURE"
//	arrivalTime: Object
//	canDepartEarly: boolean
//	departureTime: Object
//	discontinuous: null
//	doNotDispatch: null
	id: number;
//	interpolatedPlannedArrivalTime: null
//	interpolatedPlannedDepartureTime: null
//	lastChanged: Date
//	maxDwellTime: number
//	maxRecommendedSpeed: null
//	minDwellTime: number
//	minTravelTime: null
//	name: string
//	newCrewId: null
//	nextLineTrackName: string
//	nextLineTrackTopologyId: string
//	nomDwellTime: number
//	nominalDwellTime: Object
//	openAllDoors: null
//	operationalStoppingPoint: "CENTER"
//	optionalStatus: "NORMAL"
//	partialCancelationType: "NORMAL"
	partialTrip: PartialTrip;
	partialTripId: number;
//	passengerStop: boolean
	plannedArrivalTime: Date;
	plannedDepartureTime: Date;
//	productiveArrivalTime: Date;
//	priority: number
//	productiveDepartureTime: Date
//	publishedArrivalTime: null
//	publishedDepartureTime: null
//	sleepWakeUpInfo: null
//	sortOrder: number
//	sopNaturalKey: null
	stationName: Station;
//	stationTopologyId: "A3G8H99GH8"
//	stationTrack: StationTrack
//	stopOrTrackLastChanged: Date
	stopType: string;
//	topologyId: "A3G8H9GXH8"
//	turning: boolean
//	type: "STATIONTRACK"

	x: number;
	y: number;
}

export interface Trip {
//	activated: boolean
//	arrivalTimeAtDestination: Date
//	cancelled: boolean
//	creationTimestamp: Date
//	daysRun: null
//	deepCopied: boolean
//	deleted: boolean
//	destinationStation: Station
//	entryStation: Station
//	exitStation: Station
//	externTtsTrainUid: null
	id: number;
//	lastChanged: Date
//	lockedBy: null
//	marketingName: null
	nominalTrainName: TrainName
//	nominalTrainNameWithDate: Object
//	offline: boolean
//	optional: boolean
//	originStation: Station
//	partialCancelationType: "NONE"
	partialTrips: PartialTrip[];
//	planned: boolean
//	prevType: null
//	runTimeToDestination: null
//	serialId: ""
//	sortOrder: null
//	startDate: Date
//	startTimeAtOrigin: Date
//	timetableId: number
//	trainTypeName: TrainTypeName
//	type: "ACTIVATED"
//	valid: boolean
}

export interface Container<T> {
	all: T[]
//	allNew: T[]
//	allRemoved: T[]
//	length: number
//	allUpdated: T[]
//	data: any
//	empty: boolean
//	entityResolver: Object
//	keepMarksAfterRemove: boolean
//	keys: string[]
//	new: T[]
//	removed: T[]
//	removedMarks: Object
//	size: number
//	updated: T[]
}

export interface Timetable {
	partialTrips: Container<PartialTrip>;
	stations: Station[];
	stopOrPasss: Container<StopOrPass>;
	trips: Container<Trip>;
	timestamp: Date;
}

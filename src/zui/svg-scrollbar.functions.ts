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
export function calcBarSize(
	zoom: number,
	svgSize: number,
	scrollSize: number,
	border: [number, number])
{
	return svgSize * scrollSize / (zoom * (border[1] - border[0]));
}

export function calcBarPosition(
	translate: number,
	zoom: number,
	svgSize: number,
	scrollSize: number,
	barSize: number,
	border: [number, number])
{
	return ((translate + zoom * border[0]) * (scrollSize - barSize)) / (zoom * (border[0] - border[1]) + svgSize);
}

export function calcMovementPosition(
	position: number,
	zoom: number,
	svgSize: number,
	scrollSize: number,
	barSize: number,
	border: [number, number])
{
	return position * (zoom * (border[0] - border[1]) + svgSize) / (scrollSize - barSize) - (zoom * border[0]);
}

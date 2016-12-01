# vindue
Angular2-based window manager for websites

[Documentation](https://github.com/j-moeller/vindue/blob/master/DOCUMENTATION.md)

## Getting started

**Install with npm**

```npm install vindue --save```


**Importing in AppModule**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { WindowManagerModule } from 'vindue';

@NgModule({
	imports: [BrowserModule, FormsModule, WindowManagerModule],
	declarations: [AppComponent],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule { }
```

**Usage in app.component**
```typescript
import { Component } from '@angular/core';

@Component({
	selector: 'my-app',
	template: `
		<ee-tree
				[windows]="windows"
				[map]="map"
				[modules]="modules"
				[model]="model"
				(on)="on($event)">
		</ee-tree>
	`
})
export class AppComponent {
	/* Names of the views */
	windows: string[] = ["Window1", "Window2", "Window3"];

	/*
	 * A function, which maps a view's name to
	 * some html-template
	 */
	map = {
		callback: function(v) {
			switch(v) {
				case "Window1": return "<h1>Window 1</h1>";
				case "Window2": return "<h1>Window 2</h1>";
				case "Window3": return "<h1>Window 3</h1>";
				case "TaskDetails": return "<h1>Moin</h1>";
				default: throw "No such view";
			}
		}
	};

	/*
	 * Modules necessary for components/ directives
	 * used in the html-templates
	 */
	modules: any = [];

	/* A shared object passed to the views */
	model = { }

	/* Events received from views */
	on(e) { }
}
```

**Additional styles for**

*full-screen app*

```css
html, body {
	width: 100%;
	height: 100%;
}
```

*unlimited resizing of windows*

```css
.ee-panel > ee-panel-data {
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	padding: 5px;
}
```

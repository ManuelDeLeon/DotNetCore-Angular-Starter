import { NgModule }     from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";

@NgModule({
	imports: [
		RouterModule.forRoot([
			{ path: "", redirectTo: "home", pathMatch: "full" },
			{ path: "home", component: AppComponent },
			{ path: "**", redirectTo: "home" }
		])
	],
	exports: [
		RouterModule
	]
})
export class AppRouting {}

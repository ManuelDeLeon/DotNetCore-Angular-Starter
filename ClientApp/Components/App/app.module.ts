import { NgModule } from "@angular/core";
import { UniversalModule } from "angular2-universal";
import { AppComponent } from "./app.component";

@NgModule({
	bootstrap: [ AppComponent ],
	declarations: [ AppComponent ],
	imports: [ UniversalModule ]
})
export class AppModule {}

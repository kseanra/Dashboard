import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AddGadgetComponent} from './add-gadget-component';
import {AddGadgetService} from './service';
import {HttpClientModule} from '@angular/common/http';
import {DataListModule} from '../datalist/data-list.module';
import {MatButtonModule,  MatSelectModule, MatListModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {GedgetPreviewComponent} from './add-gadget-preview-component';

@NgModule({
    imports: [
        CommonModule,
        DataListModule,
        HttpClientModule,
        MatButtonModule,
        MatListModule,
        MatSelectModule
    ],
    declarations: [
        AddGadgetComponent,
        GedgetPreviewComponent
    ],
    providers: [
        AddGadgetService
    ],
    exports: [
        AddGadgetComponent
    ]
})
export class AddGadgetModule {
}


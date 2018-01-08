/**
 * Created by jayhamilton on 1/24/17.
 */
import {
    ViewChild, ElementRef, AfterViewInit, Component, Output, EventEmitter
} from '@angular/core';

import {
    style, trigger, animate, transition,
} from '@angular/animations';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import {AddGadgetService} from './service';
import {Facet} from '../facet/facet-model';
import {FacetTagProcessor} from '../facet/facet-tag-processor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


declare var jQuery: any;

/**
 * Message Modal - clasable modal with message
 *
 * Selector message-modal
 *
 * Methods
 *      popMessageModal - display a message modal for a sepcified duration
 *      showMessageModal - show the message modal
 *      hideMessageModal - hide the message modal
 */
@Component({
    selector: 'app-add-gadget-modal',
    moduleId: module.id,
    templateUrl: './view.html',
    styleUrls: ['./styles.css'],
    animations: [
        trigger(
            'showHideAnimation',
            [
                transition(':enter', [   // :enter is alias to 'void => *'
                    style({opacity: 0}),
                    animate(750, style({opacity: 1}))
                ]),
                transition(':leave', [   // :leave is alias to '* => void'
                    animate(750, style({opacity: 0}))
                ])
            ])
    ]

})
export class AddGadgetComponent implements AfterViewInit {

    @Output() addGadgetEvent: EventEmitter<any> = new EventEmitter();

    selectedFields: any[] = [];
    gadgetObjectList: any[] = [];
    gadgetObjectTitleList: string[] = [];
    placeHolderText = 'Begin typing gadget name';
    layoutColumnOneWidth = 'six';
    layoutColumnTwoWidth = 'ten';
    listHeader= 'Gadgets';
    facetTags: Array<Facet>;

    color = 'white';

    modalicon: string;
    modalheader: string;
    modalmessage: string;
    selectedTable: string;
    selectedChart: string;
    config: any;

    @ViewChild('messagemodal_tag') messagemodalRef: ElementRef;
    @ViewChild('yourChild') child;
    @ViewChild('fieldslist') myfields;

    messageModal: any;

    tables = [
        {value: 'Customers', viewValue: 'Customers'},
        {value: 'Customer Transaction', viewValue: 'Invoices'},
        {value: 'Order', viewValue: 'Order'},
        {value: 'Supplier', viewValue: 'Supplier'},
        {value: 'Supplier Transaction', viewValue: 'Supplier Transaction'},
        {value: 'Employee', viewValue: 'Employee'}
    ];

    charts = [
        {value: 'Pie', viewValue: 'Pie'},
        {value: 'Line', viewValue: 'Line'},
        {value: 'Bar', viewValue: 'Bar'},
        {value: 'Grouped Bar', viewValue: 'Grouped Bar'},
        {value: 'Area', viewValue: 'Area'},
        {value: 'Gauge', viewValue: 'Gauge'}
     ];
    
    fields = [ 
        {name : 'CustomerCode', type: 'string'},
        {name : 'InvoiceNumber', type: 'Int'},
        {name : 'InvoiceDate', type: 'data'},
        {name : 'InvoiceAmount', type: 'double'},
        {name : 'InvoiceBalance', type: 'double'},
        {name : 'OverdueDays', type: 'Int'}
    ];

    constructor(private _addGadgetService: AddGadgetService) {

        this.getObjectList();
    }

    actionHandler(actionItem, actionName) {
        this.addGadgetEvent.emit(actionItem);
        this.hideMessageModal();

    }


    popMessageModal(icon: string, header: string, message: string, durationms: number) {
        this.showMessageModal(icon, header, message);
        Observable.interval(durationms).take(1).subscribe(
            () => {
                this.hideMessageModal();
            }
        );
    }

    showMessageModal(icon: string, header: string, message: string) {
        this.modalicon = icon;
        this.modalheader = header;
        this.modalmessage = message;
        this.messageModal.modal('show');

    }

    showComponentLibraryModal(header: string) {

        this.modalheader = header;
        this.messageModal.modal('show');
    }

    hideMessageModal() {
        this.modalicon = '';
        this.modalheader = '';
        this.modalmessage = '';
        this.messageModal.modal('hide');
    }

    ngAfterViewInit() {
        this.messageModal = jQuery(this.messagemodalRef.nativeElement);
    }

    getObjectList() {

        this._addGadgetService.getGadgetLibrary().subscribe(data => {
            this.gadgetObjectList.length = 0;
            const me = this;
            data.library.forEach(function (item) {
                me.gadgetObjectList.push(item);
                me.gadgetObjectTitleList.push(item.name);
            });
            const facetTagProcess = new FacetTagProcessor(this.gadgetObjectList);
            this.facetTags = facetTagProcess.getFacetTags();
        });

    }

    onChange(input) {
        this.selectedTable = input;
        //console.log(this.myfields.selectedOptions.selected.length);
    }


    onChartChange(input)
    {
        if(input == 'Bar'){
            this.config =  JSON.parse('{"propertyPages": [ { "displayName": "Run", "groupId": "run", "position": 10, "properties": [ { "controlType": "textbox", "key": "title", "label": "Title", "value": "Bar Chart", "required": true, "order": 1}, { "controlType": "dynamicdropdown", "key": "endpoint", "label": "API Endpoints", "value": "", "required": true, "order": 3 }, { "controlType": "hidden", "key": "instanceId", "label": "", "value": 999, "required": true, "order": -1 } ] }, { "displayName": "Chart", "groupId": "chart", "position": 11, "properties": [ { "controlType": "checkbox", "type": "checkbox", "key": "chart_properties", "label": "Show chart details", "value": true, "required": true, "order": 3 } ] } ],"fields":[{"name": "f1f"},{"name": "f2f"}] }');
            this.child.OnChange('CPUGadgetComponent', this.config);
            this.selectedChart = 'CPUGadgetComponent';
        }
        else  if(input == 'Area')
        {
            this.config =  JSON.parse('{"propertyPages": [{"displayName": "Run","groupId": "run","position": 10,"properties": [{"controlType": "dynamicdropdown","key": "endpoint","label": "API Endpoints","value": "","required": true,"order": 2 }, {"controlType": "textbox","key": "title","label": "Title","value": "Area Chart","required": true,"order": 1 }, {"controlType": "hidden","key": "instanceId","label": "","value": 2,"required": true,"order": -1}]}, {"displayName": "Chart","groupId": "chart","position": 11,"properties": [{"controlType": "checkbox","type": "checkbox","key": "chart_properties","label": "Show chart details","value": true,"required": true,"order": 3 }]}],"fields":[{"name": "f1f"},{"name": "f2f"}] }');
            this.child.OnChange('TrendGadgetComponent', this.config);
                this.selectedChart = 'TrendGadgetComponent';
        }
        else  if(input == 'Line')
        {
            this.config =  JSON.parse('{"propertyPages": [{"displayName": "Run","groupId": "run","position": 10,"properties": [{"controlType": "dynamicdropdown","key": "endpoint","label": "API Endpoints","value": "","required": true,"order": 2 }, {"controlType": "textbox","key": "title","label": "Title","value": "Line Chart","required": true,"order": 1 }, {"controlType": "hidden","key": "instanceId","label": "","value": 2,"required": true,"order": -1}]}, {"displayName": "Chart","groupId": "chart","position": 11,"properties": [{"controlType": "checkbox","type": "checkbox","key": "chart_properties","label": "Show chart details","value": true,"required": true,"order": 3 }]}],"fields":[{"name": "f1f"},{"name": "f2f"}] }');
            this.child.OnChange('TrendLineGadgetComponent', this.config);
                this.selectedChart = 'TrendLineGadgetComponent';
        }
        else  if(input == 'Pie')
        {
            this.config =  JSON.parse('{"propertyPages": [{"displayName": "Run","groupId": "run","position": 10,"properties": [{"controlType": "dynamicdropdown","key": "endpoint","label": "API Endpoints","value": "","required": true,"order": 2 }, {"controlType": "textbox","key": "title","label": "Title","value": "Pie Chart","required": true,"order": 1 }, {"controlType": "hidden","key": "instanceId","label": "","value": 2,"required": true,"order": -1}]}, {"displayName": "Chart","groupId": "chart","position": 11,"properties": [{"controlType": "checkbox","type": "checkbox","key": "chart_properties","label": "Show chart details","value": true,"required": true,"order": 3 }]}],"fields":[{"name": "f1f"},{"name": "f2f"}] }');
            this.child.OnChange('DiskGadgetComponent', this.config);
                this.selectedChart = 'DiskGadgetComponent';
        }
        if(input == 'Grouped Bar'){
            this.config =  JSON.parse('{"propertyPages": [ { "displayName": "Run", "groupId": "run", "position": 10, "properties": [ { "controlType": "textbox", "key": "title", "label": "Title", "value": "Bar Chart", "required": true, "order": 1}, { "controlType": "dynamicdropdown", "key": "endpoint", "label": "API Endpoints", "value": "", "required": true, "order": 3 }, { "controlType": "hidden", "key": "instanceId", "label": "", "value": 999, "required": true, "order": -1 } ] }, { "displayName": "Chart", "groupId": "chart", "position": 11, "properties": [ { "controlType": "checkbox", "type": "checkbox", "key": "chart_properties", "label": "Show chart details", "value": true, "required": true, "order": 3 } ] } ],"fields":[{"name": "f1f"},{"name": "f2f"}] }');
            this.child.OnChange('CPUMGadgetComponent', this.config);
            this.selectedChart = 'CPUMGadgetComponent';
        }

    }

    onAdd(){
        if(this.selectedChart == 'CPUGadgetComponent')
        {
            const actionItem =  JSON.parse('{"componentType": "CPUGadgetComponent","name": "Bar Chart","description": "Bar Chart.","icon": "assets/images/cpu.png","instanceId": -1,"tags": [ {"facet": "Chart","name": "bar" }], "config": {"propertyPages": [{"displayName": "Run","groupId": "run","position": 10,"properties": [{"controlType": "textbox","key": "title","label": "Title","value": "Bar Chart","required": true,"order": 1 }, {"controlType": "dynamicdropdown","key": "endpoint","label": "API Endpoints","value": "","required": true,"order": 3 }, {"controlType": "hidden","key": "instanceId","label": "","value": 999,"required": true,"order": -1}]}, {"displayName": "Chart","groupId": "chart","position": 11,"properties": [{"controlType": "checkbox","type": "checkbox","key": "chart_properties","label": "Show chart details","value": true,"required": true,"order": 3 }]}],"fields":[{"name": "f1f"},{"name": "f2f"}]}, "actions":[{"name": "Add" }] }');
            actionItem.properties = this.config;
            this.actionHandler(actionItem, 'add');
        }
        else if(this.selectedChart == 'TrendGadgetComponent')
        {
            const actionItem =  JSON.parse('{"componentType": "TrendGadgetComponent","name": "Area","description": "Area","icon": "assets/images/trend.png","instanceId": -1,"tags": [ {"facet": "Chart","name": "area" }], "config": {"propertyPages": [{"displayName": "Run","groupId": "run","position": 10,"properties": [{"controlType": "dynamicdropdown","key": "endpoint","label": "API Endpoints","value": "","required": true,"order": 2 }, {"controlType": "textbox","key": "title","label": "Title","value": "Area Chart","required": true,"order": 1 }, {"controlType": "hidden","key": "instanceId","label": "","value": 2,"required": true,"order": -1}]}, {"displayName": "Chart","groupId": "chart","position": 11,"properties": [{"controlType": "checkbox","type": "checkbox","key": "chart_properties","label": "Show chart details","value": true,"required": true,"order": 3 }]}]}, "actions":[{"name": "Add" }] }');
            actionItem.properties = this.config;
            this.actionHandler(actionItem, 'add');

        }
        else if(this.selectedChart == 'TrendLineGadgetComponent')
        {
            const actionItem =  JSON.parse('{"componentType": "TrendLineGadgetComponent","name": "Realtime Performance","description": "Monitors IOPs and network bandwidth.","icon": "assets/images/trend-line.png","instanceId": -1,"tags": [ {"facet": "Chart","name": "line" }], "config": { "propertyPages": [{"displayName": "Run","groupId": "run","position": 10,"properties": [{"controlType": "dynamicdropdown","key": "endpoint","label": "API Endpoints","value": "","required": false,"order": 2 }, {"controlType": "textbox","key": "title","label": "Title","value": "Line Chart","required": true,"order": 1 }, {"controlType": "hidden","key": "instanceId","label": "","value": 2, "required": true,"order": -1 }]}, {"displayName": "Chart","groupId": "chart","position": 11,"properties": [{"controlType": "checkbox","type": "checkbox","key": "chart_properties","label": "Show chart details","value": true,"required": true,"order": 3 }]}]}, "actions":[{"name": "Add" }] }');
            actionItem.properties = this.config;
            this.actionHandler(actionItem, 'add');

        }

        else if(this.selectedChart == 'DiskGadgetComponent')
        {
            const actionItem =  JSON.parse('{"componentType": "DiskGadgetComponent","name": "Bar Chart","description": "Group information.","icon": "assets/images/donut.png","instanceId": -1,"tags": [ {"facet": "Chart","name": "pie" }], "config": {"propertyPages": [{"displayName": "Run","groupId": "run","position": 10,"properties": [{"controlType": "dynamicdropdown","key": "endpoint","label": "API Endpoints","value": "","required": false,"order": 4 }, {"controlType": "textbox","key": "title","label": "Title","value": "Pie Chart","required": true,"order": 1 }, {"controlType": "number","key": "threshold","label": "Consumed Threshold","value": 50,"required": true,"order": 3 }, {"controlType": "dropdown","key": "diskid","label": "Disk Id","value": "","required": false,"order": 2,"options": [{"key": "2344112gdfgdfg","value": "2344112gdfgdfg" }, {"key": "g3g3egegre","value": "g3g3egegre" }, {"key": "8435f34","value": "8435f34" }]}, {"controlType": "hidden","key": "instanceId","label": "","value": 2,"required": true,"order": -1}]}, {"displayName": "Thresholds","groupId": "threshold","position": 10,"properties": [{"controlType": "number","key": "frequency","label": "Frequency","value": 30,"required": true,"order": 3 }, {"controlType": "number","key": "retentionH","label": "Retention High","value": 30,"required": true,"order": 4 }, {"controlType": "number","key": "retentionL","label": "Retention Low","value": 180,"required": true,"order": 4 }]}, {"displayName": "Chart","groupId": "chart","position": 11,"properties": [{"controlType": "checkbox","type": "checkbox","key": "chart_properties","label": "Show chart details","value": true,"required": true,"order": 3 }]}]}, "actions":[{"name": "Add" }] }');
            actionItem.properties = this.config;
            this.actionHandler(actionItem, 'add');

        }

        else if(this.selectedChart == 'CPUMGadgetComponent')
        {
            const actionItem =  JSON.parse('{"componentType": "CPUMGadgetComponent","name": "Bar Chart","description": "group information.","icon": "assets/images/donut.png","instanceId": -1,"tags": [ {"facet": "Chart","name": "pie" }], "config": {"propertyPages": [{"displayName": "Run","groupId": "run","position": 10,"properties": [{"controlType": "dynamicdropdown","key": "endpoint","label": "API Endpoints","value": "","required": false,"order": 4 }, {"controlType": "textbox","key": "title","label": "Title","value": "Bar Chart","required": true,"order": 1 }, {"controlType": "number","key": "threshold","label": "Consumed Threshold","value": 50,"required": true,"order": 3 }, {"controlType": "dropdown","key": "diskid","label": "Disk Id","value": "","required": false,"order": 2,"options": [{"key": "2344112gdfgdfg","value": "2344112gdfgdfg" }, {"key": "g3g3egegre","value": "g3g3egegre" }, {"key": "8435f34","value": "8435f34" }]}, {"controlType": "hidden","key": "instanceId","label": "","value": 2,"required": true,"order": -1}]}, {"displayName": "Thresholds","groupId": "threshold","position": 10,"properties": [{"controlType": "number","key": "frequency","label": "Frequency","value": 30,"required": true,"order": 3 }, {"controlType": "number","key": "retentionH","label": "Retention High","value": 30,"required": true,"order": 4 }, {"controlType": "number","key": "retentionL","label": "Retention Low","value": 180,"required": true,"order": 4 }]}, {"displayName": "Chart","groupId": "chart","position": 11,"properties": [{"controlType": "checkbox","type": "checkbox","key": "chart_properties","label": "Show chart details","value": true,"required": true,"order": 3 }]}]}, "actions":[{"name": "Add" }] }');
            actionItem.properties = this.config;
            this.actionHandler(actionItem, 'add');

        }        
    }

    saveData(input) {
        console.log(input);
        if(input.selected) {
            if(this.selectedFields.indexOf(input.source.value) < 0) {

                this.selectedFields.push(input.source.value);
            }
        }
        else
        {
            this.selectedFields.splice(this.selectedFields.indexOf(input.source.value), 1);
        }

        console.log(this.selectedFields);
    }
}

class field{
    name: string;
    
}

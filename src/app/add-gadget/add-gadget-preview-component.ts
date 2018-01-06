import {Component, Input, ViewContainerRef, OnInit, ComponentFactoryResolver} from '@angular/core';
import {GadgetInstanceService} from '../board/grid/grid.service';
import {GadgetFactory} from './gadget-factory';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/*
 this class handles the dynamic creation of components
 */

 class PropertyPage{
     displayName: string;
     groupId: string;
     position: any;
     properties : any;

 };

 class PropertyPageProperty{
     controlType : string;
     key: string;
     label : string;
     value : string;
     required : boolean;
     order : any;
 };


@Component({
    selector: 'app-preview',
    template: ''
})
export class GedgetPreviewComponent{
     @Input() gadgetType: string;
     //@Input() gadgetConfig: any;
     //@Input() gadgetInstanceId: number;


    constructor(private viewContainerRef: ViewContainerRef,
                private cfr: ComponentFactoryResolver, private gadgetInstanceService: GadgetInstanceService) {
    }

    OnChange(input, config) {
        /*
         create component instance dynamically
         */
        const gadgetInstanceId = 151510078958;
        this.gadgetInstanceService.removeInstance(gadgetInstanceId);
        const component: any = GadgetFactory.getComponentType(input);
        let compFactory: any = {};
        let gadgetRef: any = {};

        if (component) {
            compFactory = this.cfr.resolveComponentFactory(component);
            gadgetRef = this.viewContainerRef.createComponent(compFactory);

            const gadgetConfig = config;

            gadgetRef.instance.configureGadget(gadgetInstanceId, gadgetConfig);

            /*
             add concrete component to service for tracking
             */
            
            this.gadgetInstanceService.addInstance(gadgetRef);
        }

    }

}


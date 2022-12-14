/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import { MyApp } from './game';

import { VisualSettings } from "./settings";
export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;
    canvas:HTMLCanvasElement;
    myGame:MyApp;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.target = options.element;
        this.updateCount = 0;
        // debugger;
        if (document) {
            // const new_p: HTMLElement = document.createElement("p");
            // new_p.appendChild(document.createTextNode("Neil count:"));
            // const new_em: HTMLElement = document.createElement("em");
            // this.textNode = document.createTextNode(this.updateCount.toString());
            // new_em.appendChild(this.textNode);
            // new_p.appendChild(new_em);
            let canvas: HTMLCanvasElement = document.createElement("canvas");
            canvas.width = 640;
            canvas.height = 480;
            canvas.style.width = this.target.clientWidth + "px";
            this.target.appendChild(canvas);

            this.canvas = canvas;
            this.myGame = new MyApp(this.canvas);
            this.myGame.loadData();
        }
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        // debugger;
        // console.log('Visual update', options);
        // if (this.textNode) {
        //     this.textNode.textContent = (this.updateCount++).toString();
        // }

        this.parseData(options);


        this.canvas.style.width = this.target.clientWidth + "px";
        // this.canvas.style.height = this.target.clientHeight + "px";
    }

    private parseData(options: VisualUpdateOptions){
        try
        {
            let dataViews = options.dataViews;
    
            if (!dataViews
                || !dataViews[0]
                || !dataViews[0].categorical
                || !dataViews[0].categorical.categories
                || !dataViews[0].categorical.categories[0].values)
                return;
    
            let categorical = dataViews[0].categorical;
            let values = categorical.categories[0].values;
            if (values.length > 0)
            {
                console.log('values', values);

                //prevent too much data from entering the visual
                if (values.length > 10)
                {
                    values = values.slice(0,10);
                }

                this.myGame.updateData(values as string[]);
            }
        }catch(err){}
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}
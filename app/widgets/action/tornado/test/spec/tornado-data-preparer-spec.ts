/// <reference path="../../../../lib/vendor-type-definitions/jasmine.d.ts" />
/// <reference path="../../app/js/logic/tornadoChartDataPreparer.ts" />
/// <reference path="../../app/js/plumbing/controllerTornadoChart.ts" />

describe("Tornado Chart Data Preparer Tests",function(){
    var tornadoChartDataPreparer: TornadoChartDataPreparer;
    var tornadoChartConfig: TornadoChartConfig;
    beforeEach(function(){
         var tornadoChartConfig = {
            maxBars: null,
            nodeName: "Breath Strips",
            shadowNodeName: "Shoe Inserts",
            inputData: {
                TornadoDistOutputs: [
                    {
                        Colors: {
                            "mainColor": "#0E438A",
                            "combinedUncColor": "#A4C3ED",
                            "shadowColor": "#9C0E26",
                            "combinedUncShadowColor": "#D79FA8"
                        },
                        CombinedUncertaintyLabel: "Combined Uncertainty Range",
                        Summary: [32, 84, 204],
                        ChartTitle: "Base Case NPV given Dev Success",
                        Key: "npvGivenOverallSuccess",
                        Units: "Millions of dollars",
                        Table: [
                                { Data: [0.05, 0.10, 0.15, 58, 117.39, 176], Factor: "Fraction of Market Accessible" },
                                { Data: ["0.25", "0.45", "0.65", 64, 117.39, 169], Factor: "Peak Market Share" },
                                { Data: [1, 2.5, 3, 46, 117.39, 141], Factor: "Price per unit" },
                                { Data: ["500", "800", "1000", 73, 117.39, 146], Factor: "Available Market Size" },
                                { Data: ["0.45", "0.6", "0.7", 81, 117.39, 141], Factor: "Gross Margin" },
                                { Data: ["7", "9", "15", 98, 117.39, 156], Factor: "Peak Market Duration" },
                                { Data: [0.05, 0.10, 0.15, 129, 117.39, 105], Factor: "Annual SG&A" },
                                { Data: ["1", "2", "4", 114, 117.39, 119], Factor: "Ramp-Up Duration" },
                                { Data: [0.5, 1, 1.5, 117.39, 117.39, 117.39], Factor: "One-time Launch Costs" }
                               ],
                        Display: "Net-Present Value",
                        Mean: 105.57505174154582
                    },
                    {
                       "CombinedUncertaintyLabel":"Combined Uncertainty Range",
                       "Summary":[968676.5576015625,1503386.0173976251,1773143.14625],
                       "ChartTitle":"",
                       "Colors":{"mainColor":"#0E438A","shadowColor":"#9C0E26","combinedUncColor":"#A4C3ED","combinedUncShadowColor":"#D79FA8"},
                       "Key":"Model Outputs'_Total_benefit_A_L",
                       "Units":"Euros per year",
                       "Table":[
                           {
                               "Data":[0.5,0.7760000228881836,0.8999999761581421,968676.5576015625,1503386.0173976251,1743617.8036828125],
                               "Factor":"Fuel Cost"
                           },{
                               "Data":[5000000,6044399,7000000,1282702.02825,1503386.0173976251,1705306.77825],
                               "Factor":"Annual Single Aisle Flights"
                           },{
                               "Data":[300000,525600,700000,1415634.3853976252,1503386.0173976251,1571222.3853976252],
                               "Factor":"Annual Twin Isle Flights"
                           },{
                               "Data":[1500000,2190000,3000000,1496534.0586476251,1503386.0173976251,1511429.6211476251],
                               "Factor":"Annual Regional Flights"
                           },{
                               "Data":[0,0,0,1503386.017387625,1503386.0173976251,1503386.0173976251],
                               "Factor":"European Emission Allowance Permits"
                           },{
                               "Data":[3,5,7,1503386.017387625,1503386.0173976251,1503386.0173976251],
                               "Factor":"Number of years"
                           }
                       ],
                       "Display":"Total Benefit to your airline",
                       "Mean":1420570.488416203
                    }
                ]
            },
            shadowInputData: {
                TornadoDistOutputs: [
                    {
                        Colors: {
                            "mainColor": "#0E438A",
                            "combinedUncColor": "#A4C3ED",
                            "shadowColor": "#9C0E26",
                            "combinedUncShadowColor": "#D79FA8"
                        },
                        CombinedUncertaintyLabel: "Combined Uncertainty Range",
                        Summary: [-0.81, 0.84, 4.17],
                        ChartTitle: "Base Case NPV given Dev Success",
                        Key: "npvGivenOverallSuccess",
                        Units: "Millions of dollars",
                        Table: [
                                { Data: [0.05, 0.10, 0.15, 2.51, 0.84, -0.81], Factor: "Annual SG&A" },
                                { Data: ["0.1", "0.15", "0.2", -0.81, 0.84, 2.51], Factor: "Gross Margin" },
                                { Data: [0.05, 0.10, 0.15, 0.013, 0.84, 1.67], Factor: "Fraction of Market Accessible" },
                                { Data: ["90", "110", "200", 0.55, 0.84, 2.15], Factor: "Available Market Size" },
                                { Data: [1, 2.5, 3, -0.15, 0.84, 1.18], Factor: "Price per unit" },
                                { Data: ["0.2", "0.3", "0.4", 0.29, 0.84, 1.40], Factor: "Peak Market Share" },
                                { Data: ["10", "20", "30", 0.39, 0.84, 0.96], Factor: "Peak Market Duration" },
                                { Data: [0.5, 1, 1.5, 1.11, 0.84, 0.57], Factor: "One-time Launch Costs" },
                                { Data: ["1", "2", "4", 0.88, 0.84, 0.75], Factor: "Ramp-Up Duration" }
                               ],
                        Display: "Net-Present Value",
                        Mean: 0.846798492915972
                    },
                    {
                       "CombinedUncertaintyLabel":"Combined Uncertainty Range",
                       "Summary":[968676.5576015625,1503386.0173976251,1773143.14625],
                       "ChartTitle":"",
                       "Colors":{"mainColor":"#0E438A","shadowColor":"#9C0E26","combinedUncColor":"#A4C3ED","combinedUncShadowColor":"#D79FA8"},
                       "Key":"Model Outputs'_Total_benefit_A_L",
                       "Units":"Euros per year",
                       "Table":[
                           {
                               "Data":[0.5,0.7760000228881836,0.8999999761581421,968676.5576015625,1503386.0173976251,1743617.8036828125],
                               "Factor":"Fuel Cost"
                           },{
                               "Data":[5000000,6044399,7000000,1282702.02825,1503386.0173976251,1705306.77825],
                               "Factor":"Annual Single Aisle Flights"
                           },{
                               "Data":[300000,525600,700000,1415634.3853976252,1503386.0173976251,1571222.3853976252],
                               "Factor":"Annual Twin Isle Flights"
                           },{
                               "Data":[1500000,2190000,3000000,1496534.0586476251,1503386.0173976251,1511429.6211476251],
                               "Factor":"Annual Regional Flights"
                           },{
                               "Data":[0,0,0,1503386.017387625,1503386.0173976251,1503386.0173976251],
                               "Factor":"European Emission Allowance Permits"
                           },{
                               "Data":[3,5,7,1503386.017387625,1503386.0173976251,1503386.0173976251],
                               "Factor":"Number of years"
                           }
                       ],
                       "Display":"Total Benefit to your airline",
                       "Mean":1420570.488416203
                    }
                ],
                templateName: "productLifecycle"
            }
        };
        tornadoChartDataPreparer = new TornadoChartDataPreparer(tornadoChartConfig.inputData.TornadoDistOutputs[0], tornadoChartConfig.shadowInputData.TornadoDistOutputs[0], tornadoChartConfig.shadowNodeName, tornadoChartConfig.nodeName, tornadoChartConfig.maxBars);
    });

    describe("map shadow data ",function(){
        it("should prepare shadow data which is mapped to input data",function(){
            var mappedShadowData = tornadoChartDataPreparer.mapShadowTableToTable();
            var expectedShadowData: Array<any> = [
                                { Data: [0.05, 0.10, 0.15, 0.013, 0.84, 1.67], Factor: "Fraction of Market Accessible" },
                                { Data: ["0.2", "0.3", "0.4", 0.29, 0.84, 1.40], Factor: "Peak Market Share" },
                                { Data: [1, 2.5, 3, -0.15, 0.84, 1.18], Factor: "Price per unit" },
                                { Data: ["90", "110", "200", 0.55, 0.84, 2.15], Factor: "Available Market Size" },
                                { Data: ["0.1", "0.15", "0.2", -0.81, 0.84, 2.51], Factor: "Gross Margin" },
                                { Data: ["10", "20", "30", 0.39, 0.84, 0.96], Factor: "Peak Market Duration" },
                                { Data: [0.05, 0.10, 0.15, 2.51, 0.84, -0.81], Factor: "Annual SG&A" },
                                { Data: ["1", "2", "4", 0.88, 0.84, 0.75], Factor: "Ramp-Up Duration" },
                                { Data: [0.5, 1, 1.5, 1.11, 0.84, 0.57], Factor: "One-time Launch Costs" }
                               ]
            expect(mappedShadowData).toEqual(expectedShadowData);
        });
    });


    describe("make data to use in chart labeling and tooltip",function(){
        it("should have low data with x, y and label to plot bar chart",function(){
            var lowData: Array<any> = tornadoChartDataPreparer.makeData(3,0,0);
            var expectedLowData: Array<any> = [
                                            {"x":0,"y":58,"label":0.05},
                                            {"x":1,"y":64,"label":"0.25"},
                                            {"x":2,"y":46,"label":1},
                                            {"x":3,"y":73,"label":"500"},
                                            {"x":4,"y":81,"label":"0.45"},
                                            {"x":5,"y":98,"label":"7"},
                                            {"x":6,"y":129,"label":0.05},
                                            {"x":7,"y":114,"label":"1"},
                                            {"x":8,"y":117.39-tornadoChartDataPreparer.DELTA,"label":0.5},
                                            {},
                                            {"x":10,"y":32,"color":'#BBD817', label : '' }
                                         ]
            expect(expectedLowData).toEqual(lowData);
        });
        it("should have high data with x, y and label to plot bar chart",function(){
            var highData: Array<any> = tornadoChartDataPreparer.makeData(5,2,2);
            var expectedHighData: Array<any> = [
                                            {"x":0,"y":176,"label":0.15},
                                            {"x":1,"y":169,"label":"0.65"},
                                            {"x":2,"y":141,"label":3},
                                            {"x":3,"y":146,"label":"1000"},
                                            {"x":4,"y":141,"label":"0.7"},
                                            {"x":5,"y":156,"label":"15"},
                                            {"x":6,"y":105,"label":0.15},
                                            {"x":7,"y":119,"label":"4"},
                                            {"x":8,"y":117.39,"label":1.5},
                                            {},
                                            {"x":10,"y":204,"color":'#BBD817', label : '' }
                                         ]
            expect(expectedHighData).toEqual(highData);
        });
    });

    describe("make shadow data to use in chart labeling and tooltip",function(){
        it("should have low shadow data with x, y and label to plot labels in bar chart",function(){
            var lowShadowData: Array<any> = tornadoChartDataPreparer.makeShadowData(3,0,0);
            var expectedLowShadowData: Array<any> = [
                                            {"x":0.5,"y":0.013,"label":0.05},
                                            {"x":1.5,"y":0.29,"label":"0.2"},
                                            {"x":2.5,"y":-0.15,"label":1},
                                            {"x":3.5,"y":0.55,"label":"90"},
                                            {"x":4.5,"y":-0.81,"label":"0.1"},
                                            {"x":5.5,"y":0.39,"label":"10"},
                                            {"x":6.5,"y":2.51,"label":0.05},
                                            {"x":7.5,"y":0.88,"label":"1"},
                                            {"x":8.5,"y":1.11,"label":0.5},
                                            {},
                                            {"x":10.5,"y":-0.81,"color":'#A9CE00', label : '' }
                                         ]
            expect(expectedLowShadowData).toEqual(lowShadowData);
        });
        it("should have high shadow data with x, y and label to plot labels in bar chart",function(){
            var highShadowData: Array<any> = tornadoChartDataPreparer.makeShadowData(5,2,2);
            var expectedHighShadowData: Array<any> = [
                                            {"x":0.5,"y":1.67,"label":0.15},
                                            {"x":1.5,"y":1.40,"label":"0.4"},
                                            {"x":2.5,"y":1.18,"label":3},
                                            {"x":3.5,"y":2.15,"label":"200"},
                                            {"x":4.5,"y":2.51,"label":"0.2"},
                                            {"x":5.5,"y":0.96,"label":"30"},
                                            {"x":6.5,"y":-0.81,"label":0.15},
                                            {"x":7.5,"y":0.75,"label": "4"},
                                            {"x":8.5,"y":0.57,"label":1.5},
                                            {},
                                            {"x":10.5,"y":4.17,"color":'#A9CE00', label : '' }
                                         ]
            expect(expectedHighShadowData).toEqual(highShadowData);
        });
    });

    describe("make series to use in chart series",function(){
        it("should have series low data to plot bar chart",function(){
            var seriesLowData: Array<any> = tornadoChartDataPreparer.makeSeries(3,0,0);
            var expectedSeriesLowData: Array<any> = [
                {
                    "name": "Breath Strips","color":"#0E438A","threshold":117.39,"grouping":false,"type":"bar",
                    "data":[{"x":0,"y":58,"label":0.05}]
                },{
                    "name": "Breath Strips", "color":"#0E438A","threshold":117.39,"grouping":false,"type":"bar",
                    "data":[{"x":1,"y":64,"label":"0.25"}], "linkedTo": ":previous"
                },{
                    "name": "Breath Strips","color":"#0E438A","threshold":117.39,"grouping":false,"type":"bar",
                    "data":[{"x":2,"y":46,"label":1}], "linkedTo": ":previous"
                },{
                    "name": "Breath Strips","color":"#0E438A","threshold":117.39,"grouping":false,"type":"bar",
                    "data":[{"x":3,"y":73,"label":"500"}], "linkedTo": ":previous"
                },{
                    "name": "Breath Strips","color":"#0E438A","threshold":117.39,"grouping":false,"type":"bar",
                    "data":[{"x":4,"y":81,"label":"0.45"}], "linkedTo": ":previous"
                },{
                    "name": "Breath Strips","color":"#0E438A","threshold":117.39,"grouping":false,"type":"bar",
                    "data":[{"x":5,"y":98,"label":"7"}], "linkedTo": ":previous"
                },{
                    "name": "Breath Strips","color":"#0E438A","threshold":117.39,"grouping":false,"type":"bar",
                    "data":[{"x":6,"y":129,"label":0.05}], "linkedTo": ":previous"
                },{
                    "name": "Breath Strips","color":"#0E438A","threshold":117.39,"grouping":false,"type":"bar",
                    "data":[{"x":7,"y":114,"label":"1"}], "linkedTo": ":previous"
                },{
                    "name": "Breath Strips", "color":"#0E438A","threshold":117.39,"grouping":false,"type":"bar",
                    "data":[{"x":8,"y":117.38999,"label":0.5}], "linkedTo": ":previous"
                },{
                    "linkedTo": ":previous"
                },{
                    "color":"#A4C3ED","threshold":84,"grouping":false,"type":"bar",
                    "data":[{"x":10,"y":32,"label":""}], "linkedTo": ":previous"
                }
            ]
            expect(expectedSeriesLowData).toEqual(seriesLowData);
        });
        it("should have series high data to plot bar chart",function(){
            var seriesHighData: Array<any> = tornadoChartDataPreparer.makeSeries(5,2,2, true);
            var expectedSeriesHighData: Array<any> = [
                {
                   "name": "Breath Strips",color : '#0E438A', threshold : 117.39, grouping : false, type : 'bar',
                    data : [ { x : 0, y : 176, label : 0.15 } ], "linkedTo": ":previous"
                }, {
                    "name": "Breath Strips",color : '#0E438A', threshold : 117.39, grouping : false, type : 'bar',
                    data : [ { x : 1, y : 169, label : '0.65' } ], "linkedTo": ":previous"
                }, {
                    "name": "Breath Strips",color : '#0E438A', threshold : 117.39, grouping : false, type : 'bar',
                    data : [ { x : 2, y : 141, label : 3 } ], "linkedTo": ":previous"
                }, {
                    "name": "Breath Strips",color : '#0E438A', threshold : 117.39, grouping : false, type : 'bar',
                    data : [ { x : 3, y : 146, label : '1000' } ], "linkedTo": ":previous"
                }, {
                    "name": "Breath Strips",color : '#0E438A', threshold : 117.39, grouping : false, type : 'bar',
                    data : [ { x : 4, y : 141, label : '0.7' } ], "linkedTo": ":previous"
                }, {
                    "name": "Breath Strips",color : '#0E438A', threshold : 117.39, grouping : false, type : 'bar',
                    data : [ { x : 5, y : 156, label : '15' } ], "linkedTo": ":previous"
                }, {
                    "name": "Breath Strips",color : '#0E438A', threshold : 117.39, grouping : false, type : 'bar',
                    data : [ { x : 6, y : 105, label : 0.15 } ], "linkedTo": ":previous"
                }, {
                    "name": "Breath Strips",color : '#0E438A', threshold : 117.39, grouping : false, type : 'bar',
                    data : [ { x : 7, y : 119, label : '4' } ], "linkedTo": ":previous"
                }, {
                    "name": "Breath Strips",color : '#0E438A', threshold : 117.39, grouping : false, type : 'bar',
                    data : [ { x : 8, y : 117.39, label : 1.5 } ], "linkedTo": ":previous"
                }, {
                    "linkedTo": ":previous"
                }, {
                    color : '#A4C3ED', threshold : 84, grouping : false, type : 'bar',
                    data : [ { x : 10, y : 204, label : '' } ], "linkedTo": ":previous"
                }
            ]
            expect(expectedSeriesHighData).toEqual(seriesHighData);
        });
    });

    describe("make shadow series to use in chart series",function(){
        it("should have series shadow low data to plot bar chart",function(){
            var seriesShadowLowData: Array<any> = tornadoChartDataPreparer.makeShadowSeries(3,0,0);
            var expectedSeriesShadowLowData: Array<any> = [
                {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 0.5, y : 0.013, label : 0.05 } ]
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 1.5, y : 0.29, label : '0.2' } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 2.5, y : -0.15, label : 1 } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 3.5, y : 0.55, label : '90' } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 4.5, y : -0.81, label : '0.1' } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 5.5, y : 0.39, label : '10' } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 6.5, y : 2.51, label : 0.05 } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 7.5, y : 0.88, label : '1' } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 8.5, y : 1.11, label : 0.5 } ], linkedTo: ":previous"
                }, {
                    linkedTo: ":previous"
                }, {
                     threshold : 0.84, grouping : false, type : 'bar', color : '#D79FA8',
                    data : [ { x : 10.5, y : -0.81, label : '' } ], linkedTo: ":previous"
                }
            ]
            expect(expectedSeriesShadowLowData).toEqual(seriesShadowLowData);
        });
        it("should have series shadow high data to plot bar chart",function(){
            var seriesShadowHighData: Array<any> = tornadoChartDataPreparer.makeShadowSeries(5,2,2);
            var expectedSeriesShadowHighData: Array<any> = [
                {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 0.5, y : 1.67, label : 0.15 } ]
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 1.5, y : 1.4, label : '0.4' } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 2.5, y : 1.18, label : 3 } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 3.5, y : 2.15, label : '200' } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 4.5, y : 2.51, label : '0.2' } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 5.5, y : 0.96, label : '30' } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 6.5, y : -0.81, label : 0.15 } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 7.5, y : 0.75, label : '4' } ], linkedTo: ":previous"
                }, {
                    name: "Shoe Inserts", color : '#9C0E26', threshold : 0.84, grouping : false, type : 'bar',
                    data : [ { x : 8.5, y : 0.57, label : 1.5 } ], linkedTo: ":previous"
                }, {
                    linkedTo: ":previous"
                }, {
                     threshold : 0.84, grouping : false, type : 'bar', color : '#D79FA8',
                    data : [ { x : 10.5, y : 4.17, label : '' } ], linkedTo: ":previous"
                }
            ]
            expect(expectedSeriesShadowHighData).toEqual(seriesShadowHighData);
        });
    });


    describe("make factors to use in X-axis of chart",function(){
        it("should prepare Factors",function(){
            var actualFactors = tornadoChartDataPreparer.makeFactors();
            var expectedFactors = [
                                            "Fraction of Market Accessible",
                                            "Peak Market Share",
                                            "Price per unit",
                                            "Available Market Size",
                                            "Gross Margin",
                                            "Peak Market Duration",
                                            "Annual SG&A",
                                            "Ramp-Up Duration",
                                            "One-time Launch Costs",
                                            "",
                                            "Combined Uncertainty Range",
                                            ""
                                         ]
            expect(expectedFactors).toEqual(actualFactors);
        });
    });

    describe("should prepare accessors", function() {
        it("units", function() {
            expect(tornadoChartDataPreparer.units()).toEqual("Millions of dollars");
        });
        
    });

    describe("zero adjustment", function() {
        it("should make adjustment", function() {
            var low = tornadoChartDataPreparer.table[8].Data[3];
            var high = tornadoChartDataPreparer.table[8].Data[5];
            expect(high-low-tornadoChartDataPreparer.DELTA < 0.000000001).toBe(true);
        });
    });

    describe("export table", function() {
        it("should prepare CSV", function() {
            var actualCsv = tornadoChartDataPreparer.toCsv();
            var expectedCsv = "Factors,Low Input,Base Input,High Input,Low Output,Base Output,High Output\n"+
                "\"Fraction of Market Accessible - Breath Strips\",0.05,0.1,0.15,58,117.39,176\n"+
                "\"Fraction of Market Accessible - Shoe Inserts\",0.05,0.1,0.15,0.013,0.84,1.67\n"+
                "\"Peak Market Share - Breath Strips\",0.25,0.45,0.65,64,117.39,169\n"+
                "\"Peak Market Share - Shoe Inserts\",0.2,0.3,0.4,0.29,0.84,1.4\n"+
                "\"Price per unit - Breath Strips\",1,2.5,3,46,117.39,141\n"+
                "\"Price per unit - Shoe Inserts\",1,2.5,3,-0.15,0.84,1.18\n"+
                "\"Available Market Size - Breath Strips\",500,800,1000,73,117.39,146\n"+
                "\"Available Market Size - Shoe Inserts\",90,110,200,0.55,0.84,2.15\n"+
                "\"Gross Margin - Breath Strips\",0.45,0.6,0.7,81,117.39,141\n"+
                "\"Gross Margin - Shoe Inserts\",0.1,0.15,0.2,-0.81,0.84,2.51\n"+
                "\"Peak Market Duration - Breath Strips\",7,9,15,98,117.39,156\n"+
                "\"Peak Market Duration - Shoe Inserts\",10,20,30,0.39,0.84,0.96\n"+
                "\"Annual SG&A - Breath Strips\",0.05,0.1,0.15,129,117.39,105\n"+
                "\"Annual SG&A - Shoe Inserts\",0.05,0.1,0.15,2.51,0.84,-0.81\n"+
                "\"Ramp-Up Duration - Breath Strips\",1,2,4,114,117.39,119\n"+
                "\"Ramp-Up Duration - Shoe Inserts\",1,2,4,0.88,0.84,0.75\n"+
                "\"One-time Launch Costs - Breath Strips\",0.5,1,1.5,117.38999,117.39,117.39\n"+
                "\"One-time Launch Costs - Shoe Inserts\",0.5,1,1.5,1.11,0.84,0.57\n"+
                "\"Combined Uncertainty Range - Breath Strips\",Low,Base,High,32,84,204\n"+
                "\"Combined Uncertainty Range - Shoe Inserts\",Low,Base,High,-0.81,0.84,4.17\n";
            expect(actualCsv).toBe(expectedCsv);
        });
    });

    describe("find threshold", function() {
        it("should detect the threshold from the data", function() {
            var series = new Series(
                tornadoChartDataPreparer.table,
                tornadoChartDataPreparer.summary,
                tornadoChartDataPreparer.nodeName,
                tornadoChartDataPreparer.baseValue,
                '',''
            )
            var actualThreshold1 = series.findThreshold(58, 117.39, 176);
            var expectedThreshold1 = 117.39
            expect(actualThreshold1).toEqual(expectedThreshold1);

            var actualThreshold2 = series.findThreshold(117.39, 117.39, 117.39);
            var expectedThreshold2 = 117.39
            expect(actualThreshold2).toEqual(expectedThreshold2);

            var actualThreshold3 = series.findThreshold(117.49, 117.39, 117.29);
            var expectedThreshold3 = 117.39
            expect(actualThreshold3).toEqual(expectedThreshold3);

            var actualThreshold4 = series.findThreshold(117.49, 117.39, 117.59);
            var expectedThreshold4 = 117.59
            expect(actualThreshold4).toEqual(expectedThreshold4);

            var actualThreshold5 = series.findThreshold(117.29, 117.39, 117.19);
            var expectedThreshold5 = 117.29
            expect(actualThreshold5).toEqual(expectedThreshold5);

            var actualThreshold6 = series.findThreshold(117.19, 117.39, 117.19);
            var expectedThreshold6 = 117.19
            expect(actualThreshold6).toEqual(expectedThreshold6);

            var actualThreshold7 = series.findThreshold(117.19, 117.39, 117.29);
            var expectedThreshold7 = 117.29
            expect(actualThreshold7).toEqual(expectedThreshold7);

        });

        it("should detect the threshold from the shadow data", function() {
            var series = new Series(
                tornadoChartDataPreparer.shadowTable,
                tornadoChartDataPreparer.shadowSummary,
                tornadoChartDataPreparer.shadowNodeName,
                tornadoChartDataPreparer.shadowBaseValue,
                '',''
            )
            var actualThreshold1 = series.findThreshold(0.013, 0.84, 1.67);
            var expectedThreshold1 = 0.84
            expect(actualThreshold1).toEqual(expectedThreshold1);

            var actualThreshold2 = series.findThreshold(0.84, 0.84, 0.84);
            var expectedThreshold2 = 0.84
            expect(actualThreshold2).toEqual(expectedThreshold2);

            var actualThreshold3 = series.findThreshold(1.67, 0.84, 0.067);
            var expectedThreshold3 = 0.84
            expect(actualThreshold3).toEqual(expectedThreshold3);

            var actualThreshold4 = series.findThreshold(0.94, 0.84, 1.04);
            var expectedThreshold4 = 1.04
            expect(actualThreshold4).toEqual(expectedThreshold4);

            var actualThreshold5 = series.findThreshold(0.74, 0.84, 0.64);
            var expectedThreshold5 = 0.74
            expect(actualThreshold5).toEqual(expectedThreshold5);

            var actualThreshold6 = series.findThreshold(0.64, 0.84, 0.64);
            var expectedThreshold6 = 0.64
            expect(actualThreshold6).toEqual(expectedThreshold6);

            var actualThreshold7 = series.findThreshold(0.64, 0.84, 0.74);
            var expectedThreshold7 = 0.74
            expect(actualThreshold7).toEqual(expectedThreshold7);

        });
    });
});
/// <reference path="../../../../lib/vendor-type-definitions/jasmine.d.ts" />
/// <reference path="../../app/js/logic/tornado-chart-maker.ts" />
/// <reference path="../../app/js/plumbing/controllerTornadoChart.ts" />

describe("Tornado Chart Maker Tests",function() {


    var tornadoChartMaker: TornadoChartMaker;
    var chartData: TornadoChartDataForTesting;
    var inputData: any;

    beforeEach(function() {
        chartData = new TornadoChartDataForTesting();
        inputData = chartData.inputData();
        var shadowInputData = chartData.shadowInputData();
        var shadowNodeName: string = "Shadow Node";
        var nodeName: string = "Node";
        var maxBars: number = 10;
        tornadoChartMaker = new TornadoChartMaker(inputData, shadowInputData, shadowNodeName, nodeName, maxBars);
    });
    describe("Metalog", function() {
        it("should detect presence", function() {
           expect(tornadoChartMaker.metaLogPresent).toBe(true);
        });
        it("should detect absence", function() {
            inputData = chartData.inputData();
            delete inputData.MetaLogOutputs;
            var shadowInputData = chartData.shadowInputData();
            delete shadowInputData.MetaLogOutputs;
            var shadowNodeName: string = "Shadow Node";
            var nodeName: string = "Node";
            var maxBars: number = 10;
            tornadoChartMaker = new TornadoChartMaker(inputData, shadowInputData, shadowNodeName, nodeName, maxBars);
            expect(tornadoChartMaker.metaLogPresent).toBe(false);
        });
        describe("initialize", function() {
            beforeEach(function() {
                tornadoChartMaker.initialize();
            });
            it("should create metalog Outputs", function() {
                expect(tornadoChartMaker.metaLog).not.toBe(undefined);
            });
            it("should create data points for CDF", function() {
                expect(tornadoChartMaker.metaLogData).not.toBe(null);
                expect(tornadoChartMaker.metaLogData.length).toEqual(999);
                expect(tornadoChartMaker.metaLogData[0].y).toEqual(0.001);
            });
            it("should create fitted points array", function() {
                var fittedPoints = tornadoChartMaker.fittedPoints(inputData);
                expect(fittedPoints[0]).toEqual(
                    [0.7267024750731296, 0.015625]
                );
                expect(fittedPoints.length).toEqual(19);
            });
            it("should create CDF Curve", function() {
                var cdf = tornadoChartMaker.curveToPoints();
                expect(cdf[0]).toEqual([-3.3886256454151225,0.001])
            });
        });


    });

});

class TornadoChartDataForTesting {
    inputData() {
        return {
            "CombinedUncertaintyLabel": "Combined Uncertainty Range",
            "Summary": [2.2047197510478362, 7.694498204668178, 20.36321771302281],
            "ChartTitle": "Tornado of Net-Present Value",
            "Colors": {
                "mainColor": "#538DD5",
                "shadowColor": "#F9A65A",
                "combinedUncColor": "#A4C3ED",
                "combinedUncShadowColor": "#F7C18F"
            },
            "MetaLogOutputs": {
                "FittedPoints": {
                    "Probabilities": [0.015625, 0.046875, 0.125, 0.25, 0.265625, 0.390625, 0.421875, 0.4375, 0.5625, 0.609375, 0.640625, 0.703125, 0.765625, 0.8125, 0.84375, 0.90625, 0.921875, 0.953125, 0.984375],
                    "Values": [0.7267024750731296, 1.3601384504908611, 2.2047197510478362, 3.4715917018833, 3.6827370270225432, 5.160754302997251, 5.583044953275738, 6.638771578971958, 7.694498204668178, 8.116788854946664, 9.805951456060615, 11.072823406896081, 11.917404707453054, 14.02885795884549, 16.984892510794907, 20.36321771302281, 21.41894433871903, 28.809030718592563, 30.920483969985003]
                },
                "Panel": [{
                    "NumberOfTerms": 2,
                    "Feasible": true,
                    "Coefficients": [9.74961446156664, 4.027776861324224],
                    "InfeasibilityCause": 0
                }, {
                    "NumberOfTerms": 3,
                    "Feasible": true,
                    "Coefficients": [6.702971689930668, 3.9538347657949395, 4.981545572450251],
                    "InfeasibilityCause": 0
                }, {
                    "NumberOfTerms": 4,
                    "Feasible": true,
                    "Coefficients": [6.665574132557253, 3.493423412560264, 4.979335569577238, 3.080652298379377],
                    "InfeasibilityCause": 0
                }, {
                    "NumberOfTerms": 5,
                    "Feasible": true,
                    "Coefficients": [6.507780580719553, 3.5317272211337256, 4.063173054606832, 2.7289294298636335, 7.4477484228429205],
                    "InfeasibilityCause": 0
                }, {
                    "NumberOfTerms": 6,
                    "Feasible": false,
                    "Coefficients": [6.596625892309191, -5.490186009782462, 4.451131005735142, 34.434794473053984, 3.6700841259501544, 22.02404648666318],
                    "InfeasibilityCause": 3
                }, {
                    "NumberOfTerms": 7,
                    "Feasible": false,
                    "Coefficients": [6.581203736640672, -61.46985637567826, 4.1988035517227935, 262.7667227268936, 5.759355068731651, 210.57748011453566, -546.7601996095698],
                    "InfeasibilityCause": 3
                }, {
                    "NumberOfTerms": 8,
                    "Feasible": false,
                    "Coefficients": [7.062881927358545, -54.773395326371855, -21.769924889304207, 236.2059079762479, 85.16921041055406, 188.80053161933085, -491.21393670526845, 69.2721325128995],
                    "InfeasibilityCause": 3
                }, {
                    "NumberOfTerms": 9,
                    "Feasible": false,
                    "Coefficients": [6.727588281928057, -51.49065788085227, -184.9844789689339, 222.5555268272485, 768.0238614261473, 176.97450831134108, -451.62461139982406, 629.5110700916723, -1747.8951768223915],
                    "InfeasibilityCause": 3
                }, {
                    "NumberOfTerms": 10,
                    "Feasible": false,
                    "Coefficients": [6.761886201141945, -588.3678837445905, -180.68300864655515, 2365.027247052158, 747.045489983559, 2683.3941131018155, -7424.300254972812, 611.1584649775059, -1659.3718978389866, -2005.801396702721],
                    "InfeasibilityCause": 3
                }]
            },
            "Key": "Calculations_npv",
            "Units": "Millions of dollars",
            "Table": [{
                "Data": ["40", "80", "200", 3.4715917018833, 7.694498204668178, 20.36321771302281],
                "Factor": "Total Addressable Market"
            }, {
                "Data": [0.05000000074505806, 0.10000000149011612, 0.15000000596046448, 3.4715917018833, 7.694498204668178, 11.917404707453054],
                "Factor": "Market Penetration"
            }, {
                "Data": ["0.45", "0.6", "0.8", 5.160754302997249, 7.694498204668178, 11.072823406896081],
                "Factor": "Gross Margin"
            }, {
                "Data": ["0.25", "0.45", "0.5", 3.940803535526064, 7.694498204668178, 8.632921871953705],
                "Factor": "Peak Market Share"
            }, {
                "Data": ["7", "9", "15", 6.445447260376551, 7.694498204668178, 10.70115497486143],
                "Factor": "Peak Market Duration"
            }, {
                "Data": [0.05000000074505806, 0.10000000149011612, 0.15000000596046448, 8.539079505225153, 7.694498204668178, 6.849916904111201],
                "Factor": "Annual SG&A"
            }, {
                "Data": [0.07999999821186066, 0.10000000149011612, 0.11999999731779099, 7.2421427444570154, 7.694498204668178, 8.16360569067551],
                "Factor": "Market Short-Term Growth Rate"
            }, {
                "Data": [2, 3, 4, 7.233817495273463, 7.694498204668178, 8.151090162357852],
                "Factor": "Market Short-Term Growth Duration"
            }, {
                "Data": [0.029999999329447746, 0.03999999910593033, 0.05000000074505806, 7.321193989605614, 7.694498204668178, 8.088647691277885],
                "Factor": "Market Long-term Growth Rate"
            }, {
                "Data": [0.5, 1, 1.5, 8.070155605118966, 7.694498204668178, 7.318840804217389],
                "Factor": "One-time Launch Costs"
            }, {
                "Data": ["1", "2", "4", 7.619006735358249, 7.694498204668178, 7.80476756930765],
                "Factor": "Ramp-Up Duration"
            }],
            "Display": "Net-Present Value",
            "Mean": 10.069883112484671
        };
    }

    shadowInputData() {
        return {
            "CombinedUncertaintyLabel": "Combined Uncertainty Range",
            "Summary": [-0.751314800901577, 0.46696098945074943, 2.903512570155404],
            "ChartTitle": "Tornado of Net-Present Value",
            "Colors": {
                "mainColor": "#538DD5",
                "shadowColor": "#F9A65A",
                "combinedUncColor": "#A4C3ED",
                "combinedUncShadowColor": "#F7C18F"
            },
            "MetaLogOutputs": {
                "FittedPoints": {
                    "Probabilities": [0.015625, 0.046875, 0.0625, 0.3125, 0.40625, 0.59375, 0.65625, 0.75, 0.875, 0.890625, 0.921875, 0.984375],
                    "Values": [-4.159079249439561, -2.625585247597466, -2.2848088027436693, -0.751314800901577, 0.24545630029578244, 0.46696098945074943, 1.2422274014931407, 1.4637320906481062, 1.6852367798030758, 2.2389985026905004, 2.903512570155404, 3.6787789821977945]
                },
                "Panel": [{
                    "NumberOfTerms": 2,
                    "Feasible": true,
                    "Coefficients": [0.20307048566671768, 0.9540223981367231],
                    "InfeasibilityCause": 0
                }, {
                    "NumberOfTerms": 3,
                    "Feasible": true,
                    "Coefficients": [0.4054801618615692, 0.9437999586052356, -0.24733334269883678],
                    "InfeasibilityCause": 0
                }, {
                    "NumberOfTerms": 4,
                    "Feasible": true,
                    "Coefficients": [0.396591089510675, 0.9034644730095871, -0.24405231139533923, 0.28155328904189325],
                    "InfeasibilityCause": 0
                }, {
                    "NumberOfTerms": 5,
                    "Feasible": true,
                    "Coefficients": [0.31961614632232493, 0.9417630928145277, -0.6380646225127311, -0.00918378584107682, 3.2824771263998276],
                    "InfeasibilityCause": 0
                }, {
                    "NumberOfTerms": 6,
                    "Feasible": true,
                    "Coefficients": [0.3140081181756383, 1.5951171151831556, -0.6311019028507361, -2.1853837343288163, 3.215403324415206, -1.6694427000227563],
                    "InfeasibilityCause": 0
                }, {
                    "NumberOfTerms": 7,
                    "Feasible": false,
                    "Coefficients": [0.27955070291605477, -20.760393546110507, -1.0560702048258546, 88.29926624164187, 6.982168980587062, 73.60429391195336, -214.61634667129582],
                    "InfeasibilityCause": 3
                }, {
                    "NumberOfTerms": 8,
                    "Feasible": false,
                    "Coefficients": [0.5073017941432266, -11.989971382512856, -10.141128795537403, 53.04486239232796, 31.50455712929132, 43.50650910981603, -126.59487266003566, 25.953995703922136],
                    "InfeasibilityCause": 3
                }, {
                    "NumberOfTerms": 9,
                    "Feasible": false,
                    "Coefficients": [0.3650703207525924, -8.207197041500226, -95.46518108615726, 37.58681384780916, 384.1381675813062, 29.596653173074614, -79.59227457945862, 316.8022039100141, -877.7621370839902],
                    "InfeasibilityCause": 3
                }, {
                    "NumberOfTerms": 10,
                    "Feasible": false,
                    "Coefficients": [0.4554285115920381, -382.1744946359108, -137.34594880901585, 1530.299443126713, 547.0471365711791, 1774.0877388366582, -4924.80441350306, 453.14651811340053, -1213.0652048099005, -1397.6980754429428],
                    "InfeasibilityCause": 3
                }]
            },
            "Key": "Calculations_npv",
            "Units": "Millions of dollars",
            "Table": [{
                "Data": ["0.1", "0.15", "0.2", -0.7513148009015789, 0.46696098945075004, 1.6852367798030758],
                "Factor": "Gross Margin"
            }, {
                "Data": [0.05000000074505806, 0.10000000149011612, 0.15000000596046448, 1.6852367798030778, 0.46696098945075004, -0.751314800901577],
                "Factor": "Annual SG&A"
            }, {
                "Data": ["90", "110", "200", 0.24545630029578244, 0.46696098945075004, 1.4637320906481104],
                "Factor": "Total Addressable Market"
            }, {
                "Data": [0.05000000074505806, 0.10000000149011612, 0.15000000596046448, -0.1421769057254137, 0.46696098945075004, 1.0760988846269142],
                "Factor": "Market Penetration"
            }, {
                "Data": ["0.2", "0.3", "0.4", 0.06086905933330798, 0.46696098945075004, 0.8730529195681938],
                "Factor": "Peak Market Share"
            }, {
                "Data": [0.5, 1, 1.5, 0.8426183899015388, 0.46696098945075004, 0.09130358899996138],
                "Factor": "One-time Launch Costs"
            }, {
                "Data": ["10", "20", "30", 0.07549272699783889, 0.46696098945075004, 0.5715469858313559],
                "Factor": "Peak Market Duration"
            }, {
                "Data": [0.029999999329447746, 0.03999999910593033, 0.05000000074505806, 0.37136372006185653, 0.46696098945075004, 0.5740446305942648],
                "Factor": "Market Long-term Growth Rate"
            }, {
                "Data": [2, 3, 4, 0.4005095827042602, 0.46696098945075004, 0.5344350367490731],
                "Factor": "Market Short-Term Growth Duration"
            }, {
                "Data": [0.07999999821186066, 0.10000000149011612, 0.11999999731779099, 0.4017104676305881, 0.46696098945075004, 0.5346279260616954],
                "Factor": "Market Short-Term Growth Rate"
            }, {
                "Data": ["1", "2", "4", 0.48566072260744203, 0.46696098945075004, 0.4299455497446166],
                "Factor": "Ramp-Up Duration"
            }],
            "Display": "Net-Present Value",
            "Mean": 0.6132552523000948
        };
    }
}
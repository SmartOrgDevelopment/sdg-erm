/// <reference path="../../../../lib/vendor-type-definitions/jasmine.d.ts" />
/// <reference path="../../app/js/logic/metalog.ts" />
describe("Tornado Chart Data Preparer Tests", function () {
    var metaLogPanel;
    beforeEach(function () {
        var panel;
        panel = [{
                NumberOfTerms: 2,
                Feasible: true,
                Coefficients: [76.3, 60.337],
                InfeasibilityCause: 0
            }, {
                NumberOfTerms: 3,
                Feasible: true,
                Coefficients: [157.917558, 99.2933096, 112.833306],
                InfeasibilityCause: 0
            }, {
                NumberOfTerms: 4,
                Feasible: true,
                Coefficients: [6.665574132557253, 3.493423412560264, 4.979335569577238, 3.080652298379377],
                InfeasibilityCause: 0
            }, {
                NumberOfTerms: 5,
                Feasible: true,
                Coefficients: [6.507780580719553, 3.5317272211337256, 4.063173054606832, 2.7289294298636335, 7.4477484228429205],
                InfeasibilityCause: 0
            }, {
                NumberOfTerms: 6,
                Feasible: false,
                Coefficients: [12.8539, 71.2357, 122.5393, -191.4313, -124.0171, 68.2779],
                InfeasibilityCause: 3
            }, {
                NumberOfTerms: 7,
                Feasible: false,
                Coefficients: [12.85391717, 155.3764136, 122.5392993, -544.2305865, -124.0171304, -239.5439848, 1039.497025],
                InfeasibilityCause: 3
            }, {
                NumberOfTerms: 8,
                Feasible: false,
                Coefficients: [13.0671945, 155.3764136, 116.6231878, -544.2305865, -109.4602262, -239.5439848, 1039.497025, 18.43651297],
                InfeasibilityCause: 3
            }, {
                NumberOfTerms: 9,
                Feasible: false,
                Coefficients: [15.60470873, 155.3764136, 509.9790045, -544.2305865, -1868.272761, -239.5439848, 1039.497025, -1447.887437, 5569.713896],
                InfeasibilityCause: 3
            }, {
                NumberOfTerms: 10,
                Feasible: false,
                Coefficients: [6.761886201141945, -588.3678837445905, -180.68300864655515, 2365.027247052158, 747.045489983559, 2683.3941131018155, -7424.300254972812, 611.1584649775059, -1659.3718978389866, -2005.801396702721],
                InfeasibilityCause: 3
            }];
        metaLogPanel = new MetaLogPanel(panel);
    });
    it("should find highest feasible panel", function () {
        var highestFeasiblePanel = metaLogPanel.highestFeasiblePanel();
        expect(highestFeasiblePanel.NumberOfTerms).toBe(5);
        expect(highestFeasiblePanel.Feasible).toBe(true);
    });
    describe("metalog", function () {
        var metaLog;
        describe("2 terms", function () {
            beforeEach(function () {
                metaLog = new MetaLog(metaLogPanel.panel[0].Coefficients);
            });
            it("should know the number of terms", function () {
                expect(metaLog.numberOfTerms).toBe(2);
            });
            it("should calculate CDF correctly", function () {
                expect(metaLog.cdf(0.010)).toBeCloseTo(-200.95575, 2);
                expect(metaLog.cdf(0.1)).toBeCloseTo(-56.27, 2);
                expect(metaLog.cdf(0.5)).toBeCloseTo(76.3, 2);
                expect(metaLog.cdf(0.9)).toBeCloseTo(208.873, 2);
            });
        });
        describe("3 terms", function () {
            beforeEach(function () {
                metaLog = new MetaLog(metaLogPanel.panel[1].Coefficients);
            });
            it("should know the number of terms", function () {
                expect(metaLog.numberOfTerms).toBe(3);
            });
            it("should calculate CDF correctly", function () {
                expect(metaLog.cdf(0.010)).toBeCloseTo(-44.29, 2);
                expect(metaLog.cdf(0.1)).toBeCloseTo(38.92, 2);
                expect(metaLog.cdf(0.5)).toBeCloseTo(157.92, 2);
                expect(metaLog.cdf(0.9)).toBeCloseTo(475.255, 2);
            });
        });
        describe("4 terms", function () {
            beforeEach(function () {
                metaLog = new MetaLog(metaLogPanel.panel[2].Coefficients);
            });
            it("should know the number of terms", function () {
                expect(metaLog.numberOfTerms).toBe(4);
            });
            it("should calculate CDF correctly", function () {
                expect(metaLog.cdf(0.010)).toBeCloseTo(0.31, 2);
                expect(metaLog.cdf(0.1)).toBeCloseTo(2.13, 2);
                expect(metaLog.cdf(0.5)).toBeCloseTo(6.67, 2);
                expect(metaLog.cdf(0.9)).toBeCloseTo(19.95, 2);
            });
        });
        describe("5 terms", function () {
            beforeEach(function () {
                metaLog = new MetaLog(metaLogPanel.panel[3].Coefficients);
            });
            it("should know the number of terms", function () {
                expect(metaLog.numberOfTerms).toBe(5);
            });
            it("should calculate CDF correctly", function () {
                expect(metaLog.cdf(0.010)).toBeCloseTo(-0.12, 2);
                expect(metaLog.cdf(0.1)).toBeCloseTo(2.42, 2);
                expect(metaLog.cdf(0.5)).toBeCloseTo(6.51, 2);
                expect(metaLog.cdf(0.9)).toBeCloseTo(20.12, 2);
            });
        });
        describe("6 terms", function () {
            beforeEach(function () {
                metaLog = new MetaLog(metaLogPanel.panel[4].Coefficients);
            });
            it("should know the number of terms", function () {
                expect(metaLog.numberOfTerms).toBe(6);
            });
            it("should calculate CDF correctly", function () {
                expect(metaLog.cdf(0.010)).toBeCloseTo(-49.88, 2);
                expect(metaLog.cdf(0.1)).toBeCloseTo(-3.24, 2);
                expect(metaLog.cdf(0.5)).toBeCloseTo(12.85, 2);
                expect(metaLog.cdf(0.9)).toBeCloseTo(204.66, 2);
            });
        });
        describe("7 terms", function () {
            beforeEach(function () {
                metaLog = new MetaLog(metaLogPanel.panel[5].Coefficients);
            });
            it("should know the number of terms", function () {
                expect(metaLog.numberOfTerms).toBe(7);
            });
            it("should calculate CDF correctly", function () {
                expect(metaLog.cdf(0.010)).toBeCloseTo(-46.32, 2);
                expect(metaLog.cdf(0.1)).toBeCloseTo(-5.31, 2);
                expect(metaLog.cdf(0.5)).toBeCloseTo(12.85, 2);
                expect(metaLog.cdf(0.9)).toBeCloseTo(206.73, 2);
            });
        });
        describe("8 terms", function () {
            beforeEach(function () {
                metaLog = new MetaLog(metaLogPanel.panel[6].Coefficients);
            });
            it("should know the number of terms", function () {
                expect(metaLog.numberOfTerms).toBe(8);
            });
            it("should calculate CDF correctly", function () {
                expect(metaLog.cdf(0.010)).toBeCloseTo(-45.97, 2);
                expect(metaLog.cdf(0.1)).toBeCloseTo(-5.37, 2);
                expect(metaLog.cdf(0.5)).toBeCloseTo(13.07, 2);
                expect(metaLog.cdf(0.9)).toBeCloseTo(206.66, 2);
            });
        });
        describe("9 terms", function () {
            beforeEach(function () {
                metaLog = new MetaLog(metaLogPanel.panel[7].Coefficients);
            });
            it("should know the number of terms", function () {
                expect(metaLog.numberOfTerms).toBe(9);
            });
            it("should calculate CDF correctly", function () {
                expect(metaLog.cdf(0.010)).toBeCloseTo(-51.67, 2);
                expect(metaLog.cdf(0.1)).toBeCloseTo(-2.14, 2);
                expect(metaLog.cdf(0.5)).toBeCloseTo(15.6, 2);
                expect(metaLog.cdf(0.9)).toBeCloseTo(209.90, 2);
            });
        });
    });
});
//# sourceMappingURL=metalog-spec.js.map
/// <reference path="tornado-data-preparer.ts" />

interface TornadoChartConfig {
    maxBars: number;
    nodeName: string;
    inputData :any;
    shadowInputData: any;
}

interface inputData {
    TornadoDistOutputs: Array<any>;
}

interface shadowInputData {
    TornadoDistOutputs: Array<any>;
    templateName: string;
}

interface TornadoDistOutputs {
    CombinedUncertaintyLabel: string
    Summary: Array<number>;
    ChartTitle: string;
    Key: string;
    Units: string;
    Table: Array<any>;
    Display: string;
    Mean: number;
}

class TornadoChartMaker {
    dataPreparer: TornadoChartDataPreparer;
    color: string;
    shadowColor: string;
    units: string;
    chartTitle: string;
    outputTitle: string;
    factors: Array<string>;

    constructor(inputData, shadowInputData, shadowNodeName: string, nodeName: string, maxBars: number) {
        this.dataPreparer = new TornadoChartDataPreparer(inputData, shadowInputData, shadowNodeName, nodeName, maxBars);
    }

    plot() {
        this.initialize();
        this.draw();
    }

    initialize() {
        this.color = this.dataPreparer.inputData.Colors.mainColor;
        if (this.dataPreparer.shadowInputData) {
            this.shadowColor = this.dataPreparer.shadowInputData.Colors.shadowColor;
        }
        this.units = this.dataPreparer.units();
        this.chartTitle = this.dataPreparer.chartTitle();
        this.outputTitle = this.dataPreparer.outputTitle();
    }

    getDate() {
        return this.dataPreparer.getDate();
    }

    toCsv() {
        return this.dataPreparer.toCsv();
    }

    makeFactors() {
        return this.dataPreparer.makeFactors();
    }

    mapShadowTableToTable() {
        return this.dataPreparer.mapShadowTableToTable();
    }

    makeTableData() {
        return this.dataPreparer.makeTableData();
    }

    findChartHeight(factors, x) {
        if (factors.length <= 5) {
            var chartHeight = 300 + (x * x)
        } else if (factors.length <= 10) {
            var chartHeight = 400 + (x * x)
        } else {
            var chartHeight = factors.length * (40 + x)
        }
        return chartHeight
    }

    draw() {
        var factors = this.makeFactors();
        var lowData = this.dataPreparer.makeData(3, 0, 0);
        var highData = this.dataPreparer.makeData(5, 2, 2);
        if (this.dataPreparer.shadowInputData) {
            var lowShadowData = this.dataPreparer.makeShadowData(3, 0, 0);
            var highShadowData = this.dataPreparer.makeShadowData(5, 2, 2);
        }

        var series = [];
        var seriesLowData = this.dataPreparer.makeSeries(3, 0, 0);
        var seriesHighData = this.dataPreparer.makeSeries(5, 2, 2, true);
        series = series.concat(seriesLowData, seriesHighData);
        var verticalLine = this.dataPreparer.makeVerticalLine(this.dataPreparer.nodeName, this.color, this.dataPreparer.baseValue, -0.2, 0)
        series = series.concat(verticalLine)
        if (this.dataPreparer.shadowInputData) {
            var seriesLowShadowData = this.dataPreparer.makeShadowSeries(3, 0, 0)
            var seriesHighShadowData = this.dataPreparer.makeShadowSeries(5, 2, 2, true)
            series = series.concat(seriesLowShadowData, seriesHighShadowData);
            var shadowVerticalLine = this.dataPreparer.makeVerticalLine(this.dataPreparer.shadowNodeName, this.shadowColor, this.dataPreparer.shadowBaseValue, 0.30, 0.50)
            series = series.concat(shadowVerticalLine)
        }

        if (!this.dataPreparer.shadowInputData) {
            var chartHeight = this.findChartHeight(factors, 0)
        } else {
            var chartHeight = this.findChartHeight(factors, 10)
        }

        var chartMaker = this;
        var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'tornadoChartContainer',
                    width: 900,
                    height: chartHeight,
                    zoomType: 'xy',
                    marginRight: 50
                },
                credits: {
                    enabled: false
                },
                exporting: {},
                legend: {},
                title: {
                    text: chartMaker.chartTitle
                },
                tooltip: {
                    formatter: function () {
                        var msg = "";
                        if (typeof this.x == "number") {
                            if ((this.x % 0.5) != 0.25 && this.x >= 0) {
                                var shadowIndex = Math.floor(this.x);
                                var shadowLow = round(lowShadowData[shadowIndex].y);
                                var shadowHigh = round(highShadowData[shadowIndex].y);
                                if (isNaN(shadowLow)) {
                                    msg = "Shadow Base case value: " + chartMaker.dataPreparer.shadowBaseValue;
                                    return msg;
                                }
                                this.x = factors[shadowIndex]
                                if (this.x === chartMaker.dataPreparer.combinedTitle || this.x === chartMaker.dataPreparer.combinedTitle + "-" + chartMaker.dataPreparer.shadowNodeName) {
                                    msg = chartMaker.dataPreparer.combinedTitle + " for " + chartMaker.outputTitle + ": " + shadowLow + " to " + shadowHigh;
                                } else {
                                    var shadowLowLabel = lowShadowData[shadowIndex].label;
                                    var shadowHighLabel = highShadowData[shadowIndex].label;
                                    msg = '<b>' + chartMaker.outputTitle + '</b> goes from ' + shadowLow + ' to ' + shadowHigh + '<br/> when ' + this.series.chart.xAxis[0].categories[shadowIndex] +
                                        ' goes from ' + shadowLowLabel + " to " + shadowHighLabel;
                                }
                                return msg;
                            }
                        }
                        else {
                            var index = this.series.chart.xAxis[0].categories.indexOf(this.x);
                            var low = round(lowData[index].y);
                            var high = round(highData[index].y);
                            if (isNaN(low)) {
                                msg = "Base case value: " + chartMaker.dataPreparer.baseValue;
                                return msg;
                            }
                            if (this.x === chartMaker.dataPreparer.combinedTitle || this.x === chartMaker.dataPreparer.combinedTitle + "-" + chartMaker.dataPreparer.shadowNodeName) {
                                msg = chartMaker.dataPreparer.combinedTitle + " for " + chartMaker.outputTitle + ": " + low + " to " + high;
                            } else {
                                var lowLabel = lowData[index].label;
                                var highLabel = highData[index].label;
                                msg = '<b>' + chartMaker.outputTitle + '</b> goes from ' + low + ' to ' + high + '<br/> when ' + this.x +
                                    ' goes from ' + lowLabel + " to " + highLabel;
                            }
                            return msg;
                        }
                    }
                },
                plotOptions: {
                    series: {
                        pointWidth: 15,
                        dataLabels: {
                            enabled: true,
                            crop: false,
                            overflow: 'none',
                            style: {
                                fontWeight: 'thin'
                            },
                            formatter: function () {
                                if (typeof this.x == "number") {
                                    if ((this.x % 0.5) != 0.25) {
                                        var shadowIndex = Math.floor(this.x);
                                        if (shadowIndex >= 0) {
                                            this.key = factors[shadowIndex]
                                            if (this.y == lowShadowData[shadowIndex].y) {
                                                if (typeof lowShadowData[shadowIndex].label == 'number') {
                                                    return this.key === chartMaker.dataPreparer.combinedTitle ? "" : round(lowShadowData[shadowIndex].label);
                                                } else {
                                                    return this.key === chartMaker.dataPreparer.combinedTitle ? "" : lowShadowData[shadowIndex].label;
                                                }

                                            }
                                            if (this.y == highShadowData[shadowIndex].y) {
                                                if (typeof highShadowData[shadowIndex].label == 'number') {
                                                    return this.key === chartMaker.dataPreparer.combinedTitle ? "" : round(highShadowData[shadowIndex].label);
                                                } else {
                                                    return this.key === chartMaker.dataPreparer.combinedTitle ? "" : highShadowData[shadowIndex].label;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    var index = this.series.chart.xAxis[0].categories.indexOf(this.x);
                                    this.key = factors[index]
                                    if (this.y == lowData[index].y) {
                                        if (typeof lowData[index].label == 'number') {
                                            return this.key === chartMaker.dataPreparer.combinedTitle ? "" : round(lowData[index].label);
                                        } else {
                                            return this.key === chartMaker.dataPreparer.combinedTitle ? "" : lowData[index].label;
                                        }
                                    }
                                    if (this.y == highData[index].y) {
                                        if (typeof highData[index].label == 'number') {
                                            return this.key === chartMaker.dataPreparer.combinedTitle ? "" : round(highData[index].label);
                                        } else {
                                            return this.key === chartMaker.dataPreparer.combinedTitle ? "" : highData[index].label;
                                        }
                                    }
                                }

                            }
                        }
                    }
                },
                xAxis: {
                    title: {
                        text: 'Factor'
                    },
                    allowDecimals: false,
                    categories: factors,
                    labels: {
                        formatter: function () {
                            if (typeof this.value === "string" && this.value.indexOf(chartMaker.dataPreparer.shadowNodeName) !== -1) {
                                return "";
                            }
                            return this.value;
                        }
                    }
                },
                yAxis: [{
                    title: {
                        text: this.outputTitle + " (" + this.units + ")"
                    },
                    opposite: true
                }],
                series: series
            },
            function (chart) {
                chart.renderer.text(chartMaker.dataPreparer.getDate(), 700, chartHeight - 2)
                    .css({
                        color: '#939294',
                        fontSize: '10px'
                    })
                    .add();
            });

        function round(num) {
            return Math.round(num * 100) / 100;
        }
    }

}
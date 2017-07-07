var TornadoChartMaker = function() {
    function TornadoChartMaker(inputData, shadowInputData, shadowNodeName, nodeName, maxBars) {
        this.dataPreparer = new TornadoChartDataPreparer(inputData, shadowInputData, shadowNodeName, nodeName, maxBars);
    }
    TornadoChartMaker.prototype.plot = function() {
        this.initialize();
        this.draw();
    };
    TornadoChartMaker.prototype.initialize = function() {
        this.color = this.dataPreparer.inputData.Colors.mainColor;
        if (this.dataPreparer.shadowInputData) {
            this.shadowColor = this.dataPreparer.shadowInputData.Colors.shadowColor;
        }
        this.units = this.dataPreparer.units();
        this.chartTitle = this.dataPreparer.chartTitle();
        this.outputTitle = this.dataPreparer.outputTitle();
    };
    TornadoChartMaker.prototype.getDate = function() {
        return this.dataPreparer.getDate();
    };
    TornadoChartMaker.prototype.toCsv = function() {
        return this.dataPreparer.toCsv();
    };
    TornadoChartMaker.prototype.makeFactors = function() {
        return this.dataPreparer.makeFactors();
    };
    TornadoChartMaker.prototype.mapShadowTableToTable = function() {
        return this.dataPreparer.mapShadowTableToTable();
    };
    TornadoChartMaker.prototype.makeTableData = function() {
        return this.dataPreparer.makeTableData();
    };
    TornadoChartMaker.prototype.findChartHeight = function(factors, x) {
        if (factors.length <= 5) {
            var chartHeight = 300 + x * x;
        } else if (factors.length <= 10) {
            var chartHeight = 400 + x * x;
        } else {
            var chartHeight = factors.length * (40 + x);
        }
        return chartHeight;
    };
    TornadoChartMaker.prototype.draw = function() {
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
        var verticalLine = this.dataPreparer.makeVerticalLine(this.dataPreparer.nodeName, this.color, this.dataPreparer.baseValue, -.2, 0);
        series = series.concat(verticalLine);
        if (this.dataPreparer.shadowInputData) {
            var seriesLowShadowData = this.dataPreparer.makeShadowSeries(3, 0, 0);
            var seriesHighShadowData = this.dataPreparer.makeShadowSeries(5, 2, 2, true);
            series = series.concat(seriesLowShadowData, seriesHighShadowData);
            var shadowVerticalLine = this.dataPreparer.makeVerticalLine(this.dataPreparer.shadowNodeName, this.shadowColor, this.dataPreparer.shadowBaseValue, .3, .5);
            series = series.concat(shadowVerticalLine);
        }
        if (!this.dataPreparer.shadowInputData) {
            var chartHeight = this.findChartHeight(factors, 0);
        } else {
            var chartHeight = this.findChartHeight(factors, 10);
        }
        var chartMaker = this;
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: "tornadoChartContainer",
                width: 900,
                height: chartHeight,
                zoomType: "xy",
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
                formatter: function() {
                    var msg = "";
                    if (typeof this.x == "number") {
                        if (this.x % .5 != .25 && this.x >= 0) {
                            var shadowIndex = Math.floor(this.x);
                            var shadowLow = round(lowShadowData[shadowIndex].y);
                            var shadowHigh = round(highShadowData[shadowIndex].y);
                            if (isNaN(shadowLow)) {
                                msg = "Shadow Base case value: " + chartMaker.dataPreparer.shadowBaseValue;
                                return msg;
                            }
                            this.x = factors[shadowIndex];
                            if (this.x === chartMaker.dataPreparer.combinedTitle || this.x === chartMaker.dataPreparer.combinedTitle + "-" + chartMaker.dataPreparer.shadowNodeName) {
                                msg = chartMaker.dataPreparer.combinedTitle + " for " + chartMaker.outputTitle + ": " + shadowLow + " to " + shadowHigh;
                            } else {
                                var shadowLowLabel = lowShadowData[shadowIndex].label;
                                var shadowHighLabel = highShadowData[shadowIndex].label;
                                msg = "<b>" + chartMaker.outputTitle + "</b> goes from " + shadowLow + " to " + shadowHigh + "<br/> when " + this.series.chart.xAxis[0].categories[shadowIndex] + " goes from " + shadowLowLabel + " to " + shadowHighLabel;
                            }
                            return msg;
                        }
                    } else {
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
                            msg = "<b>" + chartMaker.outputTitle + "</b> goes from " + low + " to " + high + "<br/> when " + this.x + " goes from " + lowLabel + " to " + highLabel;
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
                        overflow: "none",
                        style: {
                            fontWeight: "thin"
                        },
                        formatter: function() {
                            if (typeof this.x == "number") {
                                if (this.x % .5 != .25) {
                                    var shadowIndex = Math.floor(this.x);
                                    if (shadowIndex >= 0) {
                                        this.key = factors[shadowIndex];
                                        if (this.y == lowShadowData[shadowIndex].y) {
                                            if (typeof lowShadowData[shadowIndex].label == "number") {
                                                return this.key === chartMaker.dataPreparer.combinedTitle ? "" : round(lowShadowData[shadowIndex].label);
                                            } else {
                                                return this.key === chartMaker.dataPreparer.combinedTitle ? "" : lowShadowData[shadowIndex].label;
                                            }
                                        }
                                        if (this.y == highShadowData[shadowIndex].y) {
                                            if (typeof highShadowData[shadowIndex].label == "number") {
                                                return this.key === chartMaker.dataPreparer.combinedTitle ? "" : round(highShadowData[shadowIndex].label);
                                            } else {
                                                return this.key === chartMaker.dataPreparer.combinedTitle ? "" : highShadowData[shadowIndex].label;
                                            }
                                        }
                                    }
                                }
                            } else {
                                var index = this.series.chart.xAxis[0].categories.indexOf(this.x);
                                this.key = factors[index];
                                if (this.y == lowData[index].y) {
                                    if (typeof lowData[index].label == "number") {
                                        return this.key === chartMaker.dataPreparer.combinedTitle ? "" : round(lowData[index].label);
                                    } else {
                                        return this.key === chartMaker.dataPreparer.combinedTitle ? "" : lowData[index].label;
                                    }
                                }
                                if (this.y == highData[index].y) {
                                    if (typeof highData[index].label == "number") {
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
                    text: "Factor"
                },
                allowDecimals: false,
                categories: factors,
                labels: {
                    formatter: function() {
                        if (typeof this.value === "string" && this.value.indexOf(chartMaker.dataPreparer.shadowNodeName) !== -1) {
                            return "";
                        }
                        return this.value;
                    }
                }
            },
            yAxis: [ {
                title: {
                    text: this.outputTitle + " (" + this.units + ")"
                },
                opposite: true
            } ],
            series: series
        }, function(chart) {
            chart.renderer.text(chartMaker.dataPreparer.getDate(), 700, chartHeight - 2).css({
                color: "#939294",
                fontSize: "10px"
            }).add();
        });
        function round(num) {
            return Math.round(num * 100) / 100;
        }
    };
    return TornadoChartMaker;
}();

var TornadoChartDataPreparer = function() {
    function TornadoChartDataPreparer(inputData, shadowInputData, shadowNodeName, nodeName, maxBars) {
        this.maxBars = maxBars;
        this.DELTA = 1e-5;
        this.inputData = inputData;
        this.shadowInputData = shadowInputData;
        this.shadowNodeName = shadowNodeName;
        this.nodeName = nodeName;
        this.table = this.inputData["Table"];
        this.mainColor = this.inputData.Colors.mainColor;
        this.combinedUncColor = this.inputData.Colors.combinedUncColor;
        this.addShadowFactors = false;
        if (this.shadowInputData) {
            this.unsortedShadowTable = this.shadowInputData["Table"];
            this.shadowTable = this.mapShadowTableToTable();
            this.fixTableDataForRollup();
            this.findShadowBaseValue();
            this.shadowSummary = this.shadowInputData["Summary"];
            this.shadowColor = this.shadowInputData.Colors.shadowColor;
            this.combinedUncShadowColor = this.shadowInputData.Colors.combinedUncShadowColor;
        }
        this.baseValue = this.table[0].Data[4];
        this.summary = this.inputData["Summary"];
        this.combinedTitle = this.inputData["CombinedUncertaintyLabel"];
        this.adjustZeroSwing();
        this.tableUncut = this.table.slice(0);
        if (!this.shadowInputData) {
            if (this.maxBars !== null && this.maxBars < this.table.length) {
                this.table.splice(this.maxBars, this.table.length - this.maxBars);
            }
        } else {
            this.shadowTableUncut = this.shadowTable.slice(0);
            if (this.maxBars !== null && this.maxBars < this.shadowTable.length) {
                this.table.splice(this.maxBars, this.table.length - this.maxBars);
                this.shadowTable.splice(this.maxBars, this.shadowTable.length - this.maxBars);
            }
        }
    }
    TornadoChartDataPreparer.prototype.findShadowBaseValue = function() {
        for (var i = 0; i < this.shadowTable.length; i++) {
            if (this.shadowTable[i].Data) {
                this.shadowBaseValue = this.shadowTable[i].Data[4];
                break;
            }
        }
    };
    TornadoChartDataPreparer.prototype.fixTableDataForRollup = function() {
        var unmatchedShadowTable = this.unmatchedShadowTable();
        this.shadowTable = this.shadowTable.concat(unmatchedShadowTable);
        var result = [];
        var dummy = {};
        for (var i = 0; i < unmatchedShadowTable.length; i++) {
            result.push(dummy);
        }
        this.table = this.table.concat(result);
    };
    TornadoChartDataPreparer.prototype.unmatchedShadowTable = function() {
        var factors = [];
        var result = [];
        var x = {};
        for (var i = 0; i < this.table.length; i++) {
            factors.push(this.table[i].Factor);
        }
        for (var i = 0; i < this.unsortedShadowTable.length; i++) {
            if (factors.indexOf(this.unsortedShadowTable[i].Factor) == -1) {
                result.push(this.unsortedShadowTable[i]);
            }
        }
        return result;
    };
    TornadoChartDataPreparer.prototype.adjustZeroSwing = function() {
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i].Data) {
                var low = this.table[i].Data[3];
                var high = this.table[i].Data[5];
                if (Math.abs(high - low) < this.DELTA) {
                    this.table[i].Data[3] -= this.DELTA;
                }
            }
        }
    };
    TornadoChartDataPreparer.prototype.units = function() {
        return this.inputData["Units"];
    };
    TornadoChartDataPreparer.prototype.chartTitle = function() {
        return this.inputData["ChartTitle"];
    };
    TornadoChartDataPreparer.prototype.outputTitle = function() {
        return this.inputData["Display"];
    };
    TornadoChartDataPreparer.prototype.mapShadowTableToTable = function() {
        var result = [];
        var x = {};
        for (var i = 0; i < this.table.length; i++) {
            for (var j = 0; j < this.unsortedShadowTable.length; j++) {
                if (this.table[i].Factor == this.unsortedShadowTable[j].Factor) {
                    x = this.unsortedShadowTable[j];
                }
            }
            result.push(x);
        }
        return result;
    };
    TornadoChartDataPreparer.prototype.handleIfDataNotAvailableInTable = function(tableDatum) {
        var data = accounting.formatNumber(tableDatum, 2);
        if (!tableDatum) {
            data = [ "N/A", "N/A", "N/A", "N/A", "N/A", "N/A" ];
        }
        return data;
    };
    TornadoChartDataPreparer.prototype.makeTableData = function() {
        var displayTable = [];
        this.inputData.Table = this.tableUncut;
        if (this.shadowInputData == null) {
            for (var i = 0; i < this.inputData.Table.length; i++) {
                displayTable.push({
                    factor: this.inputData.Table[i].Factor,
                    data: accounting.formatNumber(this.inputData.Table[i].Data, 2)
                });
            }
            if (this.inputData["CombinedUncertaintyLabel"] !== "") {
                displayTable.push({
                    factor: this.inputData["CombinedUncertaintyLabel"],
                    data: accounting.formatNumber(this.inputData["Summary"], 2)
                });
            }
        } else {
            this.shadowInputData.Table = this.shadowTableUncut;
            for (var i = 0; i < this.inputData.Table.length; i++) {
                var factor = this.inputData.Table[i].Factor;
                if (!this.inputData.Table[i].Factor) {
                    factor = this.shadowInputData.Table[i].Factor;
                }
                var data = this.handleIfDataNotAvailableInTable(this.inputData.Table[i].Data);
                var shadowData = this.handleIfDataNotAvailableInTable(this.shadowInputData.Table[i].Data);
                displayTable.push({
                    factor: factor,
                    data: data,
                    shadowData: shadowData
                });
            }
            if (this.inputData["CombinedUncertaintyLabel"] !== "") {
                displayTable.push({
                    factor: this.inputData["CombinedUncertaintyLabel"],
                    data: accounting.formatNumber(this.inputData["Summary"], 2),
                    shadowData: accounting.formatNumber(this.shadowInputData["Summary"], 2)
                });
            }
        }
        return displayTable;
    };
    TornadoChartDataPreparer.prototype.makeData = function(dataPos, labelPos, summaryPos) {
        var answer = [];
        for (var i = 0, k = 0; i < this.table.length; i++, k++) {
            if (this.table[i].Data) {
                answer.push({
                    x: k,
                    y: this.table[i].Data[dataPos],
                    label: this.table[i].Data[labelPos]
                });
            } else {
                answer.push({
                    x: null,
                    y: null,
                    label: null
                });
            }
        }
        answer.push({});
        answer.push({
            x: this.table.length + 1,
            y: this.summary[summaryPos],
            color: "#BBD817",
            label: ""
        });
        return answer;
    };
    TornadoChartDataPreparer.prototype.makeShadowData = function(dataPos, labelPos, summaryPos) {
        var answer = [];
        for (var i = 0, k = .5; i < this.table.length; i++, k++) {
            if (this.shadowTable !== undefined && this.shadowTable[i].Data) {
                answer.push({
                    x: k,
                    y: this.shadowTable[i].Data[dataPos],
                    label: this.shadowTable[i].Data[labelPos]
                });
            } else {
                answer.push({
                    x: null,
                    y: null,
                    label: null
                });
            }
        }
        if (this.shadowTable !== undefined) {
            answer.push({});
            answer.push({
                x: this.table.length + 1.5,
                y: this.shadowSummary[summaryPos],
                color: "#A9CE00",
                label: ""
            });
        }
        return answer;
    };
    TornadoChartDataPreparer.prototype.makeFactors = function() {
        var factors = [];
        var x = {};
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i].Factor !== undefined) {
                factors.push(this.table[i].Factor);
            }
        }
        if (this.unsortedShadowTable) {
            for (var i = 0; i < this.unsortedShadowTable.length; i++) {
                if (factors.indexOf(this.unsortedShadowTable[i].Factor) == -1) {
                    factors.push(this.unsortedShadowTable[i].Factor);
                }
            }
        }
        if (this.maxBars !== null && this.maxBars < factors.length) {
            factors.splice(this.maxBars, factors.length - this.maxBars);
        }
        factors.push("");
        factors.push(this.combinedTitle);
        factors.push("");
        return factors;
    };
    TornadoChartDataPreparer.prototype.fixCell = function(value) {
        return isNaN(value) ? '"' + value + '"' : value;
    };
    TornadoChartDataPreparer.prototype.toCsv = function() {
        var csv = "";
        csv += "Factors,Low Input,Base Input,High Input,Low Output,Base Output,High Output\n";
        if (this.shadowInputData) {
            for (var i = 0; i < this.table.length; i++) {
                csv += this.fixCell(this.table[i].Factor + " - " + this.nodeName) + "," + this.fixCell(this.table[i].Data[0]) + "," + this.fixCell(this.table[i].Data[1]) + "," + this.fixCell(this.table[i].Data[2]) + "," + this.fixCell(this.table[i].Data[3]) + "," + this.fixCell(this.table[i].Data[4]) + "," + this.fixCell(this.table[i].Data[5]) + "\n";
                csv += this.fixCell(this.table[i].Factor + " - " + this.shadowNodeName) + "," + this.fixCell(this.shadowTable[i].Data[0]) + "," + this.fixCell(this.shadowTable[i].Data[1]) + "," + this.fixCell(this.shadowTable[i].Data[2]) + "," + this.fixCell(this.shadowTable[i].Data[3]) + "," + this.fixCell(this.shadowTable[i].Data[4]) + "," + this.fixCell(this.shadowTable[i].Data[5]) + "\n";
            }
            csv += this.fixCell(this.combinedTitle + " - " + this.nodeName) + ",Low,Base,High," + this.fixCell(this.summary[0]) + "," + this.fixCell(this.summary[1]) + "," + this.fixCell(this.summary[2]) + "\n";
            csv += this.fixCell(this.combinedTitle + " - " + this.shadowNodeName) + ",Low,Base,High," + this.fixCell(this.shadowSummary[0]) + "," + this.fixCell(this.shadowSummary[1]) + "," + this.fixCell(this.shadowSummary[2]) + "\n";
        } else {
            for (var i = 0; i < this.table.length; i++) {
                csv += this.fixCell(this.table[i].Factor) + "," + this.fixCell(this.table[i].Data[0]) + "," + this.fixCell(this.table[i].Data[1]) + "," + this.fixCell(this.table[i].Data[2]) + "," + this.fixCell(this.table[i].Data[3]) + "," + this.fixCell(this.table[i].Data[4]) + "," + this.fixCell(this.table[i].Data[5]) + "\n";
            }
            csv += this.fixCell(this.combinedTitle + " - " + this.nodeName) + ",Low,Base,High," + this.fixCell(this.summary[0]) + "," + this.fixCell(this.summary[1]) + "," + this.fixCell(this.summary[2]) + "\n";
        }
        return csv;
    };
    TornadoChartDataPreparer.prototype.getDate = function() {
        var dateInString = new Date().toString();
        var splitTimestamp = dateInString.split(" ");
        var timeWithoutSec = splitTimestamp[4].substring(0, splitTimestamp[4].length - 3);
        var timeZone = splitTimestamp.slice(6, splitTimestamp.length);
        return "" + splitTimestamp[1] + " " + splitTimestamp[2] + " " + splitTimestamp[3] + " " + timeWithoutSec + " " + timeZone + " ";
    };
    TornadoChartDataPreparer.prototype.makeSeries = function(dataPos, labelPos, summaryPos, continuation) {
        if (continuation === void 0) {
            continuation = false;
        }
        return new Series(this.table, this.summary, this.nodeName, this.baseValue, this.mainColor, this.combinedUncColor, this.maxBars).make(dataPos, labelPos, summaryPos, continuation);
    };
    TornadoChartDataPreparer.prototype.makeShadowSeries = function(dataPos, labelPos, summaryPos, continuation) {
        if (continuation === void 0) {
            continuation = false;
        }
        return new Series(this.shadowTable, this.shadowSummary, this.shadowNodeName, this.shadowBaseValue, this.shadowColor, this.combinedUncShadowColor, this.maxBars, .5).make(dataPos, labelPos, summaryPos, continuation);
    };
    TornadoChartDataPreparer.prototype.makeLegend = function() {
        return [ {
            showInLegend: true,
            name: this.nodeName,
            color: this.mainColor,
            type: "bar"
        } ];
    };
    TornadoChartDataPreparer.prototype.makeShadowLegend = function() {
        return [ {
            showInLegend: true,
            name: this.shadowNodeName,
            color: this.shadowColor,
            type: "bar"
        } ];
    };
    TornadoChartDataPreparer.prototype.makeVerticalLine = function(nodeName, color, baseValue, x, delta) {
        var answer = [];
        var shadowBase = this.round(baseValue);
        var shadowNode = nodeName;
        answer.push({
            showInLegend: false,
            type: "line",
            color: color,
            zIndex: 1,
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
            data: [ {
                x: x,
                y: baseValue,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return "";
                    }
                }
            }, {
                x: this.table.length + delta,
                y: baseValue,
                dataLabels: {
                    enabled: true,
                    align: "left",
                    formatter: function() {
                        return shadowNode + " Base Case = " + shadowBase;
                    },
                    style: {
                        width: "200px"
                    }
                }
            } ],
            linkedTo: ":previous"
        });
        return answer;
    };
    TornadoChartDataPreparer.prototype.round = function(num) {
        return Math.round(num * 100) / 100;
    };
    return TornadoChartDataPreparer;
}();

var Series = function() {
    function Series(table, summary, nodeName, baseValue, color, combinedBarColor, maxBars, delta) {
        if (delta === void 0) {
            delta = 0;
        }
        this.table = table;
        this.summary = summary;
        this.nodeName = nodeName;
        this.baseValue = baseValue;
        this.color = color;
        this.combinedBarColor = combinedBarColor;
        this.maxBars = maxBars;
        this.delta = delta;
    }
    Series.prototype.make = function(dataPos, labelPos, summaryPos, continuation) {
        if (continuation === void 0) {
            continuation = false;
        }
        var answer = [];
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i].Data) {
                var threshold = this.findThreshold(this.table[i].Data[3], this.table[i].Data[4], this.table[i].Data[5]);
                var entry = {
                    name: this.nodeName,
                    color: this.color,
                    threshold: threshold,
                    grouping: false,
                    type: "bar",
                    data: [ {
                        x: i + this.delta,
                        y: this.table[i].Data[dataPos],
                        label: this.table[i].Data[labelPos]
                    } ]
                };
                if (continuation === true || i > 0) {
                    entry["linkedTo"] = ":previous";
                }
                answer.push(entry);
            }
        }
        answer.push({
            linkedTo: ":previous"
        });
        answer.push({
            color: this.combinedBarColor,
            threshold: this.summary[1],
            grouping: false,
            type: "bar",
            linkedTo: ":previous",
            data: [ {
                x: this.table.length + 1 + this.delta,
                y: this.summary[summaryPos],
                label: ""
            } ]
        });
        return answer;
    };
    Series.prototype.findThreshold = function(low, base, high) {
        var answer;
        if (high > base && high > low && low < base) {
            answer = this.baseValue;
        } else if (high < base && high < low && low > base) {
            answer = this.baseValue;
        } else if (high < base && high > low && low < base) {
            answer = high;
        } else if (high > base && high < low && low > base) {
            answer = low;
        } else if (high < base && high < low && low < base) {
            answer = low;
        } else if (low < high && high > base && low > base) {
            answer = high;
        } else if (low == high && high == base) {
            answer = this.baseValue;
        } else if (low == high && low != base) {
            answer = high;
        } else if (low == base && high > base) {
            answer = high;
        } else if (low == base && high < base) {
            answer = low;
        } else if (high == base && low > base) {
            answer = low;
        } else if (high == base && low < base) {
            answer = high;
        }
        return answer;
    };
    return Series;
}();

angular.module("smartorg.r6.acts.tornado", []);

angular.module("smartorg.r6.acts.tornado").directive("tornadoChart", [ function() {
    var templateUrl = "/Chomolongma/app/widgets/action/tornado/app/template/tornado.html";
    return {
        restrict: "E",
        templateUrl: templateUrl,
        scope: {
            menu: "="
        },
        link: function(scope) {
            var showTornado = function(args) {
                scope.actionMenuItem = args.actionMenuItem;
                scope.inputData = args.config.data.inputData.TornadoDistOutputs;
                scope.maxBars = args.config.data.maxBars;
                scope.nodeName = args.config.data.nodeName;
                if (args.config.data.shadowInputData) {
                    scope.shadowInputData = args.config.data.shadowInputData.TornadoDistOutputs;
                    scope.shadowNodeName = args.config.data.shadowNodeName;
                } else {
                    scope.shadowInputData = undefined;
                }
                if (!scope.shadowInputData) {
                    scope.selectedInputData = scope.inputData[0];
                    scope.selectedShadowInputData = null;
                    scope.shadowNodeName = null;
                    scope.drawTornadoGraph();
                } else {
                    scope.selectedInputData = scope.inputData[0];
                    scope.selectedShadowInputData = scope.shadowInputData[0];
                    scope.drawTornadoGraph();
                }
                scope.menu = menu;
                setTimeout(function() {
                    scope.$apply();
                }, 0);
            };
            scope.$on("command:TORNADODIST", function(event, args) {
                showTornado(args);
            });
            scope.$on("command:TORNADO_ROLLUP", function(event, args) {
                showTornado(args);
            });
            scope.drawTornadoGraph = function() {
                var chartMaker = new TornadoChartMaker(scope.selectedInputData, scope.selectedShadowInputData, scope.shadowNodeName, scope.nodeName, scope.maxBars);
                chartMaker.plot();
                scope.displayTable = chartMaker.makeTableData();
            };
            scope.selectNewData = function(selectedInputData) {
                if (scope.shadowInputData) {
                    for (var i = 0; i < scope.shadowInputData.length; i++) {
                        if (scope.shadowInputData[i].Display == selectedInputData.Display) {
                            scope.selectedShadowInputData = scope.shadowInputData[i];
                        }
                    }
                }
                scope.drawTornadoGraph();
            };
            scope.exportCsv = function() {
                var chartMaker = new TornadoChartMaker(scope.selectedInputData, scope.selectedShadowInputData, scope.shadowNodeName, scope.nodeName, scope.maxBars);
                var csv = chartMaker.toCsv();
                var blob = new Blob([ csv ], {
                    type: "text/plain;charset=utf-8"
                });
                var currentDate = chartMaker.getDate();
                var filename = "TornadoChart_" + scope.nodeName + "_" + currentDate + ".csv";
                saveAs(blob, filename);
            };
            scope.exportCharts = function() {
                var exporter = new smartorg.r6.lib.ChartExporter("tornadoChart", "svg-canvas");
                var title = scope.actionMenuItem + " for " + scope.nodeName;
                exporter.exportChart(title, true);
            };
            var menu = [ {
                name: "Display",
                items: [ {
                    name: "Show Table",
                    toggle: "Hide Table",
                    callback: function() {
                        scope.showTable = !scope.showTable;
                    }
                } ]
            }, {
                name: "Export",
                items: [ {
                    name: "Chart",
                    callback: function() {
                        scope.exportCharts();
                    }
                }, {
                    name: "Table",
                    callback: function() {
                        scope.exportCsv();
                    }
                } ]
            } ];
        }
    };
} ]);

var module;

try {
    module = angular.module("smartorg.r6.acts.tornado");
} catch (e) {
    module = angular.module("smartorg.r6.acts.tornado", []);
}

module.run([ "$templateCache", function($templateCache) {
    $templateCache.put("/Chomolongma/app/widgets/action/tornado/app/template/tornado.html", '<h3 ng-show="actionMenuItem && nodeName">\n' + "	{{actionMenuItem}} for {{nodeName}}\n" + "</h3>\n" + "\n" + '<div ng-show="inputData.length > 1">\n' + '  <div class="col-md-4"></div>\n' + '  <div class="col-md-4" ng-show="inputData.length > 1">\n' + "    <select\n" + '        class="form-control pull-right input-small"\n' + '        ng-model="selectedInputData"\n' + '        ng-options="data.Display for data in inputData"\n' + '        ng-change="selectNewData(selectedInputData)"\n' + "    ></select>\n" + "  </div>\n" + '  <div class="col-md-4"></div>\n' + "</div>\n" + "\n" + '<div class="tornadoChart" id="tornadoChartContainer"\n' + '    style="display: inline-block"></div>\n' + "\n" + '<canvas ng-show="false" id="svg-canvas"></canvas>\n' + "<br><br>\n" + "\n" + '<div ng-init="showTable=false" ng-if="showTable === true">\n' + '  <div class="col-md-2"></div>\n' + '  <div class="col-md-8">\n' + "    <table\n" + '        class="standardFont table table-striped table-condensed table-bordered">\n' + "      <thead>\n" + "      <tr>\n" + "        <th>Factors</th>\n" + "        <th>Low Input</th>\n" + "        <th>Base Input</th>\n" + "        <th>High Input</th>\n" + "        <th>Low Output</th>\n" + "        <th>Base Output</th>\n" + "        <th>High Output</th>\n" + "      </tr>\n" + "      </thead>\n" + "      <tbody>\n" + '      <tr ng-repeat="item in displayTable track by $index">\n' + "        <td>\n" + '				<span ng-if="selectedShadowInputData !== null">\n' + "					{{item.factor}} - {{nodeName}}<br>\n" + "					{{item.factor}} - {{shadowNodeName}}\n" + "				</span>\n" + '				<span ng-if="selectedShadowInputData === null">\n' + "					{{item.factor}}\n" + "				</span>\n" + "        </td>\n" + '        <td align="right">\n' + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[0]}}<br>\n" + "					{{item.shadowData[0]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[0]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor === 'Combined Uncertainty Range'\">\n" + "					Low<br>\n" + "					Low\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor === 'Combined Uncertainty Range'\">\n" + "					Low\n" + "				</span>\n" + "        </td>\n" + '        <td align="right">\n' + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[1]}}<br>\n" + "					{{item.shadowData[1]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[1]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor === 'Combined Uncertainty Range'\">\n" + "					Base<br>\n" + "					Base\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor === 'Combined Uncertainty Range'\">\n" + "					Base\n" + "				</span>\n" + "        </td>\n" + '        <td align="right">\n' + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[2]}}<br>\n" + "					{{item.shadowData[2]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[2]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor === 'Combined Uncertainty Range'\">\n" + "					High<br>\n" + "					High\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor === 'Combined Uncertainty Range'\">\n" + "					High\n" + "				</span>\n" + "        </td>\n" + '        <td align="right">\n' + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[3]}}<br>\n" + "					{{item.shadowData[3]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[3]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor === 'Combined Uncertainty Range'\">\n" + "					{{item.data[0]}}<br>\n" + "					{{item.shadowData[0]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor === 'Combined Uncertainty Range'\">\n" + "					{{item.data[0]}}\n" + "				</span>\n" + "        </td>\n" + '        <td align="right">\n' + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[4]}}<br>\n" + "					{{item.shadowData[4]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[4]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor === 'Combined Uncertainty Range'\">\n" + "					{{item.data[1]}}<br>\n" + "					{{item.shadowData[1]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor === 'Combined Uncertainty Range'\">\n" + "					{{item.data[1]}}\n" + "				</span>\n" + "        </td>\n" + '        <td align="right">\n' + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[5]}}<br>\n" + "					{{item.shadowData[5]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor !== 'Combined Uncertainty Range'\">\n" + "					{{item.data[5]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData !== null && item.factor === 'Combined Uncertainty Range'\">\n" + "					{{item.data[2]}}<br>\n" + "					{{item.shadowData[2]}}\n" + "				</span>\n" + "				<span\n" + "                    ng-if=\"selectedShadowInputData === null && item.factor === 'Combined Uncertainty Range'\">\n" + "					{{item.data[2]}}\n" + "				</span>\n" + "        </td>\n" + "      </tr>\n" + "      </tbody>\n" + "    </table>\n" + "  </div>\n" + '  <div class="col-md-2"></div>\n' + '  <div class="col-md-12"><br><br></div>\n' + "</div>\n" + "");
} ]);
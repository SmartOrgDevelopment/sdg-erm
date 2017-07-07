class TornadoChartDataPreparer {
    inputData: any;
    shadowInputData: any;
    shadowNodeName: string;
    nodeName: string;
    table: Array<any>;
    unsortedShadowTable: Array<any>;
    shadowTable: Array<any>;
    baseValue: number;
    shadowBaseValue: number;
    shadowSummary: Array<any>;
    summary: Array<any>;
    combinedTitle: string;
    mainColor: string;
    combinedUncColor: string;
    shadowColor: string;
    combinedUncShadowColor: string;
    DELTA: number;
    addShadowFactors: boolean
    maxBars: number;
    tableUncut: Array<any>
    shadowTableUncut: Array<any>

    constructor(inputData, shadowInputData, shadowNodeName: string, nodeName: string, maxBars: number) {
        this.maxBars = maxBars;
        this.DELTA = 0.00001;
        this.inputData = inputData;
        this.shadowInputData = shadowInputData;
        this.shadowNodeName = shadowNodeName;
        this.nodeName = nodeName
        this.table = this.inputData["Table"]
        this.mainColor = this.inputData.Colors.mainColor;
        this.combinedUncColor = this.inputData.Colors.combinedUncColor
        this.addShadowFactors = false
        if (this.shadowInputData) {
            this.unsortedShadowTable = this.shadowInputData["Table"];
            this.shadowTable = this.mapShadowTableToTable();
            this.fixTableDataForRollup();
            this.findShadowBaseValue();
            this.shadowSummary = this.shadowInputData["Summary"];
            this.shadowColor = this.shadowInputData.Colors.shadowColor;
            this.combinedUncShadowColor = this.shadowInputData.Colors.combinedUncShadowColor
        }
        this.baseValue = this.table[0].Data[4];
        this.summary = this.inputData["Summary"];
        this.combinedTitle = this.inputData["CombinedUncertaintyLabel"];
        this.adjustZeroSwing();
        this.tableUncut = this.table.slice(0)
        if (!this.shadowInputData) {
            if (this.maxBars !== null && this.maxBars < this.table.length) {
                this.table.splice(this.maxBars, this.table.length - this.maxBars)
            }
        } else {
            this.shadowTableUncut = this.shadowTable.slice(0)
            if (this.maxBars !== null && this.maxBars < this.shadowTable.length) {
                this.table.splice(this.maxBars, this.table.length - this.maxBars)
                this.shadowTable.splice(this.maxBars, this.shadowTable.length - this.maxBars)
            }
        }
    }

    findShadowBaseValue() {
        for (var i = 0; i < this.shadowTable.length; i++) {
            if (this.shadowTable[i].Data) {
                this.shadowBaseValue = this.shadowTable[i].Data[4];
                break;
            }
        }
    }

    fixTableDataForRollup() {
        var unmatchedShadowTable = this.unmatchedShadowTable()
        this.shadowTable = this.shadowTable.concat(unmatchedShadowTable)
        var result = []
        var dummy = {}
        for (var i = 0; i < unmatchedShadowTable.length; i++) {
            result.push(dummy)
        }
        this.table = this.table.concat(result)
    }

    unmatchedShadowTable() {
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
    }

    adjustZeroSwing() {
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i].Data) {
                var low = this.table[i].Data[3];
                var high = this.table[i].Data[5];
                if (Math.abs(high - low) < this.DELTA) {
                    this.table[i].Data[3] -= this.DELTA;
                }
            }
        }
    }

    units() {
        return this.inputData['Units'];
    }

    chartTitle() {
        return this.inputData['ChartTitle'];
    }

    outputTitle() {
        return this.inputData['Display'];
    }

    mapShadowTableToTable() {
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
    }

    handleIfDataNotAvailableInTable(tableDatum) {
        var data = accounting.formatNumber(tableDatum, 2)
        if (!tableDatum) {
            data = ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]
        }
        return data
    }

    makeTableData() {
        var displayTable = [];
        this.inputData.Table = this.tableUncut
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
                var factor = this.inputData.Table[i].Factor
                if (!this.inputData.Table[i].Factor) {
                    factor = this.shadowInputData.Table[i].Factor
                }
                var data = this.handleIfDataNotAvailableInTable(this.inputData.Table[i].Data)
                var shadowData = this.handleIfDataNotAvailableInTable(this.shadowInputData.Table[i].Data)
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
        return displayTable
    }

    makeData(dataPos, labelPos, summaryPos) {
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
                })
            }
        }
        answer.push({});
        answer.push({
            x: this.table.length + 1,
            y: this.summary[summaryPos],
            color: '#BBD817',
            label: ''
        });

        return answer;
    }

    makeShadowData(dataPos, labelPos, summaryPos) {
        var answer = [];
        for (var i = 0, k = 0.5; i < this.table.length; i++, k++) {
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
                })
            }
        }
        if (this.shadowTable !== undefined) {
            answer.push({});
            answer.push({
                x: this.table.length + 1.5,
                y: this.shadowSummary[summaryPos],
                color: '#A9CE00',
                label: ''
            });
        }
        return answer;
    }

    makeFactors() {
        var factors = [];
        var x = {}
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
            factors.splice(this.maxBars, factors.length - this.maxBars)
        }
        factors.push("");
        factors.push(this.combinedTitle);
        factors.push("");
        return factors;
    }

    fixCell(value): any {
        return isNaN(value) ? '"' + value + '"' : value;
    }

    toCsv() {
        var csv = "";
        csv += "Factors,Low Input,Base Input,High Input,Low Output,Base Output,High Output\n";
        if (this.shadowInputData) {
            for (var i = 0; i < this.table.length; i++) {
                csv += this.fixCell(this.table[i].Factor + " - " + this.nodeName) + "," +
                    this.fixCell(this.table[i].Data[0]) + "," +
                    this.fixCell(this.table[i].Data[1]) + "," +
                    this.fixCell(this.table[i].Data[2]) + "," +
                    this.fixCell(this.table[i].Data[3]) + "," +
                    this.fixCell(this.table[i].Data[4]) + "," +
                    this.fixCell(this.table[i].Data[5]) + "\n";
                csv += this.fixCell(this.table[i].Factor + " - " + this.shadowNodeName) + "," +
                    this.fixCell(this.shadowTable[i].Data[0]) + "," +
                    this.fixCell(this.shadowTable[i].Data[1]) + "," +
                    this.fixCell(this.shadowTable[i].Data[2]) + "," +
                    this.fixCell(this.shadowTable[i].Data[3]) + "," +
                    this.fixCell(this.shadowTable[i].Data[4]) + "," +
                    this.fixCell(this.shadowTable[i].Data[5]) + "\n";
            }
            csv += this.fixCell(this.combinedTitle + " - " + this.nodeName) +
                ",Low,Base,High," +
                this.fixCell(this.summary[0]) + "," +
                this.fixCell(this.summary[1]) + "," +
                this.fixCell(this.summary[2]) + "\n";
            csv += this.fixCell(this.combinedTitle + " - " + this.shadowNodeName) +
                ",Low,Base,High," +
                this.fixCell(this.shadowSummary[0]) + "," +
                this.fixCell(this.shadowSummary[1]) + "," +
                this.fixCell(this.shadowSummary[2]) + "\n";

        } else {
            for (var i = 0; i < this.table.length; i++) {
                csv += this.fixCell(this.table[i].Factor) + "," +
                    this.fixCell(this.table[i].Data[0]) + "," +
                    this.fixCell(this.table[i].Data[1]) + "," +
                    this.fixCell(this.table[i].Data[2]) + "," +
                    this.fixCell(this.table[i].Data[3]) + "," +
                    this.fixCell(this.table[i].Data[4]) + "," +
                    this.fixCell(this.table[i].Data[5]) + "\n";
            }
            csv += this.fixCell(this.combinedTitle + " - " + this.nodeName) +
                ",Low,Base,High," +
                this.fixCell(this.summary[0]) + "," +
                this.fixCell(this.summary[1]) + "," +
                this.fixCell(this.summary[2]) + "\n";
        }
        return csv;
    }

    getDate(): string {
        var dateInString = new Date().toString();
        var splitTimestamp = dateInString.split(" ");
        var timeWithoutSec = splitTimestamp[4].substring(0, splitTimestamp[4].length - 3);
        var timeZone = splitTimestamp.slice(6, splitTimestamp.length)
        return "" + splitTimestamp[1] + " " + splitTimestamp[2] + " " + splitTimestamp[3] + " " + timeWithoutSec + " " + timeZone + " ";
    }


    makeSeries(dataPos, labelPos, summaryPos, continuation = false) {
        return new Series(this.table, this.summary, this.nodeName, this.baseValue, this.mainColor, this.combinedUncColor, this.maxBars).make(dataPos, labelPos, summaryPos, continuation)
    }

    makeShadowSeries(dataPos, labelPos, summaryPos, continuation = false) {
        return new Series(this.shadowTable, this.shadowSummary, this.shadowNodeName, this.shadowBaseValue, this.shadowColor, this.combinedUncShadowColor, this.maxBars, 0.5).make(dataPos, labelPos, summaryPos, continuation)
    }

    makeLegend() {
        return [{
            showInLegend: true,
            name: this.nodeName,
            color: this.mainColor,
            type: 'bar'
        }];
    }

    makeShadowLegend() {
        return [{
            showInLegend: true,
            name: this.shadowNodeName,
            color: this.shadowColor,
            type: 'bar'
        }];
    }


    makeVerticalLine(nodeName, color, baseValue, x, delta) {
        var answer = [];
        var shadowBase = this.round(baseValue);
        var shadowNode = nodeName;
        answer.push({
            showInLegend: false,
            type: 'line', color: color, zIndex: 1,
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
            data: [{
                x: x,
                y: baseValue,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return "";
                    }
                }
            }, {
                x: (this.table.length) + delta,
                y: baseValue,
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    formatter: function () {
                        return shadowNode + " Base Case = " + shadowBase;
                    },
                    style: {
                        width: '200px'
                    }
                }
            }
            ],
            linkedTo: ':previous'
        })
        return answer;
    }


    round(num) {
        return Math.round(num * 100) / 100;
    }
}

class Series {
    table: any;
    summary: Array<any>;
    nodeName: string;
    baseValue: number;
    color: string;
    combinedBarColor: string;
    maxBars: number;
    delta: number;

    constructor(table, summary, nodeName, baseValue, color, combinedBarColor, maxBars, delta = 0) {
        this.table = table;
        this.summary = summary;
        this.nodeName = nodeName;
        this.baseValue = baseValue;
        this.color = color;
        this.combinedBarColor = combinedBarColor;
        this.maxBars = maxBars
        this.delta = delta;
    }

    make(dataPos, labelPos, summaryPos, continuation = false) {
        var answer = [];
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i].Data) {
                var threshold = this.findThreshold(this.table[i].Data[3], this.table[i].Data[4], this.table[i].Data[5]);
                var entry = {
                    name: this.nodeName,
                    color: this.color,
                    threshold: threshold,
                    grouping: false,
                    type: 'bar',
                    data: [
                        {
                            x: i + this.delta,
                            y: this.table[i].Data[dataPos],
                            label: this.table[i].Data[labelPos]
                        }
                    ]
                }
                if (continuation === true || i > 0) {
                    entry['linkedTo'] = ':previous';
                }
                answer.push(entry);
            }
        }
        answer.push({'linkedTo': ':previous'});
        answer.push({
            color: this.combinedBarColor,
            threshold: this.summary[1],
            grouping: false,
            type: 'bar',
            linkedTo: ':previous',
            data: [{
                x: this.table.length + 1 + this.delta,
                y: this.summary[summaryPos],
                label: ''
            }]
        });
        return answer;
    }

    findThreshold(low, base, high) {
        var answer;
        if (high > base && high > low && low < base) {
            answer = this.baseValue
        }
        else if (high < base && high < low && low > base) {
            answer = this.baseValue
        }
        else if (high < base && high > low && low < base) {
            answer = high
        }
        else if (high > base && high < low && low > base) {
            answer = low
        }
        else if (high < base && high < low && low < base) {
            answer = low
        }
        else if (low < high && high > base && low > base) {
            answer = high
        }
        else if (low == high && high == base) {
            answer = this.baseValue
        }
        else if (low == high && low != base) {
            answer = high
        }
        else if (low == base && high > base) {
            answer = high
        }
        else if (low == base && high < base) {
            answer = low
        }
        else if (high == base && low > base) {
            answer = low
        }
        else if (high == base && low < base) {
            answer = high
        }
        return answer;
    }
}
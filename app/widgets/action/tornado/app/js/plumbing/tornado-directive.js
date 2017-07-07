angular.module('smartorg.r6.acts.tornado').directive('tornadoChart', [function () {
        var templateUrl = 'widgets/action/tornado/app/template/tornado.html';
        return {
            restrict: 'E',
            templateUrl: templateUrl,
            scope: {
                menu: '='
            },
            link: function (scope) {
                var showTornado = function (args) {
                    scope.actionMenuItem = args.actionMenuItem;
                    scope.inputData = args.config.data.inputData.TornadoDistOutputs;
                    scope.maxBars = args.config.data.maxBars;
                    scope.nodeName = args.config.data.nodeName;
                    if (args.config.data.shadowInputData) {
                        scope.shadowInputData = args.config.data.shadowInputData.TornadoDistOutputs;
                        scope.shadowNodeName = args.config.data.shadowNodeName;
                    }
                    else {
                        scope.shadowInputData = undefined;
                    }
                    if (!scope.shadowInputData) {
                        scope.selectedInputData = scope.inputData[0];
                        scope.selectedShadowInputData = null;
                        scope.shadowNodeName = null;
                        scope.drawTornadoGraph();
                    }
                    else {
                        scope.selectedInputData = scope.inputData[0];
                        scope.selectedShadowInputData = scope.shadowInputData[0];
                        scope.drawTornadoGraph();
                    }
                    scope.menu = menu;
                    setTimeout(function () {
                        scope.$apply();
                    }, 0);
                };
                scope.$on('command:TORNADODIST', function (event, args) {
                    showTornado(args);
                });
                scope.$on('command:TORNADO_ROLLUP', function (event, args) {
                    showTornado(args);
                });
                scope.drawTornadoGraph = function () {
                    var chartMaker = new TornadoChartMaker(scope.selectedInputData, scope.selectedShadowInputData, scope.shadowNodeName, scope.nodeName, scope.maxBars);
                    chartMaker.plot();
                    scope.displayTable = chartMaker.makeTableData();
                };
                scope.selectNewData = function (selectedInputData) {
                    if (scope.shadowInputData) {
                        for (var i = 0; i < scope.shadowInputData.length; i++) {
                            if (scope.shadowInputData[i].Display == selectedInputData.Display) {
                                scope.selectedShadowInputData = scope.shadowInputData[i];
                            }
                        }
                    }
                    scope.drawTornadoGraph();
                };
                scope.exportCsv = function () {
                    var chartMaker = new TornadoChartMaker(scope.selectedInputData, scope.selectedShadowInputData, scope.shadowNodeName, scope.nodeName, scope.maxBars);
                    var csv = chartMaker.toCsv();
                    var blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
                    var currentDate = chartMaker.getDate();
                    var filename = "TornadoChart_" + scope.nodeName + "_" + currentDate + ".csv";
                    saveAs(blob, filename);
                };
                scope.exportCharts = function () {
                    var exporter = new smartorg.r6.lib.ChartExporter("tornadoChart", "svg-canvas");
                    var title = scope.actionMenuItem + " for " +
                        scope.nodeName;
                    exporter.exportChart(title, true);
                };
                var menu = [
                    {
                        'name': 'Display',
                        'items': [{
                                'name': 'Show Table',
                                'toggle': 'Hide Table',
                                'callback': function () {
                                    scope.showTable = !scope.showTable;
                                }
                            }]
                    }, {
                        'name': 'Export',
                        'items': [{
                                'name': 'Chart',
                                'callback': function () {
                                    scope.exportCharts();
                                }
                            }, {
                                'name': 'Table',
                                'callback': function () {
                                    scope.exportCsv();
                                }
                            }]
                    }
                ];
            }
        };
    }]);

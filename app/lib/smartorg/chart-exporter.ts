declare var canvg: any;

/**
 * This class is for common file export. For now it only contain image
 * export functions.
 */
class ChartExporter {
    private chartsListJQ;
    private canvas;

    /**
     * @param chartsListJQ Class of DOM element that contains what
     *        needs to be exported to the chart. Example structure:
     *        &gt;div id="chartsListJQ"&lt;
     *            &gt;div id="chartContainer"&lt;
     *                &gt;svg name="this_is_the_chart"&lt;&gt;/svg&lt;
     *            &gt;/div&lt;
     *        &gt;/div&lt;
     * @param canvas The canvas DOM element id.
     */
    constructor(chartsListJQ, canvas) {
        this.chartsListJQ = document.getElementsByClassName(chartsListJQ);
        this.canvas = document.getElementById(canvas);
    }

    /**
     * Declare a static variable to hold the export window, in order to
     * determine if the export window is opened or not.
     *
     * This is only in use for exporting multiple image in one single
     * page. For one image per page, this variable is useless.
     *
     * The reason to use this static is because window.open will open
     * the same reference if the URLs are the same. If open the window
     * again will reload the page with blank, but not triggering the
     * onload() event. So if window.open an existing window, nothing
     * will display.
     *
     * Keep this as a temporary solution until a better one is found.
     */
    private static chartExportWindow;

    /**
     * Export a chart with specific function. Default is export one
     * chart to a new window.
     */
    exportChart(action, useTimeStamp) {
        var filename = ChartExporter.generateFileName(action, useTimeStamp);

        this.exportOneChartPerPage(filename);
        // this.exportChartsInGlobalPage();
    }

    /**
     * Export chart to a new window. Every export will open a new
     * window with the image url. Just like right click an image and
     * select "open image in new tab".
     *
     * @param filename {string} Filename to save into.
     */
    private exportOneChartPerPage(filename) {
        var chartNumber = this.chartsListJQ.length;

        for (var i = 0; i < chartNumber; i++) {
            var elem = this.chartsListJQ[i];

            if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
                var imageurl = this.getImageUrl(
                    elem.children[0].innerHTML.trim());
                if (imageurl) {
                    ChartExporter.downloadImage(imageurl, filename);
                }
            }
        }
    }

    /**
     * Export chart to a new window. First check if the global export
     * window is opened. If the new window exists, new chart will
     * continue to be added to that window. Otherwise a new blank
     * window will be opened to display the charts.
     *
     * Whenever the global export window closes, previous exported
     * images in this window will be wipe out, i.e. close to clean.
     *
     * window.open("", "Global Export", "") is not working correctly
     * in current Chrome (45.0.2454.85 (64-bit)). A url must be passed
     * in order to get the "save as" function working as it should be.
     */
    private exportChartsInGlobalPage() {
        var chartNumber = this.chartsListJQ.length;

        if (chartNumber > 0
            && (!ChartExporter.chartExportWindow
            || ChartExporter.chartExportWindow.closed)) {
            ChartExporter.chartExportWindow =
                window.open("about:blank", "Global Export", "");
            ChartExporter.chartExportWindow.document.title
                = "Exported Images";
        }

        for (var i = 0; i < chartNumber; i++) {
            var elem = this.chartsListJQ[i];

            // Replace jQuery visible with equivalent function.
            if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
                ChartExporter.chartExportWindow.document.body.innerHTML +=
                    "< style='border: 1px solid black;' " +
                    "src='this.getImageUrl(elem.children[0].innerHTML.trim())' />";
                ChartExporter.chartExportWindow.focus();
            }
        }
    }

    /**
     * Generate an image then return its url. The image generation is
     * performed by canvg. Canvg in this project locates at:
     *     /docs/includes/canvg
     * Canvg reference: https://github.com/gabelerner/canvg
     *
     * @param htmlText The html can be get from Element.innerHTML or
     *        from other sources with equivalent format. This value
     *        will be used by canvg to generate the output image.
     * @returns The url of image which generated by canvg.
     */
    private getImageUrl(htmlText: string) {
        // Call from /pnDocs/includes/canvg
        // Files in /docs/includes/canvg
        canvg(this.canvas, htmlText);

        var imgOrURL = this.canvas.toDataURL('image/png');

        if (this.canvas.msToBlob) {
            var blob = this.canvas.msToBlob();
            window.navigator.msSaveBlob(
                blob, 'export ' + ChartExporter.getFileTimeStamp() + '.png');
        } else {
            return typeof imgOrURL == 'object' ? imgOrURL.src : imgOrURL;
            // replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        }
    }

    private static generateFileName(action, useTimeStamp) {
        var timestamp = "";
        if (useTimeStamp) {
            timestamp = "_" + ChartExporter.getFileTimeStamp();
        }
        return "export_" + action + timestamp + ".png";
    }

    /**
     * Get a time stamp for export file.
     *
     * @returns {string} Time format in yyyy-MM-dd HH:mm:ss.
     */
    private static getFileTimeStamp() {
        var time = new Date();
        return [
            [
                time.getFullYear(),
                time.getMonth(),
                time.getDate()
            ].join('-'),
            [
                time.getHours(),
                time.getMinutes(),
                time.getSeconds()
            ].join('.')
        ].join(' ');
    }

    /**
     * Use html5 download keyword for <a> to trigger download.
     *
     * @param imageurl {string} The data url for image.
     * @param filename {string} File name to save into.
     */
    private static downloadImage(imageurl, filename) {
        // Original: open new window
        window.open(imageurl);

        // Chrome: Save
        // var a = document.createElement('a');
        // a.download = filename;
        // a.href = imageurl;
        // a.click();

        // Firefox: Save (not working)
        // var a = document.createElement('a');
        // document.body.appendChild(a); // For Firefox
        // // a.download = filename;
        // a.href = imageurl;
        // a.target = '_blank';
        // a.click();
        // document.body.removeChild(a);
    }
}
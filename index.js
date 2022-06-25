import ORG from "/js/ORG.js"
import ORGPoint from "/js/ORGPoint.js"
import ORGPile from "/js/ORGPile.js"
import ORGLine from "/js/ORGLine.js"
import Kml from "/js/Kml.js"
import { BLtoXY, XYtoBL } from "./js/Coord.js"
import Vector3d from "./js/Vector3d.js"
import ViewUI from "./js/ViewUI.js"
require([
    "esri/Map",
    "esri/Basemap",
    "esri/views/SceneView",
    "esri/layers/ElevationLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/geometry/support/geodesicUtils",
    "esri/geometry/SpatialReference",
    "esri/geometry/Multipoint",
    "esri/geometry/Point",
    "esri/geometry/geometryEngine",
    "esri/widgets/Sketch",
    "esri/widgets/Expand",],
    (Map, Basemap, SceneView, ElevationLayer, GraphicsLayer, Graphic,
        geodesicUtils, SpatialReference, Multipoint, Point, geometryEngine,
        Sketch, Expand) => {

        const map = new Map({
            basemap: "satellite",
            ground: "world-elevation"
        });
        const view = new SceneView({
            container: "viewDiv",
            map: map,
            scale: 80000000,
            center: [110, 38.78]
        });
        const url = "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/";
        const layer = new ElevationLayer(url);

        var graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);


        ViewUI.addBasemapGalleryExpand(view);   //添加底图选择框
        //view.ui.add([orgDiv], "top-right"); //生成org面板

        view.ui.add("topView", "top-left"); //顶视图
        ViewUI.addMeasureBar(view); //添加测量工具条
        //view.ui.add("orgDiv", "top-right"); //顶视图
        ViewUI.addORGExpand(view, graphicsLayer);
        // const parser = new DOMParser();
        // $("input[type=file]").change(function (e) {
        //     graphicsLayer.removeAll();
        //     $('#sltLine').find('option').remove();

        //     var kmlFile = $('#kml-file').prop('files')[0];
        //     console.log($('#kml-file'))
        //     //check if a file was supplied
        //     if (kmlFile) {
        //         let reader = new FileReader();
        //         //reads the file as text
        //         reader.readAsText(kmlFile);
        //         //reading was successful
        //         reader.onload = function (e) {
        //             //parses the text to xml
        //             let parsedText = parser.parseFromString(e.target.result, "text/xml")
        //             //parses the xml to geoJSON
        //             let converted = toGeoJSON.kml(parsedText, { styles: false })
        //             for (let i = 0; i < converted.features.length; i++) {
        //                 const feature = converted.features[i];
        //                 if (feature.geometry.type != "LineString") continue;
        //                 if (!feature.properties.hasOwnProperty('name')) feature.properties.name = "未命名" + i;
        //                 var name = feature.properties.name;

        //                 $('#sltLine').append('<option value=' + i + '>' + name + '</option>');

        //                 ViewUI.addPolyline(graphicsLayer, feature);

        //                 goAndHighlight();
        //             }
        //         };
        //         //reading failed
        //         reader.onerror = function () {
        //             console.log(reader.error)
        //         }
        //     }
        //     else {
        //         console.log("No file was supplied")
        //     }
        // });
        $("#btnGenORG").click(function (e) {
            var g = getSltGraphic();
            if (g == null) { alert("没有选择图形"); return; }
            alert("该功能仅供测试，请谨慎使用，作者不保证数据准确性！！！");
            var path = g.geometry.paths[0];
            var points = [];

            var sample = $('#sample').val();
            var offset = $('#offset').val();
            var chkOffset = $('#chkOffset')[0].checked;
            var sumDist = 0;
            var sumDistArray = [0];
            var elevationArray = [];
            for (let i = 0; i < path.length; i++) {
                const pt = path[i];
                points.push([pt[0], pt[1]]);
                var pt1 = new Point({ type: "point", x: pt[0], y: pt[1], z: 0, spatialReference: SpatialReference.WGS84 });
                if (i > 0) {
                    var pt2 = new Point({
                        type: "point", x: path[i - 1][0], y: path[i - 1][1], z: 0, spatialReference: SpatialReference.WGS84
                    });
                    var length = geodesicUtils.geodesicDistance(pt1, pt2, "meters").distance;
                    sumDist += length;
                    sumDistArray.push(sumDist);
                }
            }

            var densPoly = geodesicUtils.geodesicDensify(g.geometry, sample);
            let densPath = densPoly.paths[0];
            sumDist = 0;
            sumDistArray.push(0);
            var pointsL = [];
            var pointsR = [];
            var forward;
            for (let i = 0; i < densPath.length; i++) {
                const pt = densPath[i];
                points.push([pt[0], pt[1]]);
                var pt1 = new Point({ type: "point", x: pt[0], y: pt[1], z: 0, spatialReference: SpatialReference.WGS84 });
                if (i > 0) {
                    var pt2 = new Point({
                        type: "point", x: densPath[i - 1][0], y: densPath[i - 1][1], z: 0, spatialReference: SpatialReference.WGS84
                    });
                    var length = geodesicUtils.geodesicDistance(pt1, pt2, "meters").distance;
                    sumDist += length;
                    sumDistArray.push(sumDist);
                }
                if (!chkOffset) continue;
                if (i < densPath.length - 1)
                    forward = calDirection(pt, densPath[i + 1]);
                pointsL.push(getOffPoint(pt, forward, -offset));
                pointsR.push(getOffPoint(pt, forward, offset));
            }
            // Uses "auto" resolution by default
            points = points.concat(pointsL);
            points = points.concat(pointsR);
            layer.queryElevation(new Multipoint({ points }), {
                returnSampleInfo: true
            })
                // Successfully sampled all points
                .then(function (result) {
                    result.geometry.points.forEach(function (point, index) {
                        const elevation = point[2].toFixed(3);
                        elevationArray.push(elevation);
                    });
                    var org = new ORG();
                    for (let i = 0; i < path.length; i++) {
                        var pl = new ORGPile("N" + i, 0, sumDistArray[i], elevationArray[i], 0, path[i][0], path[i][1], elevationArray[i]);
                        org.ORGPiles.push(pl);
                    }
                    for (let i = 0; i < densPath.length; i++) {
                        var off = i + path.length;
                        var pt = new ORGPoint(i + 1, 0, sumDistArray[off], elevationArray[off]);
                        org.ORGPoints.push(pt);


                        if (!chkOffset) continue;
                        var offL = i + path.length + densPath.length;
                        var ptL = new ORGPoint(i + densPath.length + 1, offset, sumDistArray[off], elevationArray[offL]);
                        org.ORGPointsL.push(ptL);

                        var offR = i + path.length + densPath.length * 2;
                        var ptR = new ORGPoint(i + densPath.length * 2 + 1, -offset, sumDistArray[off], elevationArray[offR]);
                        org.ORGPointsR.push(ptR);
                    }

                    org.UpdateAngle(); org.UpdateLine();
                    download(g.attributes.name + ".org", org.toString());
                })
                // Failed to sample (e.g. service unavailable)
                .catch(function (error) {
                    console.error("Failed to query elevation:", error);
                });
        });

        $("#btnGenBuffer").click(function (e) {
            var g = getSltGraphic();
            if (g == null) { alert("没有选择图形"); return; }
            var width = $('#bufferWidth').val();
            var bufferRes = geometryEngine.geodesicBuffer(g.geometry, width, "meters");
            let sym = {
                type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                color: [256, 0, 0, 0.3],
                outline: {  // autocasts as new SimpleLineSymbol()
                    color: [0, 256, 0, 0.7],
                    width: 1
                }
            };
            var polygonGraphic = new Graphic({
                geometry: bufferRes,
                symbol: sym
            });

            graphicsLayer.add(polygonGraphic);
            var kml = new Kml(g.attributes.name + "缓冲区", bufferRes.rings[0]);

            download(g.attributes.name + "缓冲区.kml", kml.toString());
        });
        $('#sltLine').on("change", goAndHighlight);
        var highlight;
        $("#btnLocate").click(function (e) {
            goAndHighlight();
        });
        view.on("click", function (event) {
            clearHighlight();
        });

        //清除界面里的高亮
        function clearHighlight() {
            if (highlight) {
                highlight.remove();
            }
        }
        //获取下拉框选中的图形
        function getSltGraphic() {
            var slt = $('#sltLine').find('option:selected').text();
            for (let j = 0; j < graphicsLayer.graphics.length; j++) {
                const g = graphicsLayer.graphics.getItemAt(j);
                if (g.attributes.name == slt) {
                    return g;
                }
            }
            return null;
        }
        //定位并高亮选中的图形
        function goAndHighlight() {
            var g = getSltGraphic();
            if (g == null) { alert("没有选择图形"); return; }
            view.goTo({ target: g.geometry, heading: 0 });
            view.whenLayerView(g.layer).then(function (layerView) {
                clearHighlight();
                highlight = layerView.highlight(g);
            });
        }

        //向地图中加入一个多段线
        function addPolyline2(graphicsLayer, path) {
            var polyline = {
                type: "polyline", // autocasts as new Polyline()
                paths: path,
                hasZ: false
            };

            var lineSymbol = {
                type: "simple-line", // autocasts as SimpleLineSymbol()
                color: [0, 256, 0, 0.7],
                width: 2
            };

            var polylineGraphic = new Graphic({
                geometry: polyline,
                symbol: lineSymbol
            });

            graphicsLayer.add(polylineGraphic);
        }
        function calDirection(pt1, pt2) {
            let xy1 = BLtoXY(pt1[0], pt1[1]);
            let xy2 = BLtoXY(pt2[0], pt2[1]);
            return new Vector3d(xy2.x - xy1.x, xy2.y - xy1.y, 0);
        }
        /**
         * 计算偏移后的点
         * @param {Point} pt 当前点
         * @param {Vector3d} forward 前进方向
         * @param {Number} off 偏移距离，正常应该是正数往左偏移，负数往右偏移，但是因为BL转xy时，x表示北方向，y表示东方向，所以反过来
         * @returns 偏移后的点
         */
        function getOffPoint(pt, forward, off) {
            let xy = BLtoXY(pt[0], pt[1]);
            let basePt = new Vector3d(xy.x, xy.y, 0);
            let offDirection = Vector3d.ZAxis.crossProduct(forward).normalize();
            offDirection = offDirection.scale(off);
            let offXY = basePt.add(offDirection);
            let offBL = XYtoBL(offXY.x, offXY.y);
            return [offBL.x, offBL.y];
        }

    });


function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

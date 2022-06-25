import { loadModules } from "https://unpkg.com/esri-loader/dist/esm/esri-loader.js";

const [Graphic, Basemap, BasemapGallery, Expand, DirectLineMeasurement3D, AreaMeasurement3D, promiseUtils] = await loadModules(["esri/Graphic", "esri/Basemap", "esri/widgets/BasemapGallery", 'esri/widgets/Expand', "esri/widgets/DirectLineMeasurement3D", "esri/widgets/AreaMeasurement3D",
    "esri/core/promiseUtils"]);
function ViewUI() { }
ViewUI.addBasemapGalleryExpand = async function (view,) {
    const basemapGallery = new BasemapGallery({
        view: view,
        source: [Basemap.fromId("satellite"), Basemap.fromId("osm"), Basemap.fromId("topo-vector")],
        container: document.createElement("div")
    });
    const bgExpand = new Expand({
        view: view,
        content: basemapGallery
    });
    // close the expand whenever a basemap is selected
    basemapGallery.watch("activeBasemap", () => {
        bgExpand.collapse();
    });
    // Add the expand instance to the ui
    view.ui.add(bgExpand, "top-left");
}
ViewUI.addORGExpand = async function (view, graphicsLayer) {
    let node = document.createElement("div");
    // node.innerHTML = "    <div id=\"orgDiv\">"
    //     + " <label style=\"width: 100%;font-size: large;font-weight: bold;\">选择Kml路径</label>"
    //     + "<br />"
    //     + "<input id=\"kml-file\" type=\"file\" class=\"esri-input\" accept=\".kml\">"
    //     + " <br />"
    //     + "   <select id=\"sltLine\" class=\"esri-input esri-select\" type=\"select\">"
    //     + " </select>"
    //     + "<button class=\"action-button esri-icon-zoom-to-object\" id=\"btnLocate\" type=\"button\" title=\"定位到对象\""
    //     + " style=\"vertical-align:middle;\"> </button>"
    //     + "<br />"
    //     + " <label class=\"para para-name\">边线偏距</label>"
    //     + "<input id=\"offset\" type=\"number\" class=\"esri-input esri-number numInput\" min=\"5\" max=\"100\" value=\"15\">"
    //     + "<label class=\"para para-unit\">m</label>"
    //     + "<input class=\"checkbox\" id=\"chkOffset\" type=\"checkbox\"><label for=\"chkOffset\">生成边线</label></input>"

    //     + "<br />"
    //     + "<label class=\"para para-name\">采样精度</label>"
    //     + "<input id=\"sample\" type=\"number\" class=\"esri-input esri-number numInput\" min=\"5\" max=\"100\" value=\"20\">"
    //     + "        <label class=\"para para-unit\">m</label>"
    //     + "<button class=\"esri-button genBtn\" id=\"btnGenORG\" type=\"button\">"
    //     + "生成ORG"
    //     + "</button>"
    //     + "<br />"
    //     + "<label class=\"para para-name\">缓冲区宽</label>"
    //     + "<input id=\"bufferWidth\" type=\"number\" class=\"esri-input esri-number numInput\" min=\"0\" max=\"9999\" value=\"2\">"
    //     + " <label class=\"para para-unit\">m</label>"
    //     + "<button class=\"esri-button genBtn\" id=\"btnGenBuffer\" type=\"button\">"
    //     + " 生成缓冲区"
    //     + " </button>"
    //     + "</div>"
    //     ;
    const orgExpand = new Expand({
        view: view,
        content: "<h1>打发士大夫</h1>",
        group: "top-right",
        expanded: true
    });

    const org2Expand = new Expand({
        view: view,
        content: document.getElementById("orgDiv"),
        group: "top-right"
    });

    // Add the expand instance to the ui
    view.ui.add([orgExpand, org2Expand], "top-right");

    const parser = new DOMParser();
    $("input[type=file]").change(function (e) {
        graphicsLayer.removeAll();
        $('#sltLine').find('option').remove();

        var kmlFile = $('#kml-file').prop('files')[0];
        console.log($('#kml-file'))
        //check if a file was supplied
        if (kmlFile) {
            let reader = new FileReader();
            //reads the file as text
            reader.readAsText(kmlFile);
            //reading was successful
            reader.onload = function (e) {
                //parses the text to xml
                let parsedText = parser.parseFromString(e.target.result, "text/xml")
                //parses the xml to geoJSON
                let converted = toGeoJSON.kml(parsedText, { styles: false })
                console.log(converted)
                for (let i = 0; i < converted.features.length; i++) {
                    const feature = converted.features[i];
                    if (feature.geometry.type != "LineString") continue;
                    if (!feature.properties.hasOwnProperty('name')) feature.properties.name = "未命名" + i;
                    var name = feature.properties.name;

                    $('#sltLine').append('<option value=' + i + '>' + name + '</option>');

                    ViewUI.addPolyline(graphicsLayer, feature);

                    goAndHighlight();
                }
            };
            //reading failed
            reader.onerror = function () {
                console.log(reader.error)
            }
        }
        else {
            console.log("No file was supplied")
        }
    });
}
ViewUI.addMeasureBar = async function (view,) {
    view.ui.add("topbar", "top-left");
    var activeWidget = null;
    document.getElementById("distanceButton")
        .addEventListener("click", (event) => {
            setActiveWidget(null);
            if (!event.target.classList.contains("active")) {
                setActiveWidget("distance");
            } else {
                setActiveButton(null);
            }
        });

    document.getElementById("areaButton")
        .addEventListener("click", (event) => {
            setActiveWidget(null);
            if (!event.target.classList.contains("active")) {
                setActiveWidget("area");
            } else {
                setActiveButton(null);
            }
        });

    function setActiveWidget(type) {
        switch (type) {
            case "distance":
                activeWidget = new DirectLineMeasurement3D({
                    view: view
                });
                // skip the initial 'new measurement' button
                activeWidget.viewModel.start().catch((error) => {
                    if (promiseUtils.isAbortError(error)) {
                        return; // don't display abort errors
                    }
                    throw error; // throw other errors since they are of interest
                });

                view.ui.add(activeWidget, "top-left");
                setActiveButton(document.getElementById("distanceButton"));
                break;
            case "area":
                activeWidget = new AreaMeasurement3D({
                    view: view
                });
                // skip the initial 'new measurement' button
                activeWidget.viewModel.start().catch((error) => {
                    if (promiseUtils.isAbortError(error)) {
                        return; // don't display abort errors
                    }
                    throw error; // throw other errors since they are of interest
                });

                view.ui.add(activeWidget, "top-left");
                setActiveButton(document.getElementById("areaButton"));
                break;
            case null:
                if (activeWidget) {
                    view.ui.remove(activeWidget);
                    activeWidget.destroy();
                    activeWidget = null;
                }
                break;
        }
    }

    function setActiveButton(selectedButton) {
        // focus the view to activate keyboard shortcuts for sketching
        view.focus();
        const elements = document.getElementsByClassName("active");
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("active");
        }
        if (selectedButton) {
            selectedButton.classList.add("active");
        }
    }
}
//向地图中加入一个多段线
ViewUI.addPolyline = function (graphicsLayer, feature) {
    if (feature.geometry.coordinates == undefined) return;
    var polyline = {
        type: "polyline", // autocasts as new Polyline()
        paths: feature.geometry.coordinates,
        hasZ: false
    };

    var lineSymbol = {
        type: "simple-line", // autocasts as SimpleLineSymbol()
        color: feature.properties.stroke,
        width: feature.properties['stroke-width']
    };

    var polylineGraphic = new Graphic({
        geometry: polyline,
        symbol: lineSymbol
    });
    var name = feature.properties.name;
    var description = feature.properties.description;
    polylineGraphic.attributes = {
        "name": name,
        "description": description
    };
    polylineGraphic.popupTemplate = {
        title: "{name}",
        content: [{
            // Pass in the fields to display
            type: "fields",
            fieldInfos: [{
                fieldName: "name",
                label: "名称"
            }, {
                fieldName: "description",
                label: "描述"
            }]
        }]
    };
    graphicsLayer.add(polylineGraphic);
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
export default ViewUI;
<template>
<div id="cesiumContainer">
</div>
</template>

<script>
import Cesium from "cesium/Cesium";
import widgets from "cesium/Widgets/widgets.css";
import axios from "axios";

export default {
    name: 'cesiumViewer',
    data() {
        return {
            viewer: null
        }
    },
    mounted() {},
    created() {
        this.$nextTick(() => {
            this.init();
        });
    },
    methods: {
        init: function () {
            this.initCesium();
        },
        initCesium() {
            var urlTemplateImageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: "http://localhost:9000/api/tms/osm/{z}/{y}/{x}"
            });
            this.viewer = new Cesium.Viewer('cesiumContainer', {
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                baseLayerPicker: false,
                navigationHelpButton: false,
                animation: false,
                timeline: false,
                fullscreenButton: false,
                vrButton: false,
                //imageryProvider: urlTemplateImageryProvider
            });
            this.viewer._cesiumWidget._creditContainer.style.display = "none";
            this.recoverCamera();
            console.log('cesium viewer inited');

            var dataSource = Cesium.GeoJsonDataSource.load('http://localhost:9094/api/geojson');
            this.viewer.dataSources.add(dataSource);
            //this.viewer.zoomTo(dataSource);
            console.log("geojson loaded");
        },
        recoverCamera() {
            var rectangle = Cesium.Rectangle.fromDegrees(73, 3, 135.0, 53.0);
            this.viewer.camera.setView({
                destination: rectangle,
                orientation: {
                    heading: Cesium.Math.toRadians(0.0), //默认值
                    pitch: Cesium.Math.toRadians(-90.0), // 默认值
                    roll: 0.0 //默认值
                }
            });
        }
    }
}
</script>

<style>
html,
body,
#cesiumContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

.items {
    position: absolute;
    padding-bottom: 20px;
    color: white;
    width: 100%;
    background: #aaaaaaaa;
    z-index: 1;
    /* padding-left: 40px; */
    padding: 5px 5px 5px 45px;
}

.obl.item {
    width: 100px;
    height: 75px;
    margin-right: 5px;
    text-align: center;
}

.ivu-card {
    background: transparent !important;
}
</style>

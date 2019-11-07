<template>
<div id="cesiumContainer">
    <div class="items">
        <vk-grid>
            <div class="obl item" style="background: url('/static/sv/rg_preview1.png')" @click="recoverCamera()">
                <div class="title">Recover</div>
            </div>
            <div class="obl item" style="background: url('/static/sv/rg_preview1.png')" @click="load('ZHJhZ29uU3VuIEF1ZyAxOCAxMjowMDowMCBDU1QgMjAxOQ==', 'tileset.json')">
                <div class="title">海驴岛</div>
            </div>
            <div v-for="(it) in items">
                <div class="obl item" style="background: url('/static/sv/rg_preview1.png')" @click="load(it.uid, it.entry)">
                    <div class="title">{{it.name}}</div>
                </div>
            </div>
        </vk-grid>
    </div>
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
            viewer: null,
            items: null,
            tileset: null
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
            axios.get("http://localhost:9093/api/list").then((rsp) => {
                this.items = rsp.data.data;
                console.log("items");
                console.log(this.items);
            }).catch(err => {
                console.log(err);
            });
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
        },
        load(id, entry) {
            console.log(id);
            this.tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: 'http://localhost:9093/api/3dtile/' + id + "/" + entry
            }));
            this.tileset.viewer = this.viewer;
            this.tileset.readyPromise.then(function (data) {
                // this.viewer.camera.viewBoundingSphere(data.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
                this.viewer.camera.setView({
                    destination: data.boundingSphere,
                    orientation: {
                        heading: Cesium.Math.toRadians(0.0), //默认值
                        pitch: Cesium.Math.toRadians(-90.0), // 默认值
                        roll: 0.0 //默认值
                    }
                });
            });
            console.log(this.tileset);
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

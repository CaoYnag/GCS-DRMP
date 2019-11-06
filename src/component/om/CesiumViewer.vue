<template>
<div id="cesiumContainer">
    <div class="items">
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
            items: null
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
                console.log(items);
            }).catch(err => {
                console.log(err);
            });
        },
        initCesium() {
            var urlTemplateImageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: "http://localhost:9000/api/tms/osm/{z}/{y}/{x}"
            });
            this.viewer = new Cesium.Viewer('cesiumContainer', {
                //imageryProvider: urlTemplateImageryProvider
            });
            console.log('cesium viewer inited');
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
</style>

<template>
<div id="cesiumContainer">
</div>
</template>

<script>
import Cesium from "cesium/Cesium";
import widgets from "cesium/Widgets/widgets.css";

export default {
    name: 'cesiumViewer',
    data: () => 
        {
            viewer: null
        }
    ,
    mounted() {},
    created() {
        this.$nextTick(() => {
            this.init();
        });
    },
    methods: {
        init: function () {
            // add marker here
            var urlTemplateImageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: "http://localhost:9000/api/tms/osm/{z}/{y}/{x}"
            });
            this.viewer = new Cesium.Viewer('cesiumContainer', {
                imageryProvider: urlTemplateImageryProvider
            });
            console.log('cesium viewer inited');
        },
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

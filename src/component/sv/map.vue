<template>
  <div class="module-container">
    <div id="map" ref="map"></div>
    <div id="info"></div>
  </div>
</template>
<style>
  .module-container{
    width: 100%;
    height: 100%;
  }
  #map {
    width: 100%;
    height: 100%;
  }

  #info {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  canvas{
    left: 0;
  }
</style>
<script>
  import "ol/ol.css";
  import * as ol from 'ol';
  import * as ly from 'ol/layer';
  import * as ctrl from 'ol/control';
  import * as src from 'ol/source';
  import * as crds from 'ol/coordinate';

  export default {
    data: () => ({
      map: null
    }),
    created() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init() {
        this.map = new ol.Map({
          target: 'map',
          controls: ctrl.defaults().extend([
            new ctrl.MousePosition({
              className: 'mousePosition',
              coordinateFormat: crds.createStringXY(8),
              projection: 'EPSG:4326',
              target: document.getElementById('info')
            })
          ]),
          view: new ol.View({
            center: [121.4659, 31.2],
            projection: 'EPSG:3857',
            zoom: 0
          })
        });

        /*
        * https://a.tile.openstreetmap.org/{z}/{x}/{y}.png
        * https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg
        * https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}
        * https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}
        *
        * ------Local------
        * http://localhost:9000/api/tms/osm/{z}/{y}/{x}
        * */
        let layer = new ly.Tile({
          source: new src.XYZ({
            url: 'http://localhost:9000/api/tms/osm/{z}/{y}/{x}'
          })
        });
        this.map.addLayer(layer);
      },
    }
  }
</script>

import cform from "./views/cform";
import cslider from "./views/cslider";
import map from "./component/sv/map";
import rg_uk from "./component/sv/Regions_uk";
import prv from "./component/sv/Preview";
import rgp from "./component/sv/RegionPreview";
import cesium from "./component/om/CesiumViewer";
import ml from "./component/om/ModelList";
import moe from "./component/om/ModelsOnEarth";

const layout = resolve => require(["./views/layout/layout.vue"], resolve);
const maptype = resolve => require(["./views/gcs/maptype.vue"], resolve);
const mapds = resolve => require(["./views/gcs/mapds.vue"], resolve);
const maplist = resolve => require(["./views/gcs/maplist.vue"], resolve);
const taskmg = resolve => require(["./views/taskmg/taskmg.vue"], resolve);
const svcconfig = resolve => require(["./views/config/svcconfig.vue"], resolve);
const layerspacepreview = resolve =>
  require(["./views/gcs/layerspace/layerspace-preview.vue"], resolve);
const routers = [
  {
    path: "",
    redirect: "/datasource"
  },
  {
    path: "/datasource",
    name: "home",
    meta: {
      title: "数据资源平台"
    },
    components: {
      default: layout,
      layertype: maptype,
      layerspace: mapds,
      layer: maplist
    },
    children: [
      {
        path: "layertype",
        name: "maptype",
        component: maptype
      },
      {
        path: "layerspace/:layertype",
        name: "layertype",
        component: mapds
      },
      {
        path: "layer/:layerspace",
        name: "layer",
        component: maplist
      },
      {
        path: "preview/:name",
        name: "layerspace",
        component: layerspacepreview
      }
    ]
  },
  {
    path: "/sv",
    components: {
      default: layout
    },
    children: [
      {
        path: "regions_uk",
        name: "rg_uk",
        component: rg_uk
      },
      {
        path: "region/preview/:uid",
        name: "rgp",
        component: rgp
      },
      {
        path: "preview/:geoid",
        name: "prv",
        component: prv
      },
      {
        path: "map",
        name: "map",
        component: map
      }
    ]
  },
  {
    path: "/om",
    components: {
      default: layout
    },
    children: [
      {
        path: "cesium",
        name: "cesium",
        component: cesium
      },
      {
        path: "model",
        name: "model",
        component: ml
      },
      {
        path: "moe",
        name: "moe",
        component: moe
      },
      {
        path: "map",
        name: "map",
        component: map
      }
    ]
  },
  {
    path: "/taskmg",
    components: {
      default: layout
    },
    children: [
      {
        path: "",
        name: "taskmg",
        redirect: "/taskmg/map/upload"
      },
      {
        path: ":svc",
        name: "taskmg",
        redirect: ":svc/upload"
      },
      {
        path: ":svc/:optvalue",
        name: "svctaskmg",
        component: taskmg
      }
    ]
  },
  {
    path: "/config",
    components: {
      default: layout
    },
    children: [
      {
        path: "",
        name: "svcconfig",
        redirect: "/config/map"
      },
      {
        path: ":svc",
        name: "svcconfig",
        component: svcconfig
      }
    ]
  }
];
export default routers;

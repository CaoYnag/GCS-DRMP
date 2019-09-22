<template>
<Menu ref="basemenu" @on-open-change="parentTag" @on-select="childTag" active-name="1-2" theme="light" accordion :style="{background: '#616161',color: '#ffffff'}" width="auto" :open-names="['1']">
    <Submenu name="基础地图数据" ref="layout">
        <template slot="title">
            <!-- <Button  @click="changePage('MAPTYPE')"> -->
            <Icon type="md-globe" />
            <router-link to="/datasource/layertype">基础地图数据</router-link>
            <!-- </Button> -->
        </template>
        <Submenu :name="type.name" v-if="bgOptName=='datasource'" v-for="(type, i) in maptypes" :style="{background: '#616161',color: '#ffffff'}">
            <template slot="title">
                <Button @click="changePage('/datasource/layerspace/',type.layertype)" style="font-size:14px;margin-left: -14px;">
                    {{type.name}}
                </Button>
            </template>
            <MenuItem v-for="(ds, i) in mapdss" v-if="bgOptName=='datasource' && ds.layertype==type.layertype" :name="ds.name">
            <router-link class="final" :to="{path:'/datasource/layer/'+ds.name}" style="">{{ds.name}}</router-link>
            </MenuItem>
        </Submenu>
        <MenuItem :name="opt.name" v-if="bgOptName=='progress'" v-for="(opt, i) in opts">
        <!-- <template slot="title"  >

<Button  @click="changePage('/progress/map',opt.value)" style="font-size:14px;margin-left: -14px;" >

{{opt.name}}

</Button>

</template> -->
        <router-link class="final" :to="{path:'/taskmg/map/'+opt.value}">{{opt.name}}</router-link>
        </MenuItem>
    </Submenu>
    <Submenu name="三维地形数据">
        <template slot="title">
            <!-- <Button  @click="changePage('/datasource/model',type.layertype)"> -->
            <Icon type="md-globe" />
            <router-link to="/datasource/layertype">三维地形数据</router-link>
        </template>
        <Submenu name="模型数据">
            <template slot="title">
                <Button @click="changePage('/datasource/model','')">
                    模型数据
                </Button>
            </template>
            <MenuItem name="2-1">IVE</MenuItem>
            <MenuItem name="2-2">FLT</MenuItem>
        </Submenu>
        <Submenu name="倾斜摄影">
            <template slot="title">
                <router-link to="/om/cesium">倾斜摄影</router-link>
            </template>
            <MenuItem name="3DTiles">
            <router-link to="/om/cesium">3DTiles</router-link>
            </MenuItem>
            <MenuItem name="OSGB">
            <router-link to="/om/cesium">OSGB</router-link>
            </MenuItem>
        </Submenu>
        <Submenu name="街景数据">
            <template slot="title">
                <router-link to="/sv/map">街景数据</router-link>
            </template>
            <MenuItem name="regions">
            <router-link to="/sv/regions_uk">Regions</router-link>
            </MenuItem>
            <MenuItem name="map">
            <router-link to="/sv/map">Map</router-link>
            </MenuItem>
        </Submenu>
    </Submenu>
    <Submenu name="图标数据">
        <template slot="title">
            <Icon type="ios-information-circle-outline" />
            <router-link to="/datasource/symbol">图标数据</router-link>
        </template>
        <MenuItem name="5-1">默认</MenuItem>
    </Submenu>
</Menu>
</template>

<script>
// $('.ivu-menu-submenu').bind('click',function(){
// 	//	this.changePage('MAPTYPE');
// })
import {
    globalBus
} from '../../global/globalBus';
export default {
    data() {
        return {
            maptypes: [],
            mapdss: [],
            opts: [],
            open: [],
            active: "1-1",
        }
    },
    computed: {
        bgOptName() {
            return this.$store.state.bgOptName;
        }
    },
    updated() {

    },
    mounted() {
        console.log("bgOptName: " + this.$store.state.bgOptName);
        let baseUrl = this.$store.state.accessSvcPath;
        this.$axios.get(baseUrl + "/maptype")
            .then((response) => {
                console.log(response.data)
                this.maptypes = response.data;
            });
        this.$axios.get(baseUrl + "/map/opt")
            .then((response) => {
                console.log(response.data)
                this.opts = response.data;
            })
        // let baseUrl = this.$store.state.accessSvcPath;

        // this.$axios.get(baseUrl+"/maptype")
        // .then((response)=>{
        // 	console.log(response.data)
        // 	this.maptypes = response.data;
        // });
        // this.$axios.get(baseUrl+"/map/opt")
        // .then((response)=>{
        // 	console.log(response.data)
        // 	this.opts = response.data;
        // })
    },
    methods: {
        refreshMenu: function () {
            console.log("bgOpt:" + this.$store.state.bgOptName)
            this.open = ["基础地图"];
            this.$nextTick(function () {
                this.$refs.basemenu.updateOpened();
                // this.$refs.basemenu.updateActiveName();
            })
        },
        changePage: function (url, param) {
            // this.$set(this.$refs.layout.data,'contentName','MAPDS');
            // this.$store.commit('newPage',pageName);
            // let key = this.$store.state.bgSvcName;
            // let baseUrl = this.$store.state.accessSvcMap.get(key);
            let baseUrl = this.$store.state.accessSvcPath;
            this.$axios.get(baseUrl + url + param)
                .then((response) => {
                    console.log(response.data)
                    this.mapdss = response.data;
                    this.$forceUpdate();
                })
            this.$router.push({
                path: url + param
            });
        },
        parentTag: function (e) {
            // this.Components=e[0];
            let menuList = [];
            e.forEach(function (item, index) {
                menuList[index] = {
                    name: item
                };
            });
            // console.log(menuList);
            this.$store.commit('setBreadCrumb', {
                breadCrumbList: menuList
            });
            this.$store.commit('setCurrCrumbNme', {
                currCrumbNme: []
            });
            this.$store.commit('setBgSvcName', {
                bgSvcName: e[0]
            });
            console.log("bgSvcName: " + e[0]);
            if (e[0] == undefined) {
                this.$store.commit('setBreadCrumb', {
                    breadCrumbList: []
                });
            }
        },
        childTag: function (e) {
            let newItem = {
                name: e
            }
            // console.log(newItem);
            this.$store.commit('setCurrCrumbNme', {
                currCrumbNme: newItem
            });
        }
    }
}
</script>

<style scoped>
.MenuItem :after {
    color: white;
    background: #f1f1f1;
}

.MenuItem {
    background: #f1f1f1;
    color: #000000
}

a {
    background-color: #616161;
    color: #FFFFFF;
    border-width: 0;
    font-size: 0.9375rem;
}

a.final {
    background: #f1f1f1;
    color: #000000
}

.ivu-btn {
    background-color: #616161;
    color: #FFFFFF;
    border-width: 0;
    font-size: 0.9375rem;
    margin-left: -22px;
}

.ivu-btn:hover {
    color: #FFFFFF;
    background-color: #616161;
    border-width: 0;
    border-color: 616161;
}

.ivu-btn:focus {
    box-shadow: 0 0 0 0px rgba(45, 140, 240, 0);
}

.ivu-menu-dark {
    background: #001529;
}

.layout-nav {
    width: 360px;
    margin: 0 auto;
    margin-right: 0px;
}

.ivu-layout-header {
    background: #001529;
}

.ivu-menu-submenu-title {
    background: #f1f1f1;
    color: #FFFFFF;
}

.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item {
    background: #f1f1f1;
    color: #000000;
}

.ivu-menu-submenu ivu-menu-opened ivu-menu-submenu-has-parent-submenu {
    color: #ffffff;
}

.ivu-menu-submenu-title {
    background: #f1f1f1;
    color: #ffffff;

}

.ivu-layout-sider-children {
    background: #f1f1f1;
    color: #ffffff;
}

.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
        top: 0;
    }
}
</style>

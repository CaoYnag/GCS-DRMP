<template>
<div class="model container">
    <Divider>
        <h3>模型列表</h3>
    </Divider>
    <Table stripe :columns="columns" :data="datas"></Table>
</div>
</template>

<style>
.container {
    width: 100%;
    height: 100%;
}
</style>

<script>
import axios from "axios";

export default {
    data: () => ({
        columns: [{
            title: 'Name',
            key: 'name'
        }, {
            title: 'Type',
            key: 'type'
        }, {
            title: 'Pos',
            key: 'pos'
        }, {
            title: 'Scl',
            key: 'scl'
        }, {
            title: 'Rot',
            key: 'rot'
        }, {
            title: 'Desc',
            key: 'desc'
        }, {
            title: 'Time',
            key: 'time'
        }, {
            title: 'Worker',
            key: 'worker'
        }],
        items: [],
        datas: []
    }),
    created() {
        this.$nextTick(() => {
            this.init()
        })
    },
    methods: {
        init() {
            // use mocks data instead of req server.
            this.items = [{
                "uid": "dGVtcG9ialdlZCBBdWcgMjggMTU6NTc6NTMgQ1NUIDIwMTk=",
                "name": "temp",
                "type": "obj",
                "desc": "temp\t\t\t\t--gen by oblique services.",
                "lng": 0.0,
                "lat": 0.0,
                "alt": 0.0,
                "scaleX": 0.0,
                "scaleY": 0.0,
                "scaleZ": 0.0,
                "yaw": 0.0,
                "pitch": 0.0,
                "roll": 0.0,
                "timestamp": 1566983668000,
                "upload": 1566983668000,
                "worker": null
            }, {
                "uid": "VGVzdHVua25vd25UaHUgQXVnIDI5IDE2OjE5OjU1IENTVCAyMDE5",
                "name": "Test",
                "type": "unknown",
                "desc": "Test\t\t\t\t--gen by oblique services.",
                "lng": 0.0,
                "lat": 0.0,
                "alt": 0.0,
                "scaleX": 0.0,
                "scaleY": 0.0,
                "scaleZ": 0.0,
                "yaw": 0.0,
                "pitch": 0.0,
                "roll": 0.0,
                "timestamp": 1567066795000,
                "upload": 1567066795000,
                "worker": null
            }];
            // axios.get("http://localhost:9094/api/list").then((rsp) => {
            //     this.items = rsp.data.data;
            //     this.formatData();
            // }).catch(err => {
            //     console.log(err);
            // });
            console.log(this.items);
            this.formatData();
        },
        formatData() {
            this.datas = [];
            for (var item of this.items) {
                var data = {};
                data.name = item.name;
                data.type = item.type;
                data.desc = item.desc;
                data.worker = item.worker === null || item.worker === '' ? 'unkonwn' : item.worker;
                data.pos = item.lng + ", " + item.lat + ", " + item.alt;
                data.scl = item.scaleX + ", " + item.scaleY + ", " + item.scaleZ;
                data.rot = item.yaw + ", " + item.pitch + ", " + item.roll;
                let date = new Date(item.timestamp);
                data.time = date.toLocaleDateString() + " " + date.toLocaleTimeString();
                this.datas.push(data);
            }
        }
    },

}
</script>

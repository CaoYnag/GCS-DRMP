<style scoped>
.MenuItem :after {
    color: white;
    background: #f1f1f1;
}

.MenuItem {
    background: #f1f1f1;
    color: #000000
}

.ivu-btn {
    background-color: #001529;
    color: #FFFFFF;
    border-width: 0;
    font-size: 0.9375rem;
    padding: 0;
}

.ivu-btn:hover {
    /* color: #FFFFFF; */
    background-color: #001529;
    border-width: 0;
    border-color: 616161;
}

.ivu-btn:focus {
    box-shadow: 0 0 0 0px rgba(45, 140, 240, 0);
}

.ivu-menu-dark {
    background: #001529;
}

.ivu-menu-item {
    padding: 0 10px;
}

.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}

.layout-logo {
    width: 240px;
    height: 40px;
    /* background: #5b6270; */
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
    color: white;
    text-align: center;
    line-height: 40px;
    font-size: 24px;
    margin-left: -20px;
    letter-spacing: 1px;
    font-family: inherit;
    font-weight: initial;
}

.layout-nav {
    width: 380px;
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

.ivu-layout-sider-children {
    background: #f1f1f1;
    color: #ffffff;
}

.ivu-layout-footer {
    /* background: #393d49; */
    padding: 0px;
    color: #393d49;
    font-size: 14px;
    text-align: center;
    height: 30px;
    line-height: 30px;
}

.Card {
    width: 280px;
}

.ivu-table .demo-table-error-row td {
    background-color: #ff6600;
    color: #fff;
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
<template>
<div class="layout">
    <Layout>
        <Header>
            <Menu mode="horizontal" theme="dark" active-name="1">
                <div class="layout-logo">数据资源管理平台</div>
                <div class="layout-nav">
                    <MenuItem name="1">
                    <Button @click="changePage('/datasource/'+bgSvcName)" icon="ios-settings" style="font-size:14px;">
                        数据资源
                    </Button>
                    </MenuItem>
                    <MenuItem name="2">
                    <Button @click="changePage('/taskmg/'+bgSvcName+'')" icon="md-build" style="font-size:14px;">
                        任务管理
                    </Button>
                    </MenuItem>
                    <MenuItem name="2">
                    <Button @click="changePage('/config/'+bgSvcName)" icon="ios-settings" style="font-size:14px;">
                        平台配置
                    </Button>
                    </MenuItem>
                    <!-- <Icon type="md-build"></Icon>

<router-link style="color: #FFF;" to="/progress">任务管理</router-link> -->
                    <!-- <MenuItem name="平台配置" >
                            <Icon type="ios-settings" />

<router-link style="color: #FFF;"  to="/config">平台配置</router-link>
                        </MenuItem> -->
                </div>
            </Menu>
        </Header>
        <Layout>
            <Sider hide-trigger :style="{background: '#616161',color: '#ffffff'}">
                <custommenu ref="custommenu"></custommenu>
            </Sider>
            <Layout style="padding: '0 24px 24px';">
                <!-- <breadcrumb ></breadcrumb> -->
                <!-- <Tag type="dot" :value="$route" closable color="primary"></Tag> -->
                <Content :style="{padding: '24px', minHeight: '300px', background: '#fff'}">
                    <router-view />
                    <!-- <maptype v-if="page=='MAPTYPE'"></maptype>

<mapds  v-if="page=='MAPDS'"></mapds>

<maplist  v-if="page=='MAPLIST'"></maplist> -->
                    <!-- 

   <maptype></maptype>

   <mapds></mapds>

   <maplist></maplist> 

   -->
                </Content>
            </Layout>
        </Layout>
        <Footer>
            中科院空天信息研究院苏州研究院
        </Footer>
    </Layout>
    <Modal v-model="modal12" draggable scrollable title="Global Image">
        <div>
            <Table size="small" height="240" stripe :show-header="false" :columns="columns1" :data="data1"></Table>
        </div>
    </Modal>
</div>
</template>

<script>
import global from '../../views/global';
import mapds from '../../views/gcs/mapds';
import maplist from '../../views/gcs/maplist';
import maptype from '../../views/gcs/maptype';
import breadcrumb from '../../views/layout/breadcrumb';
import custommenu from '../../views/layout/menu';
import mapdsinfo from '../../views/gcs/mapdsinfo';
export default {
    components: {
        custommenu,
        breadcrumb,
        maptype,
        mapds,
        maplist,
        mapdsinfo
    },
    data() {
        return {
            Home: "您当前的位置为",
            contentName: global.contentname
        }
    },
    computed: {
        page() {
            return this.$store.state.pageName
        },
        componentName() {
            return this.$store.state.componentName
        },
        layoutName() {
            return this.$store.state.layoutName
        },
        bgOptName() {
            return this.$store.state.bgOptName
        },
        bgSvcName() {
            return this.$store.state.bgSvcName
        }
    },
    methods: {
        changePage: function (url) {
            if (url == '/')
                this.$store.commit('setBgOptName', {
                    bgOptName: 'datasource'
                });
            this.$router.push({
                path: url
            });
            this.$refs.custommenu.refreshMenu();
        },
    }
}
</script>

import Vue from 'vue'
import Vuex from 'vuex'
import createPersiste from 'vue-savedata'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 定义状态
    state: {
        pageName: 'MAPTYPE',
        currRouteNme: String,
        oriMenuList: Array,
        menuList: Array,
        breadCrumbList: Array,
        currCrumbNme: Array,
        accessSvcPath: 'http://localhost:8089/gcsprocess/datasource/map',
        configSvcPath: '',
        bgSvcName: '基础地图',
        bgOptName: 'datasource',
        accessSvcMap: new Map([['基础地图', 'http://localhost:8089/gcsprocess/datasource/map']]),
    },
    mutations: {
        newPage(state, msg) {
            state.pageName = msg
        },
        setCurrRouteNme(state, payload) {
            state.currRouteNme = payload.currRouteNme
        },
        setMenuList(state, payload) {
            state.menuList = payload.menuList
        },
        setOriMenuList(state, payload) {
            state.oriMenuList = payload.oriMenuList
        },
        setBreadCrumb(state, payload) {
            state.breadCrumbList = payload.breadCrumbList;
        },
        setCurrCrumbNme(state, payload) {
            state.currCrumbNme = payload.currCrumbNme;
        },
        setAccessSvcPath(state, payload) {
            state.accessSvcPath = payload.accessSvcPath;
        },
        setConfigSvcPath(state, payload) {
            state.configSvcPath = payload.configSvcPath;
        },
        setBgSvcName(state, payload) {
            state.bgSvcName = payload.bgSvcName;
        },
        setBgOptName(state, payload) {
            state.bgOptName = payload.bgOptName;
        },
        addAccessSvcMap(state, payload) {
            state.accessSvcMap.set(payload.key, payload.value);
        },
        getAccessSvcMap(key) {
            return state.accessSvcMap.get(key);
        }
    },
    actions: { //因为数据是异步请求获取的,所以改变state要通过dispatch,commit只能处理同步数据
        setMenuList({commit}) {
            let menuList;
            return new Promise((resolve) => {
                axios(url).then(res => { //url是请求菜单数据的接口
                    menuList = res.data.authList.map(({id, symbol, pId, forward, resName, isLeaf}) => {
                        return {
                            id,
                            symbol,
                            pId,
                            forward,
                            label: resName,
                            isLeaf: isLeaf,
                            icon: isLeaf == 1 ? '' : 'el-icon-goods'
                        }
                    });

                    commit('setOriMenuList', {
                        oriMenuList: menuList
                    });
                    //这边是为了左侧菜单而进行的数据处理,可忽略
                    let menuTree = menuList.reduce(function (prev, item) {
                        prev[item.pId] ? prev[item.pId].push(item) : prev[item.pId] = [item];
                        return prev;
                    }, {});

                    for (let parentItem in menuTree) {
                        menuTree[parentItem].forEach(function (item) {
                            item.children = menuTree[item.id] ? menuTree[item.id] : null;
                        });
                    }

                    commit('setMenuList', {
                        menuList: menuTree[0]
                    });

                    resolve();
                })
            })

        },

        setBreadCrumb({commit, state}) {

            let currMenuList = state.oriMenuList;
            let currMenu;
            let breadCrumbPre = [];

            for (let i = 0; i < currMenuList.length; i++) {
                if (currMenuList[i]['symbol'] == state.currRouteNme) {
                    currMenu = currMenuList[i];
                    let breadCrumbItem = {};
                    breadCrumbItem.title = currMenuList[i].label;
                    breadCrumbItem.path = '';
                    breadCrumbPre.unshift(breadCrumbItem);
                }
            }

            function setBreadCrumb(menu) { //递归找出当前菜单的所有父亲菜单
                if (menu.pId != 0) {
                    for (let i = 0; i < currMenuList.length; i++) {
                        if (currMenuList[i]['id'] == menu.pId) {
                            let breadCrumbItem = {};
                            breadCrumbItem.title = currMenuList[i]['label'];
                            breadCrumbItem.path = '';
                            breadCrumbPre.unshift(breadCrumbItem);
                            setBreadCrumb(currMenuList[i])
                        }
                    }
                }
            }

            setBreadCrumb(currMenu);
            let index = {
                title: '首页',
                path: ''
            };
            breadCrumbPre.unshift(index);
            commit('setBreadCrumb', {
                breadCrumbList: breadCrumbPre
            })
        }

    },
    // plugins: [createPersiste()]
})

export default store
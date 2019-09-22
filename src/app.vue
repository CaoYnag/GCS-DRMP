<style scoped>
    @import 'styles/common.css';
</style>
<template>
    <div>
        <!-- <router-view class="view one"></router-view> -->
        <!-- <router-view></router-view> -->
        <!-- <router-view></router-view> -->
        <router-view/>
        <!-- <router-view name="cform1"></router-view> -->
    </div>
</template>
<script>
    import layout from './views/layout/layout'

    export default {
        comments: {
            layout
        },
        data() {
            return {
                //实例对象
                fApi: {},
                //表单生成规则
                rule: [
                    {
                        type: 'input',
                        field: 'goods_name',
                        title: '商品名称'
                    },
                    {
                        type: 'datePicker',
                        field: 'created_at',
                        title: '创建时间'
                    }
                ],
                //组件参数配置
                option: {
                    //表单提交事件
                    onSubmit: function (formData) {
                        alert(JSON.stringify(formData));
                    }
                }
            };
        }
    }
</script>

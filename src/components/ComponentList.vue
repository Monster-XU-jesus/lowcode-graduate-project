<template>
    <!-- 拖拽开始事件，可绑定于被拖拽元素上 -->
    <div class="xzy">
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="输入型控件" name="1">
                <div class="component-list" @dragstart="handleDragStart">
                    <div
                        v-for="index in inputComponentList"
                        :key="index"
                        class="list"
                        draggable
                        :data-index="index"
                    >
                        <span v-if="componentList[index].icon.substr(0,2) === 'el'" :class="componentList[index].icon"></span>
                        <span v-else class="iconfont" :class="'icon-' + componentList[index].icon"></span>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="显示型控件" name="2">
                <div class="component-list" @dragstart="handleDragStart">
                    <div
                        v-for="index in showComponentList"
                        :key="index"
                        class="list"
                        draggable
                        :data-index="index"
                    >
                        <span v-if="componentList[index].icon.substr(0,2) === 'el'" :class="componentList[index].icon"></span>
                        <span v-else class="iconfont" :class="'icon-' + componentList[index].icon"></span>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="图形控件" name="3">
                <div class="component-list" @dragstart="handleDragStart">
                    <div
                        v-for="index in patternComponentList"
                        :key="index"
                        class="list"
                        draggable
                        :data-index="index"
                    >
                        <span v-if="componentList[index].icon.substr(0,2) === 'el'" :class="componentList[index].icon"></span>
                        <span v-else class="iconfont" :class="'icon-' + componentList[index].icon"></span>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import componentList from '@/custom-component/component-list'

export default {
    data() {
        return {
            componentList,
            activeName: '1',
            // 下方为对应控件的索引值
            inputComponentList: [0, 1],
            showComponentList: [2, 8, 9, 10, 11],
            patternComponentList: [3, 4, 5, 6, 7],
        }
    },
    mounted() {
        // console.log(typeof(componentList[0].component));
    },
    methods: {
        handleDragStart(e) {
            e.dataTransfer.setData('index', e.target.dataset.index) // 传过去的是data-index绑定的值(根据index才知道应该生成什么控件)
            console.log(e.target.dataset.index);
        },
    },
    mounted() {
        // console.log(typeof(componentList[0].component));
    }
}
</script>

<style lang="scss" scoped>
.component-list {
    height: 65%;
    padding: 10px;
    display: grid;
    grid-gap: 10px 19px;
    grid-template-columns: repeat(auto-fill, 80px);
    grid-template-rows: repeat(auto-fill, 40px);

    .list {
        width: 80px;
        height: 40px;
        border: 1px solid #ddd;
        cursor: grab;
        text-align: center;
        color: #333;
        padding: 2px 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
            cursor: grabbing;
        }

        .iconfont {
            margin-right: 4px;
            font-size: 20px;
        }

        .icon-wenben,
        .icon-biaoge {
            font-size: 18px;
        }

        .icon-tupian {
            font-size: 16px;
        }
    }
}
</style>

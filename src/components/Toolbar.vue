<template>
    <div>
        <div class="toolbar">
            <!-- <el-button @click="handleAceEditorChange">JSON</el-button> -->
            <!-- <img
                src="@/assets/xzy.png"
                alt=""
                width="50"
                height="50"
            > -->
            <!-- <span>基本操作：</span> -->
            <div>
            <el-tooltip
                effect="dark"
                content="撤消"
                placement="bottom"
            >
                <el-button round plain @click="undo"><el-icon class="el-icon-back"></el-icon></el-button>
            </el-tooltip>
            <el-tooltip
                effect="dark"
                content="重做"
                placement="bottom"
            >
                <el-button round plain @click="redo">
                    <el-icon
                        class="el-icon-right"
                    ></el-icon>
                </el-button>
            </el-tooltip>
            <label for="input" class="insert">
                <el-tooltip
                    effect="dark"
                    content="上传图片"
                    placement="bottom"
                >
                    <el-icon
                        class="el-icon-picture-outline"
                    ></el-icon>
                </el-tooltip>
                <input
                    id="input"
                    type="file"
                    hidden
                    @change="handleFileChange"
                />
            </label>
            
            <el-tooltip
                effect="dark"
                content="预览"
                placement="bottom"
            >
                <el-button
                    round
                    style="margin-left: 10px;"
                    plain
                    @click="preview(false)"
                >
                    <el-icon
                        class="el-icon-full-screen"
                    ></el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip
                effect="dark"
                content="保存"
                placement="bottom"
            >
                <el-button
                    round
                    style="margin-left: 10px;"
                    plain
                    @click="save"
                >
                    <el-icon
                        class="el-icon-files"
                    ></el-icon>
                </el-button>
            </el-tooltip>
            </div>

            <div class="canvas-config" >
                <div class="canvas-config">
                    <span>长：</span>
                    <input v-model="canvasStyleData.width" style=" border: 1px solid #ccc;border-radius: 5px;height: 25px;width: 100px;">
                    <span>宽：</span>
                    <input v-model="canvasStyleData.height" style=" border: 1px solid #ccc;border-radius: 5px;height: 25px;width: 100px;">
                </div>
                <div class="canvas-config">
                    <span>比例大小：</span>
                    <input v-model="scale" style=" border: 1px solid #ccc;border-radius: 5px;height: 25px;" @input="handleScaleChange"> %
                </div>
            </div>

            <div>
            <el-tooltip
                effect="dark"
                content="清空画布"
                placement="bottom"
            >
                <el-button
                    round
                    style="margin-left: 10px;"
                    plain
                    @click="clearCanvas"
                >
                    <el-icon
                        class="el-icon-delete"
                    ></el-icon>
                </el-button>
            </el-tooltip>

            <el-button :disabled="!areaData.components.length" plain @click="compose">组合</el-button>
            <el-button
                :disabled="!curComponent || curComponent.isLock || curComponent.component != 'Group'"
                plain
                @click="decompose"
            >
                拆分
            </el-button>

            <el-button :disabled="!curComponent || curComponent.isLock" plain @click="lock">锁定</el-button>
            <el-button :disabled="!curComponent || !curComponent.isLock" plain @click="unlock">解锁</el-button>
            <el-tooltip
                effect="dark"
                content="截图"
                placement="bottom"
            >
                <el-button
                    round
                    style="margin-left: 10px;"
                    plain
                    @click="preview(true)"
                >
                    <el-icon
                        class="el-icon-camera"
                    ></el-icon>
                </el-button>
            </el-tooltip>

            <el-popover
                placement="bottom-start"
                width="200"
                trigger="hover"
            >
                <ul>
                    <li>ctrl / command + c : 复制 </li>
                    <br>
                    <li>ctrl / command + v : 粘贴 </li>
                    <br>
                    <li>ctrl / command + x : 剪切 </li>
                    <br>
                    <li>ctrl / command + y : 重做 </li>
                    <br>
                    <li>ctrl / command + z : 撤销 </li>  
                    <br>
                    <li>ctrl / command + s : 保存 </li>  
                    <br> 
                    <li>ctrl / command + p : 预览 </li>  
                    <br> 
                    <li>ctrl / command + d : 删除 </li> 
                    <br>
                    <li>ctrl / command + e : 清空 </li>   
                    <br> 
                    <li>Backspace : 撤销 </li>  
                    <br>
                    <li>Delete : 撤销 </li>  
                </ul>
                <div slot="reference" class="shortcut">
                    <span class="el-icon-question"></span>
                    <span>快捷键</span>
                </div>
            </el-popover>
            </div>
        </div>

        <!-- 预览 -->
        <Preview v-if="isShowPreview" :is-screenshot="isScreenshot" @close="handlePreviewChange" />
        <AceEditor v-if="isShowAceEditor" @closeEditor="closeEditor" />
    </div>
</template>

<script>
import generateID from '@/utils/generateID'
import toast from '@/utils/toast'
import { mapState } from 'vuex'
import Preview from '@/components/Editor/Preview'
import AceEditor from '@/components/Editor/AceEditor.vue'
import { commonStyle, commonAttr } from '@/custom-component/component-list'
import eventBus from '@/utils/eventBus'
import { $ } from '@/utils/utils'
import changeComponentsSizeWithScale, { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale'

export default {
    components: { Preview, AceEditor },
    data() {
        return {
            isShowPreview: false,
            isShowAceEditor: false,
            timer: null,
            isScreenshot: false,
            scale: 100,
        }
    },
    computed: mapState([
        'componentData',
        'canvasStyleData',
        'areaData',
        'curComponent',
        'curComponentIndex',
    ]),
    created() {
        eventBus.$on('preview', this.preview)
        eventBus.$on('save', this.save)
        eventBus.$on('clearCanvas', this.clearCanvas)

        this.scale = this.canvasStyleData.scale
    },
    methods: {
        handleScaleChange() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                // 画布比例设一个最小值，不能为 0
                // eslint-disable-next-line no-bitwise
                this.scale = (~~this.scale) || 1
                changeComponentsSizeWithScale(this.scale)
            }, 1000)
        },

        handleAceEditorChange() {
            this.isShowAceEditor = !this.isShowAceEditor
        },
        
        closeEditor() {
            this.handleAceEditorChange()
        },

        lock() {
            this.$store.commit('lock')
        },

        unlock() {
            this.$store.commit('unlock')
        },

        compose() {
            this.$store.commit('compose')
            this.$store.commit('recordSnapshot')
        },

        decompose() {
            this.$store.commit('decompose')
            this.$store.commit('recordSnapshot')
        },

        undo() {
            this.$store.commit('undo')
        },

        redo() {
            this.$store.commit('redo')
        },

        handleFileChange(e) {
            const file = e.target.files[0]
            if (!file.type.includes('image')) {
                toast('只能插入图片')
                return
            }

            const reader = new FileReader()
            reader.onload = (res) => {
                const fileResult = res.target.result
                const img = new Image()
                img.onload = () => {
                    const component = {
                        ...commonAttr,
                        id: generateID(),
                        component: 'Picture',
                        label: '图片',
                        icon: '',
                        propValue: {
                            url: fileResult,
                            flip: {
                                horizontal: false,
                                vertical: false,
                            },
                        },
                        style: {
                            ...commonStyle,
                            top: 0,
                            left: 0,
                            width: img.width,
                            height: img.height,
                        },
                    }

                    changeComponentSizeWithScale(component)

                    this.$store.commit('addComponent', { component })
                    this.$store.commit('recordSnapshot')

                    // 修复重复上传同一文件，@change 不触发的问题
                    $('#input').setAttribute('type', 'text')
                    $('#input').setAttribute('type', 'file')
                }

                img.src = fileResult
            }

            reader.readAsDataURL(file)
        },

        preview(isScreenshot) {
            this.isScreenshot = isScreenshot
            this.isShowPreview = true
            this.$store.commit('setEditMode', 'preview')
        },

        save() {
            localStorage.setItem('canvasData', JSON.stringify(this.componentData))
            localStorage.setItem('canvasStyle', JSON.stringify(this.canvasStyleData))
            this.$message.success('保存成功')
        },

        clearCanvas() {
            this.$store.commit('setCurComponent', { component: null, index: null })
            this.$store.commit('setComponentData', [])
            this.$store.commit('recordSnapshot')
        },

        handlePreviewChange() {
            this.isShowPreview = false
            this.$store.commit('setEditMode', 'edit')
        },
    },
}
</script>

<style lang="scss" scoped>
img {
    width: 230px;
    height: 68px;
    position: fixed;
}

ul li {
    list-style-type: none;
}

.shortcut {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    color: #606266;

    span {
        margin-left: 10px;
    }
}

.shortcut:hover {
    color: #409eff;
    cursor: pointer;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    white-space: nowrap;
    overflow-x: auto;
    background: #fff;
    border-bottom: 1px solid #ddd;

    .canvas-config {
        display: inline-block;
        margin-left: 10px;
        margin-top: 2px;
        font-size: 14px;
        color: #606266;

        input {
            width: 50px;
            margin-left: 4px;
            outline: none;
            padding: 0 5px;
            border: 1px solid #ddd;
            color: #606266;
        }

        span {
            margin-left: 10px;
        }
    }

    .insert {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
        margin-left: 10px;

        &:active {
            color: #3a8ee6;
            border-color: #3a8ee6;
            outline: 0;
        }

        &:hover {
            background-color: #ecf5ff;
            color: #3a8ee6;
        }
    }
}
</style>

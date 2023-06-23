<template>
    <div class="attr">
        <CommonAttr></CommonAttr>
        <el-form>
            <el-form-item label="视频资源">
                <el-upload action="" :on-success="getObjectURL">  
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import CommonAttr from "@/custom-component/common/CommonAttr.vue";

export default {
    components: { CommonAttr },
    computed: {
        curComponent() {
            return this.$store.state.curComponent;
        },
    },
    methods: {
        getObjectURL() {
            let fr = new FileReader();
            fr.readAsDataURL(e.target.files[0]);
            fr.onload = e => {
                url = e.target.result;
                this.curComponent.propValue.url = url;
            }
        }
    }
};
</script>

<style>
.attr {
    margin: 13px;
}
</style>

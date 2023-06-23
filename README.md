## 说明

这是一个为了记录和实现毕设的开发所创建的仓库，所以会集成多元的代码在其中，暂时还不具备学习价值

## 运行

浏览器运行

`npm run dev`

electron运行

`npm run electron:serve`


## 💼 任务

> 重要难度1-5
1. 弄明白页面的设计（2）
2. 对模块进行拆分，了解其实现的功能（4）
3. 对模块之间的关联进行研究，参考文档进行学习（4）
4. 修改整体的样式 (5)
5. 在原本的基础上进行改造，添加新的功能 (5)

## ✨ 学习目标 —— 功能点
### 一、组件在画布当中的移动
目录：src/components/Editor/index.vue

### 二、改变图层
目录：src/store/index.js
原理：改变在componentData数组的位置（componentData是

### 三、放大缩小
目录：
1. 插槽位置（给插，即统一渲染的组件）src/components/Editor/Shape.vue
2. 传递数据：src/components/Editor/index.vue
  a. 这个组件是进行页面组件的各种集合的一个组件
原理：
1. 设置事件监听，监听按下、抬起，当滑动的时候，一直给Vuex中赋值

### 四、撤销和重做
目录：src/store/snapshot.js
原理：通过数组去保留每一个操作的页面数据，这个数据是一个大数组，里面存储小数组放有页面组件的值

### 五、吸附
目录：src/components/Editor/MarkLine.vue
传值的组件：src/components/Editor/Shape.vue
原理：当移动组件的时候，去判断与另外个组件的位置的差值（那是得与每一个组件都判断一遍吗）

### 六、组件属性
目录：src/custom-component/common/CommonAttr.vue
原理：
1. 根据v-model.number去区分使用的是数字输入框还是字符串

### 七、绑定事件
目录：src/utils/events.js（记录了事件的方法）
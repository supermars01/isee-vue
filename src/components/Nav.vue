<template>
  <div class="nav">
    <el-menu :default-active="activeIndex" mode="horizontal" router >
      <el-menu-item index="/home" class="logo">
        <img src="../assets/logo.svg" alt="isee-logo" srcset />
      </el-menu-item>
      <el-menu-item index="/about" class="right">指南</el-menu-item>
      <el-submenu index="/" class="right">
        <template slot="title">功能模块</template>
        <el-menu-item index="/module/industry">高校产学共创排行榜</el-menu-item>
        <el-menu-item index="/module/paperMatrix">高校论文产出矩阵</el-menu-item>
        <el-menu-item index="/module/patentMatrix">高校专利产出矩阵</el-menu-item>
        <el-menu-item index="/module/worldMap">高校论文国际合作地图</el-menu-item>
        <el-menu-item index="/module/fushion">高校学科融合指数</el-menu-item>
        <el-menu-item index="/module/medicalWork">医疗机构医工结合排行榜</el-menu-item>
      </el-submenu>
      
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "/"
    };
  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
.nav {
  .el-menu {
    .el-menu-item.logo {
      border: none;
    }
    .right {
      float:right;
    }
  }
}
</style>
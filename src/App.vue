<template>
  <div id="app">
    <el-container>
      <el-header id="navigation">
        <Nav class="nav"></Nav>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <el-backtop></el-backtop>
  </div>
</template>
<script>
import Nav from "@/components/Nav.vue";

export default {
  components: {
    Nav
  }
};
</script>
<style lang="less">
@import url("./assets/less/base.less");
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size:14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: @font-color;
  text-align: center;
  .el-container {
    .el-header {
      padding: 0;
      width: 100%;
      
    }
    .el-main {
      padding: 0;
      background-color: @background-color;
      overflow: visible !important;
    }
  }
}
</style>

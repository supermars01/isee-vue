<template>
  <div class="module">
    <el-card :body-style="{ padding: '0px' }">
      <el-image :src="imgSrc" class="image" lazy></el-image>
      <div class="title">
        {{title}}
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "FuncModule",
  props: {
    imgSrc: String,
    title: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .module {
    .el-card:hover {
        transform: translateY(-10px);
        box-shadow: 6px 10px 10px #EBEEF5
      }
    .el-card {
      .image {
        width: 100%;
        display: block;
      }
      div.title {
        padding: 14px;
        border-top:1px solid #EBEEF5
      }

    }

    
  }
  
</style>

<template>
  <div class="about">
    <el-button
      type="primary"
      :icon="unfold?'el-icon-s-unfold':'el-icon-s-fold'"
      plain
      style="padding:10px 12px;font-size:20px"
      class="hidden-lg-and-up"
      :class="[unfold?'unfold':'fold']"
      @click="selectUnfold"
    ></el-button>
    <el-container>
      <el-aside width="240px" class="hidden-md-and-down">
        <el-menu default-active="0" @select="handleSelect">
          <el-menu-item v-for="(doc,idx) in docs" :key="idx" :index="doc.title">
            <i class="el-icon-help"></i>
            <span slot="title">{{doc.title}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-drawer 
        :visible.sync="elDrawer"
        direction="ltr"
        title="高校列表"
        :show-close="false"
        :wrapperClosable="false"
        class="hidden-lg-and-up"
        id="drawer"
        size = "320px">
        <el-menu default-active="0" @select="handleSelect">
          <el-menu-item v-for="(doc,idx) in docs" :key="idx" :index="doc.title">
            <i class="el-icon-help"></i>
            <span slot="title">{{doc.title}}</span>
          </el-menu-item>
        </el-menu>
      </el-drawer>
      <el-main id="content">
        <div class="header">
          <h1>ISTIC科学评价之门-指南</h1>
          <p>科学评价之门ISEE-包含"中国高校专利产出矩阵"、"中国高校产学共创排行榜"、"中国高校论文产出矩阵"、"中国高校学科融合指数"、"中国高校论文国际合作地图"、"医疗机构医工结合排行榜"6个模块。</p>
        </div>
        <Doc class="doc"></Doc>
        <CopyRight></CopyRight>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import CopyRight from "@/components/CopyRight.vue";
import Doc from "../../public/docs/help.md";
import {Drawer} from "element-ui"
export default {
  name: "about",
  data() {
    return {
      elDrawer: false,
      unfold: true,
      docs: [
        {
          title: "中国高校产学共创排行榜"
        },
        {
          title: "中国高校学科融合指数"
        },
        {
          title: "中国高校论文产出矩阵"
        },
        {
          title: "中国高校专利产出矩阵"
        },
        {
          title: "中国高校论文国际合作地图"
        },
        {
          title: "医疗机构医工结合排行榜"
        }
      ]
    };
  },
  components: {
    Doc,
    CopyRight,
    'el-drawer':Drawer
  },
  mounted() {},
  methods: {
    selectUnfold() {
      this.elDrawer = !this.elDrawer;
      this.unfold = !this.unfold;
    },
    handleSelect(key) {
      document.getElementById(key).scrollIntoView();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/less/base.less");
.about {
  color: @font-color;
  .el-button {
    position: fixed;
    top: 60px;
    z-index: 3000;
    border-top-left-radius: 0rem;
    border-bottom-left-radius: 0rem;
    border-left-width: 0rem;
    &.fold {
      -webkit-animation: ltr-drawer-in 225ms cubic-bezier(0, 0, 1, 1) 0s;
      animation: ltr-drawer-in 225ms cubic-bezier(0, 0, 1, 1) 0s;
      left: 320px;
    }
    &.unfold {
      left: 0px;
    }
  }
  .el-container {
    margin: 0 auto;
    .el-aside {
      margin-top:1px;
      background: #fff;
      text-align: left;
      position: sticky;
      position: -webkit-sticky;
      top: 0px;
      height: 100vh;
      .el-menu {
        padding:40px 0;
      }
    }
    #content {
      text-align: justify;
      line-height: 2.5rem;
      width: cal(100vw - 240px);
      padding: 0 30px;
      background: #fff;
      .header {
        margin: 4rem 0;
        a {
          text-decoration: none;
        }
        h1 {
          font-size: 2rem;
          color: @brand-color;
          text-align: left;
        }
        p {
          line-height: 40px;
        }
        h2 {
          color: @brand-color;
        }
      }
      .doc {
        margin-top: 60px;
      }
     
    }
  }
}
</style>

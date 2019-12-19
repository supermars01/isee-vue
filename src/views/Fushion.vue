<template>
  <div class="module">
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
      <el-aside class="hidden-md-and-down">
        <el-autocomplete
          class="inline-input"
          placeholder="请输入名称"
          prefix-icon="el-icon-search"
          :fetch-suggestions="querySearch"
          v-model="name"
          @select="handleSelect"
        ></el-autocomplete>
        <el-table
          ref="listTable"
          :data="nameTagList"
          highlight-current-row
          height="calc(100vh - 60px)"
          @current-change="handleCurrentChange"
        >
          <el-table-column property="value" label="高校名称" align="center" sortable></el-table-column>
          <el-table-column
            prop="tag"
            label="类型"
            align="center"
            width="100"
            :filters="[{text:'国际',value:'国际'},{text:'国内',value:'国内'}]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.tag==='国际'?'primary':'success'"
                close-transition
              >{{scope.row.tag}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-drawer
        :visible.sync="elDrawer"
        direction="ltr"
        title="高校列表"
        :show-close="false"
        :wrapperClosable="false"
        class="hidden-lg-and-up"
        id="drawer"
        size = "320px"
      >
        <el-autocomplete
          class="inline-input"
          placeholder="请输入名称"
          prefix-icon="el-icon-search"
          :fetch-suggestions="querySearch"
          v-model="name"
          style="width:100%"
          @select="handleSelect"
        ></el-autocomplete>
        <el-table
          ref="listTable"
          :data="nameTagList"
          highlight-current-row
          height="calc(100vh - 45px)"
          @current-change="handleCurrentChange"
        >
          <el-table-column property="value" label="高校名称" align="center" sortable></el-table-column>
          <el-table-column
            prop="tag"
            label="类型"
            align="center"
            width="100"
            :filters="[{text:'国际',value:'国际'},{text:'国内',value:'国内'}]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.tag==='国际'?'danger':'success'"
              >{{scope.row.tag}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
      <el-container>
        <el-header height="auto">
          <el-row v-if="currentRow">
            <el-col :lg="6" :xs="24">
              <h2>{{currentData[0]}}</h2>
            </el-col>
            <el-col :lg="6" :xs="24">
              <span>
                学科融合指数
                <br />
                <strong>{{currentData[1]}}</strong>
              </span>
            </el-col>
            <el-col :lg="6" :xs="24">
              <span>
                跨学科论文（篇）
                <br />
                <strong>{{currentData[2]}}</strong>
              </span>
            </el-col>
            <el-col :lg="6" :xs="24">
              <span>
                跨学科论文占比（%）
                <br />
                <strong>{{currentData[3]}}</strong>
              </span>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <div id="canvas"></div>
        </el-main>
        <el-footer height="auto">
          <el-table ref="indexTable" :data="currentTableData" highlight-current-row>
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column property="indicatorName" label="指标" align="left"></el-table-column>
            <el-table-column property="indicatorvalue" label="数值" align="center"></el-table-column>
          </el-table>
        </el-footer>
        <CopyRight></CopyRight>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Table,TableColumn,Drawer,Tag} from "element-ui"
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/gauge";
import "echarts/lib/component/graphic";
import "echarts/lib/util/graphic";
import "echarts/lib/component/tooltip";
import CopyRight from "@/components/CopyRight.vue";
export default {
  data() {
    return {
      name: "",
      elDrawer: false,
      unfold: true,
      currentRow: null,
      currentData: []
    };
  },
  components: {
    CopyRight,
    "el-table":Table,
    "el-table-column":TableColumn,
    "el-drawer":Drawer,
    "el-tag":Tag
  },
  created() {
    this.$store.dispatch("initData", { name: "fushion" });
    //在页面加载时读取localStorage里的状态信息
    localStorage.getItem("dataset") &&
      this.$store.replaceState(
        Object.assign(
          this.$store.state,
          JSON.parse(localStorage.getItem("dataset"))
        )
      );
    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("dataset", JSON.stringify(this.$store.state));
    });
  },
  updated() {
    let id = this.currentRow ? this.currentRow.id : 0;
    this.$refs.listTable.setCurrentRow(this.nameTagList[id]);
  },
  methods: {
    selectUnfold() {
      this.elDrawer = !this.elDrawer;
      this.unfold = !this.unfold;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.currentData = this.dataList[this.currentRow.id];
      this.drawRadar();
    },
    handleSelect(val) {
      this.$refs.listTable.setCurrentRow(this.nameTagList[val.id]);
    },
    querySearch(queryString, cb) {
      var results = queryString
        ? this.nameTagList.filter(item => item.value.indexOf(queryString) === 0)
        : this.nameTagList;
      cb(results);
    },
    filterTag(val, row) {
      return row.tag === val;
    },
    drawRadar() {
      let chart = echarts.init(document.getElementById("canvas"));
      let axisLineColor = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: "#BAE7FF"
        },
        {
          offset: 0.2,
          color: "#91D5FF"
        },
        {
          offset: 0.4,
          color: "#69C0FF"
        },
        {
          offset: 0.8,
          color: "#40A9FF"
        },
        {
          offset: 1,
          color: "#1890FF"
        }
      ]);
      chart.setOption({
        tooltip: {},
        series: [
          {
            type: "gauge",
            detail: {
              formatter: "{value}",
              color: "#1890ff",
              fontSize: 40,
              fontWeight: "bold"
            },
            data: [
              {
                name: this.currentData[0] + "-学科融合指数",
                value: this.currentData[1]
              }
            ],
            max: Math.ceil(this.maxData[0] / 10000) * 10000,
            splitNumber: 5,
            axisLine: {
              show: true,
              lineStyle: {
                width: 20,
                color: [[1, axisLineColor]]
              }
            }
          }
        ]
      });
    }
  },
  computed: {
    ...mapGetters(["indicatorsList", "dataList", "nameList", "nameTagList"]),
    currentTableData() {
      let that = this;
      return this.currentData.map((d, index) => {
        return {
          indicatorName: that.indicatorsList[index],
          indicatorvalue: d
        };
      });
    },
    maxData() {
      let init = new Array(this.dataList[0].length - 1).fill(0);
      return this.dataList.reduce((accumulator, cur) => {
        let idata = cur.slice(1);
        return accumulator.map((d, index) =>
          d > +idata[index] ? d : +idata[index]
        );
      }, init);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/less/base.less");
.module {
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
    .el-aside {
      padding: 20px;
      background: #fff;
      position: sticky;
      position: -webkit-sticky;
      top: 0px;
      z-index: 10;
      height: 100vh;
      overflow: hidden !important;
      .el-autocomplete {
        background-color: #ebeef5;
        width: 100%;
      }
    }
  
    .el-container {
      margin: 0px 20px 0px 20px;
      .el-header {
        background-color: #fff;
        margin: 20px 0;
        .el-row {
          // padding: 10px 20px;
          .el-col {
            padding:1rem 0 ;
          }
        }
        h2 {
          color: @brand-color;
          font-weight: 600;
        }
        span {
          line-height: 2rem;
        }
        strong {
          font-size: 1.8rem;
          color: @brand-color;
        }
      }
      .el-main {
        margin-left: 0px;
        margin-top: 0px;
        width: 100%;
        #canvas {
          height: 800px;
          background-color: #fff;
        }
      }
      .el-footer {
        margin: 20px 0 0 0;
        padding: 0;
        background-color: #fff;
      }
    }
  }
}
</style>
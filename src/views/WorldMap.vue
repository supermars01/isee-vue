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
          :data="nameList"
          highlight-current-row
          height="calc(100vh - 60px)"
          @current-change="handleCurrentChange"
        >
          <el-table-column property="value" label="高校名称" align="center" sortable></el-table-column>
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
          :data="nameList"
          highlight-current-row
          height="calc(100vh - 45px)"
          @current-change="handleCurrentChange"
        >
          <el-table-column property="value" label="高校名称" align="center" sortable></el-table-column>
        </el-table>
      </el-drawer>
      <el-container>
        <el-header height="auto">
          <el-row v-if="currentRow">
            <el-col :lg="8" :xs="24">
              <h2>{{currentRow.value}}</h2>
            </el-col>
            <el-col :lg="8" :xs="24">
              <span>
                合作广度（国家数量）
                <br />
                <strong>{{currentData.slice(1).filter(d=>d!==0).length}}</strong>
              </span>
            </el-col>
            <el-col :lg="8" :xs="24">
              <span>
                合作深度（总次数）
                <br />
                <strong>{{totalCites}}</strong>
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
            <el-table-column property="indicatorName" label="国家" align="left" sortable></el-table-column>
            <el-table-column property="indicatorValue" label="合作次数" align="center" sortable></el-table-column>
          </el-table>
        </el-footer>
        <CopyRight></CopyRight>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Vue from "vue";
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/map";
import "echarts/lib/component/visualMapContinuous";
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
    CopyRight
  },
  created() {
    this.$store.dispatch("initData", { name: "worldMap" });
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
    let id = this.currentRow ? this.currentRow.id - 1 : 0;
    this.$refs.listTable.setCurrentRow(this.nameList[id]);
  },
  methods: {
    selectUnfold() {
      this.elDrawer = !this.elDrawer;
      this.unfold = !this.unfold;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.currentData = this.dataList[this.currentRow.id - 1].map(
        (d, index) => {
          return index !== 0 ? +d : d;
        }
      );
      this.drawRadar();
    },
    handleSelect(val) {
      this.$refs.listTable.setCurrentRow(this.nameList[val.id - 1]);
    },
    querySearch(queryString, cb) {
      var results = queryString
        ? this.nameList.filter(item => item.value.indexOf(queryString) === 0)
        : this.nameList;
      cb(results);
    },
    drawRadar() {
      let chart = echarts.init(document.getElementById("canvas"));
      chart.showLoading();
      Vue.axios.get(`../data/world-countries.json`).then(response => {
        chart.hideLoading();
        //过滤南极洲
        let features = response.data.features.filter(
          d => d.properties.name !== "Antarctica"
        );
        let worldGeo = { ...response.data, features };

        echarts.registerMap("WORLD", worldGeo);
        chart.setOption({
          tooltip: {},
          visualMap: {
            type: "continuous",
            min: 0,
            max: Math.max(...this.currentData.slice(1)),
            range: [1, Math.max(...this.currentData.slice(1))],
            text: ["High", "Low"],
            realtime: false,
            calculable: false,
            inRange: {
              color: ["#C0C4CC", "#F56C6C"]
            },
            left: 40
          },
          series: [
            {
              type: "map",
              mapType: "WORLD",
              itemStyle: {},
              emphasis: {
                label: {
                  show: false
                },
                itemStyle: {
                  color: "#1890FF",
                  areaColor: "#1890FF"
                }
              },
              data: this.currentData.slice(1).map((d, index) => {
                return {
                  name: this.indicatorsList[index + 1],
                  value: d
                };
              }),
              tooltip: {
                formatter: params => {
                  console.log(params);
                  return `${params.data.name}<br>合作次数${params.data.value}`;
                },
                backgroundColor: "rgba(255,255,255,0.8)",
                textStyle: {
                  color: "#606266",
                  fontWeight: "bold"
                },
                extraCssText: "box-shadow: 0px 0px 4px rgba(0,0,0,0.4)"
              }
            }
          ]
        });
      });
    }
  },
  computed: {
    ...mapGetters(["indicatorsList", "dataList", "nameList"]),
    currentTableData() {
      let that = this;
      return this.currentData
        .slice(1)
        .map((d, index) => {
          return {
            indicatorName: that.indicatorsList[index + 1],
            indicatorValue: d
          };
        })
        .filter(d => d.indicatorValue !== 0);
    },
    totalCites() {
      return this.currentData.slice(1).reduce((accumulator, cur) => {
        return (accumulator += cur);
      }, 0);
    },
    maxminData() {
      let init = new Array(this.dataList[0].length - 2).fill(0);
      let maxData = this.dataList.reduce((accumulator, cur) => {
        let idata = cur.slice(2);
        return accumulator.map((d, index) =>
          d > +idata[index] ? d : +idata[index]
        );
      }, init);

      let minData = this.dataList.reduce((accumulator, cur) => {
        let idata = cur.slice(2);
        return accumulator.map((d, index) =>
          d < +idata[index] ? d : +idata[index]
        );
      }, init);

      return {
        maxData,
        minData
      };
    }
  }
};
</script>

<style lang="less">
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
      z-index: 100;
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
          .el-col {
            padding: 1rem 0;
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
        margin-left: 0;
        margin-top: 0;
        width: 100%;
        background-color: #fff;
        #canvas {
          height: 80vh;
          background-color: #fff;
          padding: 20px 0;
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
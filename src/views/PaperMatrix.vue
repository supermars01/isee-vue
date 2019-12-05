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
            :filters="[{text:'国际院校',value:'国际院校'},{text:'世界一流',value:'世界一流'},{text:'中国领先',value:'中国领先'},{text:'区域核心',value:'区域核心'},{text:'学科特色',value:'学科特色'}]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag :type="getType(scope)" close-transition>{{scope.row.tag}}</el-tag>
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
            :filters="[{text:'国际院校',value:'国际院校'},{text:'世界一流',value:'世界一流'},{text:'中国领先',value:'中国领先'},{text:'区域核心',value:'区域核心'},{text:'学科特色',value:'学科特色'}]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag :type="getType(scope)" close-transition>{{scope.row.tag}}</el-tag>
            </template>
          </el-table-column>
          
        </el-table>
      </el-drawer>
      <el-container>
        <el-header height="auto">
          <el-row  v-if="currentRow">
            <el-col :lg="6" :xs="24">
              <h2>{{currentRow.value}}</h2>
            </el-col>
            <el-col :lg="3" :xs="24">
              <span>
                学科总数
                <br />
                <strong>{{currentData.length}}</strong>
              </span>
            </el-col>
            <el-col :lg="3" :xs="24">
              <span>
                优势学科
                <br />
                <strong>{{youshiData.length}}</strong>
              </span>
            </el-col>
            <el-col :lg="3" :xs="24">
              <span>
                潜力学科
                <br />
                <strong>{{qianliData.length}}</strong>
              </span>
            </el-col>
            <el-col :lg="3" :xs="24">
              <span>
                弱势学科
                <br />
                <strong>{{ruoshiData.length}}</strong>
              </span>
            </el-col>
            <el-col :lg="3" :xs="24">
              <span>
                传统学科
                <br />
                <strong>{{chuantongData.length}}</strong>
              </span>
            </el-col>
            <el-col :lg="3" :xs="24">
              <span>
                空白学科
                <br />
                <strong>{{176-currentData.length}}</strong>
              </span>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <div id="canvas"></div>
        </el-main>
        <el-footer height="auto">
          
          <el-table
            ref="indexTable"
            :data="currentTableData"
            highlight-current-row
           
          >
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column property="indicatorName" label="学科" align="left" width="100"></el-table-column>
            <el-table-column property="indicatorValue" label="类别" align="left"></el-table-column>
          </el-table>
        </el-footer>
         <CopyRight></CopyRight>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/scatter";
import "echarts/lib/coord/Axis";
import "echarts/lib/component/markLine";
import "echarts/lib/component/markArea";
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
  components:{
    CopyRight
  },
  created() {
    this.$store.dispatch("initData", { name: "paperMatrix" });
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
      this.currentData = this.dataList.filter(d => d[0] === val.value);
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
      chart.setOption({
        tooltip: {
          trigger: "item"
        },
        xAxis: {
          name:'2014-2018年学科产出论文占全球份额（%）',
          nameLocation:'middle',
          nameGap:50,
          gridIndex: 0,
          type: "value",
          min: 0,
          max: 2.5,
          axisLine: {
            onZero: false
            // show:false
          },
          splitLine: {
            show: false
          },
          interval: 0.5,
          boundaryGap:false
        },
        yAxis: {
          name:'2014-2018年相对2009-2014年学科论文被引频次增长率（%）',
          nameLocation:'middle',
          nameGap:50,
          type: "value",
          min: -2.5,
          max: 7.5,
          axisLine: {
            onZero: false
            // show:false
          },
          splitLine: {
            show: false
          },
          interval: 1,
          boundaryGap:false
        },
        series: [
          {
            type: "scatter",
            data: this.currentData.map(d => [d[2], d[3], d[0], d[1]]),
            // clip:false,
            itemStyle: {
              color: params => {
                let x = params.value[0];
                let y = params.value[1];
                if (x >= 0.5 && y >= 2.301) {
                  return "#67C23A";
                } else if (x >= 0.5 && y < 2.301) {
                  return "#E6A23C";
                } else if (x < 0.5 && y >= 2.301) {
                  return "#F56C6C";
                } else {
                  return "#909399";
                }
              }
            },
            markLine: {
              silent: true,
              lineStyle: {
                type: "solid",
                color: "#1890ff",
                width: 2
              },
              data: [{ yAxis: 2.301 }, { xAxis: 0.5 }]
            },
            markArea: {
              silent: true,
              label: {
                show: true,
                color: "rgba(0,0,0,0.3)",
                fontSize: 20,
                position: "inside"
              },
              data: [
                [
                  {
                    name: "优势学科",
                    xAxis: 0.5,
                    yAxis: 2.301
                  },
                  {
                    xAxis: 2.5,
                    yAxis: 7.5
                  }
                ],
                [
                  {
                    name: "潜力学科",
                    xAxis: 0.5,
                    yAxis: 2.301
                  },
                  {
                    xAxis: 0,
                    yAxis: 7.5
                  }
                ],
                [
                  {
                    name: "弱势学科",
                    xAxis: 0.5,
                    yAxis: 2.301
                  },
                  {
                    xAxis: 0,
                    yAxis: -2.5
                  }
                ],
                [
                  {
                    name: "传统学科",
                    xAxis: 0.5,
                    yAxis: 2.301
                  },
                  {
                    xAxis: 2.5,
                    yAxis: -2.5
                  }
                ]
              ]
            },
            tooltip: {
              formatter: params => {
                return params.value[3];
              },
              backgroundColor: "rgba(255,255,255,0.8)",
              textStyle: {
                color: "#606266",
                fontWeight: "bold"
              },
              // borderWidth:0.5,
              extraCssText: "box-shadow: 0px 0px 4px rgba(0,0,0,0.4)"
            }
          }
        ]
      });
    }
  },
  computed: {
    ...mapGetters(["indicatorsList", "dataList", "nameTagList"]),
    currentTableData() {
      return [
        {
          indicatorName:'优势学科',
          indicatorValue:this.youshiData.subject
        },
        {
          indicatorName:'潜力学科',
          indicatorValue:this.qianliData.subject
        },
        {
          indicatorName:'弱势学科',
          indicatorValue:this.ruoshiData.subject
        },
        {
          indicatorName:'传统学科',
          indicatorValue:this.chuantongData.subject
        }
      ]
    },
    maxData() {
      let init = new Array(this.dataList[0].length - 1).fill(0);
      return this.dataList.reduce((accumulator, cur) => {
        let idata = cur.slice(1);
        return accumulator.map((d, index) =>
          d > +idata[index] ? d : +idata[index]
        );
      }, init);
    },
    youshiData() {
      let filterArr = this.currentData.filter(d=>d[2]>=0.5 && d[3]>=2.301)
      return {
        length:filterArr.length,
        subject:filterArr.length===0?'无':filterArr.map(d=>d[1]).join(",")
      }
    },
    qianliData() {
      let filterArr =  this.currentData.filter(d=>d[2]<0.5 && d[3]>=2.301)
      return {
        length:filterArr.length,
        subject:filterArr.length===0?'无':filterArr.map(d=>d[1]).join(",")
      }
    },
    ruoshiData() {
      let filterArr =  this.currentData.filter(d=>d[2]<0.5 && d[3]<2.301)
      return {
        length:filterArr.length,
        subject:filterArr.length===0?'无':filterArr.map(d=>d[1]).join(",")
      }
    },
    chuantongData() {
      let filterArr =  this.currentData.filter(d=>d[2]>=0.5 && d[3]<2.301)
      return {
        length:filterArr.length,
        subject:filterArr.length===0?'无':filterArr.map(d=>d[1]).join(",")
      }
    },
    getType() {
      return scope => {
        switch (scope.row.tag) {
          case "国际院校":
            return "primary";
          case "世界一流":
            return "success";
          case "区域核心":
            return "warning";
          case "中国领先":
            return "danger";
          default:
            return "info";
        }
      };
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
        margin-left: 0;
        margin-top: 0;
        width: 100%;
        background-color: #fff;
        #canvas {
          height: 800px;
          background-color: #fff;
          padding:20px 0
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
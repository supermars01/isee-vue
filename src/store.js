import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

export default new Vuex.Store({
  state: {
    dataset: []
  },
  mutations: {
    initData(state, payload) {
      state.dataset = payload.db
    }
  },
  actions: {
    initData({
      commit
    },payload) {
      Vue.axios.get(`../data/${payload.name}.csv`).then(response => {
        commit('initData', {
          "db": response.data.split('\n')
        });
      })
    }

  },
  getters:{
    indicatorsList:state =>{
      return (state.dataset[0]||"").split(',')
    },
    dataList:state =>{
      return state.dataset.slice(1).map(data=>data.split(','))
    },
    nameList:(state,getters)=>{
      return [...new Set(getters.dataList.map(data=>data[0]))].map((d,index)=>{return{value:d,id:index+1}})
    },
    nameTagList:(state,getters)=>{
      return [...new Set(getters.dataList.map(d=>[].concat(d[0],d[d.length-1])).map(d=>d.join(",")))].map((d,index)=>{
        let darr = d.split(",") 
        return {
          value:darr[0],
          tag:darr[1],
          id:index
        }
      })
    }
  }
})

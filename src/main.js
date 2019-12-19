import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Dialog,Checkbox,Card,Button,Menu,Submenu,MenuItem,Autocomplete,Input,Icon,Row,Col,Container,Header,Aside,Main,Footer,Backtop,Image,Link } from 'element-ui'

Vue.config.productionTip = true

Vue.use(Dialog);
Vue.use(Checkbox);
Vue.use(Card);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Autocomplete);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Backtop);
Vue.use(Image);
Vue.use(Link);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Vuex from 'vuex';
import axios from "axios";
import OpenAuctions from "@/components/OpenAuctions";
import ClosedAuctions from "@/components/ClosedAuctions";

Vue.config.productionTip = false
Vue.use(Vuex);
Vue.use(VueRouter);

// TODO error handling
// TODO unit tests
// TODO initial load should have a loading icon

const routes = [
    {
        path: '/',
        name: 'OpenAuctions',
        component: OpenAuctions
    },
    {
        path: '/closed',
        name: 'ClosedAuctions',
        component: ClosedAuctions
    }
];

const router = new VueRouter({routes});

const store = new Vuex.Store({
  state: {
    products: [],
    categories: []
  },
  actions: {
    fetchProducts({commit}) {
      axios.get("http://localhost:8081/products")
          .then(res => commit('SET_PRODUCTS', res.data))
          .catch(error => alert("An error has occurred fetching products!\n" + error));
    },
    fetchNewProduct() {
      axios.get("http://localhost:8081/products")
          .then(res => {
            
            // Update products
            const existingProductIDs = this.state.products.map(product => product.productId);
            const newProducts = res.data;
            
            const difference = newProducts
                .filter(newProduct => existingProductIDs.indexOf(newProduct.productId) === -1);
            this.state.products.push(...difference);
            
            // Update categories
            const addedCategories = difference
                .map(p => p.productCategory)
                .filter((item, i, arr) => arr.indexOf(item) === i);
            
            for (let i = 0; i < addedCategories.length; i++) {
              const cat = addedCategories[i];
              if (this.state.categories.indexOf(cat) === -1) {
                this.state.categories.push(cat);
              }
            }
  
          })
          .catch(error => alert("An error has occurred fetching products!\n" + error));
    }
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
      state.categories = products
          .map(product => product.productCategory) // get categories
          .filter((item, i, arr) => arr.indexOf(item) === i); // extract uniques
    }
  },
  getters: {
    getProducts: state => state.products,
    getCategories: state => state.categories
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

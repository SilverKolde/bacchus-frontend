<template>
  <div>

    <!--    Category Selection        -->

    <v-main>
      <div class="d-flex justify-center mx-5">
        <v-btn class="mt-3 mr-3" @click="unSelect">Show all</v-btn>
        <div v-for="(category, idx) in categories" :key="idx">
          <v-checkbox :label="category"
                      :value="category"
                      v-model="selected"/>
        </div>
      </div>
      <hr>

      <!--      Products display        -->

      <v-layout row wrap>
        <v-flex v-for="(product, index) in products"
                :key="index"
                xs12 sm6 md4 lg3
                class="my-5">
          <Product
              @destroyMe="deleteProduct(index)"
              :product="product" />
        </v-flex>
      </v-layout>
    </v-main>
  </div>
</template>

<script>
import Product from './Product';

export default {
  name: "OpenAuctions",

  components: {
    Product
  },

  mounted() {
    this.$store.dispatch('fetchProducts')
  },

  computed: {
    products: function () {
      const allProducts = this.$store.getters.getProducts;
      return allProducts
          .filter(p => {
            const nothingIsSelected = this.selected.length === 0;
            const categoryIsSelected = this.selected.indexOf(p.productCategory) >= 0;
            return nothingIsSelected || categoryIsSelected;
          });
    },
    categories: function () {
      return this.$store.getters.getCategories
    }
  },

  data: () => ({
    selected: []
  }),

  methods: {
    deleteProduct(index) {
      const removedCategory = this.products[index].productCategory;
      //remove product
      this.$store.state.products.splice(index, 1);
      //remove category, if needed
      const remainingCategories = this.products
          .map(p => p.productCategory)
          .filter((item, i, arr) => arr.indexOf(item) === i);
      if (remainingCategories.indexOf(removedCategory) === -1) {
        const idx = this.categories.indexOf(removedCategory);
        this.$store.state.categories.splice(idx, 1);
      }
      // fetch new item
      this.$store.dispatch("fetchNewProduct");
    },
    unSelect() {
      this.selected = [];
    }
  }
}
</script>

<style scoped>

</style>
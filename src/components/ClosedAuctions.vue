<template>
  <div class="mt-16">
    <v-expansion-panels>
      <v-expansion-panel
          v-for="(productId, idx) in uniqueIDs"
          :key="idx"
      >
        <v-expansion-panel-header>
          Product id: {{ productId }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <hr class="mb-3">
          Total offers made for this product: {{ quantities[idx] }}
          <br>
          Bidders:
          <v-card
              class="mt-3"
              max-width="400"
              tile
          >
            <v-list-item
                v-for="(bidder, i) in getBidders(productId)"
                :key="i"
            >
              <v-list-item-content>
                <div class="d-flex justify-space-between">
                  <v-list-item-title>
                    {{ bidder.bidderFullName }}
                  </v-list-item-title>
                  <h4 v-if="bidder.winner" class="success--text">Winner!</h4>
                </div>
                <v-list-item-subtitle class="my-3">
                  {{ bidder.bidTime | formatDate(bidder.bidTime) }}
                </v-list-item-subtitle>
                <p class="font-weight-bold ">
                  Offer: {{ bidder.offer }}
                </p>
                <hr class="mt-1">

              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "ClosedAuctions",

  mounted() {
    this.fetchBids();
  },

  data: () => {
    return {
      bids: [],
      uniqueIDs: [],
      quantities: [],
      winner: false
    }
  },

  methods: {
    fetchBids() {
      axios.get("http://localhost:8081/bids")
          .then(res => {
            this.bids = res.data;
            this.mapBidsPerProduct();
          })
          .catch(error => {
            alert("Could not fetch ended auctions\n" + error);
            console.log(error);
          });
    },
    mapBidsPerProduct() {
      this.bids.forEach(bid => {
        const prodictId = bid.productId;
        const idx = this.uniqueIDs.indexOf(prodictId);

        if (idx === -1) {
          this.uniqueIDs.push(prodictId);
          this.quantities.push(1);
        } else {
          this.quantities[idx]++;
        }
      });
    },
    getBidders(productId) {
      const bidders = this.bids.filter(bid => bid.productId === productId);
      const winner = bidders.reduce((prev, curr) => prev.offer > curr.offer ? prev : curr);
      const winnerIdx = bidders.indexOf(winner);
      bidders[winnerIdx].winner = true;
      return bidders;
    }
  },

  filters: {
    formatDate: value => moment(value).format('MMMM Do YYYY, H:mm:ss')
  },

}
</script>

<style scoped>
</style>
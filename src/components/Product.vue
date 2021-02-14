<template>
  <v-card
      class="mx-auto"
      max-width="344"
  >

<!--    Shown initially (product info display)   -->

    <v-card-text>
      <p class="display-1 text--primary">
        {{ product.productName }}
      </p>
      <p>{{ product.productCategory }}</p>
      <div class="text--primary">
        {{ product.productDescription }}
      </div>
      <div>
        <br>Auction ends:<br>
        <span class="font-weight-bold">
          {{ product.biddingEndDate | formatDate(product.biddingEndDate) }}
        </span>
        <br>
        Time remaining: {{ displayDays }} : {{ displayHours }} : {{ displayMinutes }} : {{ displaySeconds }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn text
          color="primary accent-4"
          @click="reveal = true"
      >
        Make an offer
      </v-btn>
    </v-card-actions>

<!--    Shown when making an offer  -->

    <v-expand-transition>
      <v-card
          v-if="reveal"
          class="transition-fast-in-fast-out v-card--reveal"
          style="height: 100%;"
      >
        <v-card-text class="pb-0">
          <p>
            Time remaining: {{ displayDays }} : {{ displayHours }} : {{ displayMinutes }} : {{ displaySeconds }}
          </p>
          <h2 v-if="biddingForbidden"
              class="font-weight-medium red--text mb-3">
            Auction has ended!
          </h2>
          <div v-if="!biddingForbidden">
            <h3 class="font-weight-medium text--primary mb-2">
              Your full name:
            </h3>
            <v-form ref="form">
              <v-text-field
                  label="Full name"
                  v-model="fullName"
                  :rules="nameRules"
                  counter="100"
                  outlined
                  dense
              ></v-text-field>
              <h3 class="font-weight-medium text--primary mb-1">
                Your offer:
              </h3>
              <v-text-field
                  label="Offer"
                  v-model="offer"
                  :rules="offerRules"
                  outlined
                  dense
              ></v-text-field>
            </v-form>
          </div>

        </v-card-text>
        <v-card-actions class="pt-0">
          <div v-if="!biddingForbidden">
            <v-btn
                text
                color="primary accent-4"
                @click="submitOffer"
            >
              Submit offer
            </v-btn>
            <v-spacer></v-spacer>
          </div>
          <v-btn
              text
              color="primary accent-4"
              @click="closeBiddingView"
          >
            <span v-if="!biddingForbidden">Cancel</span>
            <span v-else>Close item</span>
          </v-btn>
        </v-card-actions>

<!--        Shown when submit was successful  -->

        <v-row justify="center">
          <v-overlay
              :absolute="absolute"
              :value="overlay"
          >
            <p class="white pa-3 rounded-lg">
              <span class="font-weight-medium success--text">
                Offer was submitted successfully!
              </span>
            </p>
          </v-overlay>

        </v-row>
      </v-card>
    </v-expand-transition>
  </v-card>
</template>

<script>

import moment from 'moment'
import axios from "axios";

export default {
  name: "Product",

  props: ['product'],

  mounted() {
    this.restoreInitialState();
  },

  data: () => ({
    reveal: false,
    displayDays: 0,
    displayHours: 0,
    displayMinutes: 0,
    displaySeconds: 0,
    biddingForbidden: false,
    fullName: '',
    offer: '',
    nameRules: [name => name.length >= 3 || 'Minimum length is 3 characters'],
    offerRules: [
        offer => (offer.length >= 1 && !isNaN(offer) && offer > 0)
        || 'Please enter a positive number'
    ],
    absolute: true,
    overlay: false
  }),

  computed: {
    _seconds: () => 1000,
    _minutes() {
      return this._seconds * 60;
    },
    _hours() {
      return this._minutes * 60;
    },
    _days() {
      return this._hours * 24;
    }
  },

  methods: {
    submitOffer() {
      if (this.$refs.form.validate()) {

        const bid = {
          productId: this.product.productId,
          bidderFullName: this.fullName,
          bidTime: new Date(),
          offer: this.offer
        }

        axios.post('http://localhost:8081/bids', bid)
            .then( this.bidSuccessful() )
            .catch(error => alert("Something went wrong, bid was not saved.\n" + error))

      } else {
        alert("Please enter correct inputs")
      }
    },

    bidSuccessful() {
      this.overlay = true;
      setTimeout(() => {
        this.reveal = false;
        this.overlay = false;
        this.clearTextfields();
      }, 2000);
    },

    clearTextfields() {
      this.fullName = '';
      this.offer = '';
    },

    restoreInitialState() {
      this.biddingForbidden = false;
      this.showRemaining();
    },

    closeBiddingView() {
      this.reveal = false;
      if (this.biddingForbidden) {
        this.$emit("destroyMe", this.product.productId);
        this.restoreInitialState();
      } else {
        this.clearTextfields();
      }
    },

    formatNum: num => num < 10 ? "0" + num : num,

    showRemaining() {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = Date.parse(this.product.biddingEndDate);
        const distance = end - now;

        if (distance < 0) {

          if (this.reveal) {
            clearInterval(timer);
            this.biddingForbidden = true;
            return;
          } else {
            this.$emit("destroyMe", this.product.productId);
            return;
          }

        }
        const days = Math.floor(distance / this._days);
        const hours = Math.floor((distance % this._days) / this._hours);
        const minutes = Math.floor((distance % this._hours) / this._minutes);
        const seconds = Math.floor((distance % this._minutes) / this._seconds);
        this.displayMinutes = this.formatNum(minutes);
        this.displaySeconds = this.formatNum(seconds);
        this.displayHours = this.formatNum(hours);
        this.displayDays = this.formatNum(days);
      }, 1000);
    }
  },

  filters: {
    formatDate: value => moment(value).format('MMMM Do YYYY, H:mm:ss')
  },

}
</script>

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
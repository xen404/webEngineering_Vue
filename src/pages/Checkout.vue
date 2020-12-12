<template>
  <main>
    <div v-if="processingFailure" class="error-message">An error occurred during payment. Please try again.</div>

    <form class="checkout-form" id="checkout-form" v-on:submit.prevent="submitForm" v-if="!processing&&!processingSuccess">
      <fieldset>
        <legend>Contact information</legend>
        <div class="grid">
          <label for="email">Email</label>
          <input v-model="customer.email" type="email" name="email" id="email" required/>
        </div>
      </fieldset>

      <fieldset>
        <legend>Shipping address</legend>
        <div class="grid">
          <label for="name">Name</label>
          <input v-model="customer.shipping_address.name" type="text" name="name" id="name" required/>

          <label for="address">Address</label>
          <input v-model="customer.shipping_address.address" type="text" name="address" id="address" required/>

          <label for="city">City</label>
          <input v-model="customer.shipping_address.city" type="text" name="city" id="city" required/>

          <label for="country">Country</label>
          <select name="country" id="country" v-model="customer.shipping_address.country" @change="onCountryChange()">
            <!-- TODO: render and bind destination options here -->
            <option v-for="destination in destinations" :key="destination.country" :value="destination.country">{{destination.displayName}}</option>
          </select>

          <label for="postalcode">Postal code</label>
          <input v-model="customer.shipping_address.postal_code" type="text" name="postalcode" id="postalcode" required/>

          <label for="phone">Phone (optional)</label>
          <input v-model="customer.shipping_address.phone" type="tel" name="phone" id="phone" />
        </div>
      </fieldset>

      <fieldset>
        <legend>Card details</legend>
        <div class="grid">
          <label for="cardholder">Name on card</label>
          <input v-model="card.cardholder" type="text" name="cardholder" id="cardholder" required />

          <label for="cardnumber">Card number</label>
          <input v-model="card.number" type="text" name="cardnumber" id="cardnumber" required />

          <label for="cardexpiry">Expiration</label>
          <input
            v-model="expData"
            @change="onExpChange()"
            type="text"
            name="cardexpiry"
            id="cardexpiry"
            pattern="\d{2}/\d{4}"
            placeholder="MM/YYYY"
            required
          />

          <label for="cardcvc">CVC</label>
          <input
            v-model="card.cvc"
            name="cardcvc"
            id="cardcvc"
            type="text"
            pattern="\d{3}"
            required
          />
        </div>
      </fieldset>

      <div>
        <div>
          Subtotal: €
          <span id="price-subtotal">{{subtotalPrice.toFixed(2)}}</span>
        </div>
        <div>
          Shipping Costs: €
          <span id="price-shipping">{{shippingCost.toFixed(2)}}</span>
        </div>
      </div>

      <div>
        <div class="price">
          Total: €
          <span id="price-total">{{totalPrice.toFixed(2)}}</span>
        </div>
      </div>

      <div class="button-row">
        <router-link to="/cart">&larr; Back to Cart</router-link>
        <button type="submit" id="pay-button">Pay</button>
      </div>
    </form>

    <h2 v-if="processing">Processing payment...</h2>
    <img v-if="processing" src="@/assets/images/spinner.gif" width="50" height="50" />

    <div v-if="processingSuccess">Your payment was completed successfully.</div>
    <h2 v-if="processingSuccess">Thank you for your purchase!</h2>
    <div v-if="processingSuccess">
      <router-link to="/search">&larr; Back to Search</router-link>
    </div>
  </main>
</template>

<script>
import * as ArtmartService from "@/services/ArtmartService";
import * as BlingService from "@/services/BlingService";

export default {
  name: "Checkout",
  data() {
    return {
      destinations: this.$store.getters.sortedDestinations,
      subtotalPrice: Number,
      country: String,
      shippingCost: 0,
      processing: false,
      processingSuccess: false,
      processingFailure: false,
      expData: '',
      customer: {
        email: '',
        shipping_address: {
          name: '',
          address: '',
          city: '',
          country: '',
          postal_code: '',
          phone: ''
        }
      },
      card: {
          cardholder: '',
          number: '',
          exp_month: '',
          exp_year: '',
          cvc: ''
        }
    }
  },
  created() {
    this.subtotalPrice = (this.$store.getters.cartTotal/100)
  },
  mounted() {
    if (this.$store.getters.cartIsEmpty) {
      this.$router.push('cart')
    }
  },
  methods: {
    onCountryChange() {
      let dest = this.destinations.filter(obj => {
        return obj.country===this.customer.shipping_address.country
      })
      this.shippingCost = dest[0].cost/100
    },
    onExpChange() {
      let exp = this.expData.split('/')
      this.card.exp_month = exp[0]
      this.card.exp_year = exp[1]
    },
    submitForm: async function() {
      this.processing=true
      let artmartResp = await ArtmartService.checkout(this.customer)
      let blingResp = await BlingService.confirmPaymentIntent(artmartResp.payment_intent_id, artmartResp.client_secret, this.card)
      console.log(blingResp)
      if (blingResp.status===200) {
        this.processingSuccess = true;
        this.processingFailure = false;
        this.processing = false;
      } else {
        this.processingFailure = true;
        this.processing = false;
      } 
    }
  },
  computed: {
    totalPrice: function() {
      return this.subtotalPrice+this.shippingCost;
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
}

.checkout-form > div {
  margin: 1rem 0;
  text-align: right;
}

/* this is a workaround for a Chrome bug that disallows display:grid on fieldset elements */
.checkout-form div.grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-gap: 0.5em 1em;
  align-items: center;
}

.checkout-form fieldset {
  border: none;
  margin: 2rem 0;
  padding: 0;
}

.checkout-form fieldset legend {
  font-weight: bold;
  font-size: 1.5em;
  margin-bottom: 0.5rem;
}

.checkout-form input {
  -moz-appearance: textfield;
  font-family: inherit;
  font-size: 1em;
  height: 1.25rem;
  line-height: 1.25rem;
  padding: 3px;
  text-indent: 1.25px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.button-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: bold;
  font-size: 1.5rem;
}

@media (max-width: 600px) {
  .checkout-form {
    width: 100%;
  }
  .checkout-form div.grid {
    grid-template-columns: 1fr;
  }

  .button-row {
    flex-direction: column-reverse;
    align-items: flex-start;
  }

  .button-row button {
    width: 100%;
    margin-bottom: 1em;
  }
}
</style>
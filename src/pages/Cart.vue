<template>
  <main>
    <section class="cart">
      <template v-if="this.$store.getters.cartIsEmpty">
        <span>
          There are no items in your shopping cart.
        </span>
      </template>
      <template v-else>
        <cart-item v-for="cartItem in this.$store.state.cart" :key="cartItem.cartItemId"
                   v-bind:cartItem="cartItem"></cart-item>
        <div class="cart-total">
          <div class="price">
            Total: €
            <span id="price-total">{{(this.$store.getters.cartTotal / 100).toFixed(2)}}</span>
          </div>
          <router-link to="/checkout">
            <button>
              Checkout
            </button>
          </router-link>
        </div>
      </template>
    </section>
  </main>
</template>

<script>
import CartItem from "../components/CartItem";
export default {
  name: "Cart",
  data() {
    return {
      message: "",
      price: this.$store.getters.cartTotal/100
    }
  },
  created: function() {
      this.setMessage();
  },
  methods: {
    setMessage: function() {
      if(this.$store.getters.cartIsEmpty)
      {
        this.message='There are no items in your shopping cart.';
      }
    }
  },
  components: {
    CartItem
  }
};
</script>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.cart-total {
  margin-right: 1rem;
  align-self: flex-end;

  display: flex;
  flex-direction: column;
}

.cart-total .price {
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: right;
}

@media (max-width: 600px) {
  .cart-total {
    margin: 0;
    align-self: stretch;
  }

  .cart-total .price {
    text-align: center;
  }
}
</style>

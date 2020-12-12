<template>
    <div class="cart-item" v-if="artwork">

        <router-link :to="configRoute">
            <div class="cart-preview">
                <framed-artwork v-bind:artwork="artwork" v-bind:config="cartItem"/>
                <!-- TODO: establish proper bindinds -->
            </div>
        </router-link>

        <!-- TODO: slot this into a museum label -->
        <MuseumLabel :artwork="artwork">
            <div class="cart-frame-description"> {{loadFrameDetails(this.cartItem)}}</div>
            <div class="cart-price">€ {{ (this.cartItem.price / 100).toFixed(2) }}</div>
            <button class="cart-remove" @click="removeItem"></button>
        </MuseumLabel>
    </div>
</template>

<script>
    import FramedArtwork from "./FramedArtwork";
    import MuseumLabel from "./MuseumLabel";
    import {getArtwork} from "../services/ArtmartService";

    export default {
        name: "CartItem",
        components: {
            MuseumLabel,
            FramedArtwork
        },
        props: {
            cartItem: {
                artworkId: Number,
                price: Number,
                printSize: String,
                frameWidth: Number,
                frameStyle: String,
                matWidth: Number,
                matColor: String,
                cartItemId: Number
            }
        },

        data() {
            return {
                artwork: null
            };
        },

        methods: {
            loadFrameDetails(cartItem) {
                var matWidth = cartItem / 10;
                var artworkSizesArr = {"S": "Small", "M": "Medium", "L": "Large"};
                var details = `${artworkSizesArr[cartItem.printSize]} print in a ${cartItem.frameWidth / 10} cm ${cartItem.frameStyle} frame`
                if (matWidth !== 0) {
                    return details + ` with a ${matWidth} cm ${cartItem.matColor} mat`;
                } else {
                    return `${details}`;
                }
            },

            removeItem() {
                this.$store.dispatch('removeFromCart', this.cartItem.cartItemId);
            }
        },

        created() {
            Promise.resolve(getArtwork(this.cartItem.artworkId)).then(a => this.artwork = a);
        },
        computed: {
            configRoute() {
                return {
                    path: "/config/" + this.cartItem.artworkId,
                    query: {
                        printSize: this.cartItem.printSize,
                        frameWidth: this.cartItem.frameWidth,
                        frameStyle: this.cartItem.frameStyle,
                        matWidth: this.cartItem.matWidth,
                        matColor: this.cartItem.matColor
                    }
                };
            }
        }
    };
</script>

<style scoped>
    .cart {
        display: flex;
        flex-direction: column;
        margin-bottom: 2rem;
    }

    .cart-item {
        margin: 1rem;
        margin-bottom: 2rem;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .cart-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 250px;
        height: 250px;
        justify-content: center;
        flex-shrink: 0;
    }

    .cart-preview img {
        box-shadow: 0 7px 15px 0 rgba(0, 0, 0, 0.5);
    }

    .cart-item .museum-label {
        font-size: 1rem;
        margin-left: 2rem;
        padding: 1em;
        position: relative;
        flex-grow: 1;
        max-width: 500px;
    }

    .cart-frame-description {
        margin-top: 1em;
    }

    .cart-price {
        font-weight: bold;
        text-align: right;
        margin-top: 1rem;
    }

    .cart-remove {
        width: 1.5em;
        height: 1.5em;
        padding: 0;
        margin: 0;
        border-radius: 50%;

        position: absolute;
        top: -0.75em;
        right: -0.75em;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cart-remove::before {
        content: "✕";
        font-family: sans-serif;
    }

    @media (max-width: 600px) {
        .cart-item {
            flex-direction: column;
        }

        .cart-item .museum-label {
            margin: 0;
            margin-top: 1rem;
        }
    }
</style>

<template>
  <ion-item
  button
  :detail="false"
  :routerLink="'/tabs/coin/' + coin.id"
  >
    <ion-avatar slot="start">
      <ion-img :src="coin.image" :alt="coin.name"></ion-img>
    </ion-avatar>
    <ion-label>
      <h2 class="bold">
        <ion-text>
        {{ coin.name }}
        </ion-text>
      </h2>
      <p class="bold">
      € {{ coin.current_price }}
      </p>
    </ion-label>
    <div slot="end">
      <div class="box-percentage-red" v-if="checkPercentage(coin?.price_change_percentage_24h)">{{ formatPercentage(coin?.price_change_percentage_24h) }}%</div>
			<div class="box-percentage-green" v-else>+{{ formatPercentage(coin?.price_change_percentage_24h) }}%</div>
    </div>
  </ion-item>
</template>

<script lang="ts">
  import { IonImg, IonAvatar, IonItem, IonText, IonLabel } from "@ionic/vue";
  import { CoinModel } from "@/models/CoinModel";
  import { PropType } from "vue";

  export default {
    name: "CoinItem",
    components: {
      IonImg,
      IonAvatar,
      IonItem,
      IonText,
      IonLabel,
    },
    methods: {
      checkPercentage(percentage: any) {
        let p = ((percentage < 0) ? true : false);
        return p
      },
      formatPercentage(percentage: any){
       const p = percentage.toFixed(2)
       return p
      }
    },
    props: {
      coin: {
        type: Object as PropType<CoinModel>,
        required: true,
      },
    },
    setup() {
      return {};
    },
  };
</script>
  
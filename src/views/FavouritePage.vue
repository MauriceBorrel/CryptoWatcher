<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Favourites</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher ref="ionRefresher" slot="fixed" @ionRefresh="onReload()">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <EmptyView
        v-if="viewState === ViewState.EMPTY"
        title="No coins found"
        :icon="alertCircleOutline"
      ></EmptyView>
      <EmptyView
        v-if="viewState === ViewState.ERROR"
        title="Network error"
        :icon="alertCircleOutline"
      ></EmptyView>

      <ion-list>
        <CoinItem v-for="coin in coins" :coin="coin" :key="coin.id"></CoinItem>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage, 
  IonHeader, 
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonList,
  IonContent, 
  onIonViewDidEnter, 
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import CoinItem from '@/components/CoinItem.vue';
import EmptyView from "@/components/EmptyView.vue";
import CoinService from "@/services/CoinService";
import { CoinModel } from "@/models/CoinModel";
import { ViewState } from "@/enums/ViewState";
import { notificationsOutline, alertCircleOutline } from "ionicons/icons";

  export default defineComponent({
    name: 'FavouritePage',
    setup() {
      const ionRefresher = ref();

      // set viewstate enums and coin model
      const viewState = ref<ViewState>(ViewState.INITIAL);
      const coins = ref<CoinModel[]>([]);

      const onRefreshComplete = () => {
        ionRefresher.value.$el.complete();
      };

      const loadCoins = async () => {
        viewState.value = ViewState.LOADING;

        try {
          // parse and get localstorage key
          const id = JSON.parse(localStorage.getItem("coins") || '[]');

          // make API call and attach data to coin model value
          const data = await CoinService.loadFavouriteCoins(id);
          coins.value = data.data;

          // if array has data, show content, else notify user no data has been found
          if (id.length) {
            viewState.value = ViewState.CONTENT;
          } else {
            viewState.value = ViewState.EMPTY;
          }  
          
        } catch {
          viewState.value = ViewState.ERROR;
        } finally {
          onRefreshComplete();
        }
      };

      // refresh coin data
      const onReload = () => {
        loadCoins();
      };

      // load coins on entering the page
      onIonViewDidEnter(() => {
        if (viewState.value !== ViewState.CONTENT) {
          loadCoins();
        }
      });

      return {
        viewState,
        ViewState,
        onReload,
        coins,
        ionRefresher,
        notificationsOutline,
        alertCircleOutline,
      };
    },
    components: { 
      IonHeader, 
      IonToolbar,
      IonRefresher,
      IonRefresherContent,
      IonTitle, 
      IonContent, 
      IonPage,
      IonList,
      EmptyView,
      CoinItem
    }
  });
</script>

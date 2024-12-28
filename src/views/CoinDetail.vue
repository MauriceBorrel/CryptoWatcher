<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>{{coin?.name}}</ion-title>
				<ion-buttons slot="start">
					<ion-back-button href="/tabs/coins"></ion-back-button>
				</ion-buttons>
				<ion-buttons slot="primary">
					<ion-button @click="showActionSheet()">
						<ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<ion-refresher ref="ionRefresher" slot="fixed" @ionRefresh="onReload()">
				<ion-refresher-content></ion-refresher-content>
			</ion-refresher>

			<div class="container" v-if="viewState === ViewState.LOADING">
				<ion-spinner></ion-spinner>
			</div>

			<EmptyView
				v-if="viewState === ViewState.EMPTY"
				title="Coin not found"
				:icon="alertCircleOutline"
			></EmptyView>
			<EmptyView
				v-if="viewState === ViewState.ERROR"
				title="Network error"
				:icon="alertCircleOutline"
			></EmptyView>

			<ion-grid v-if="viewState === ViewState.CONTENT">
				<ion-card>
					<ion-card-header>
						<ion-row>
							<ion-col>
								<div class="flex-between">
									<div class="flex">
										<ion-img class="cardimage2" :src="coin?.image"></ion-img>
										<ion-card-title class="coin-title">{{ coin?.name }}</ion-card-title>
									</div>
								</div>

								<div class="flex-between">
									<h1 class="title">€ {{ coin?.current_price }}</h1>
									<p class="box-percentage-red" v-if="checkPercentage(coin?.price_change_percentage_24h)">{{ formatPercentage(coin?.price_change_percentage_24h) }}%</p>
									<p class="box-percentage-green" v-else>+{{ formatPercentage(coin?.price_change_percentage_24h) }}%</p>
								</div>

								<ion-list>
									<ion-item v-if="coin?.market_cap">
										<p>Market Cap</p>
										<p slot="end">€ {{ coin?.market_cap }}</p>
									</ion-item>
									<ion-item v-if="coin?.fully_diluted_valuation">
										<p>Fully diluted valuation</p>
										<p slot="end">€ {{ coin?.fully_diluted_valuation }}</p>
									</ion-item>
									<ion-item v-if="coin?.circulating_supply">
										<p>Circulating supply</p>
										<p slot="end">{{ coin?.circulating_supply }}</p>
									</ion-item>
									<ion-item v-if="coin?.total_supply">
										<p>Total supply</p>
										<p slot="end">{{ coin?.total_supply }}</p>
									</ion-item>
									<ion-item v-if="coin?.max_supply">
										<p>Max supply</p>
										<p slot="end">{{ coin?.max_supply }}</p>
									</ion-item>
								</ion-list>
							</ion-col>
						</ion-row>
					</ion-card-header>
				</ion-card>

				<ion-card>
					<ion-card-header>
						<PriceChart/>
					</ion-card-header>
				</ion-card>

				<ion-card>
					<ion-card-header>
						<ion-card-title class="price-stats">{{ coin?.symbol.toUpperCase() }} Price Stats</ion-card-title>
						<ion-list>
							<ion-item>
								<p>{{ coin?.name }} Price</p>
								<p slot="end">€ {{ coin?.current_price }}</p>
							</ion-item>
							<ion-item>
								<p>24 Low/24 High</p>
								<div slot="end">
									<p>€ {{ coin?.low_24h }}</p>
									<p>€ {{ coin?.high_24h }}</p>
								</div>
							</ion-item>
							<ion-item>
								<p>All-Time High</p>
								<div slot="end">
									<p>€ {{ coin?.ath }}</p>
									<p class="box-percentage-red" v-if="checkPercentage(coin?.ath_change_percentage)">{{ formatPercentage(coin?.ath_change_percentage) }}%</p>
									<p class="box-percentage-green" v-else>+{{ formatPercentage(coin?.ath_change_percentage) }}%</p>
								</div>
							</ion-item>
							<ion-item>
								<p>All-Time Low</p>
								<div slot="end">
									<p>€ {{ coin['atl']}}</p>
									<p class="box-percentage-red" v-if="checkPercentage(coin?.atl_change_percentage)">{{ formatPercentage(coin?.atl_change_percentage) }}%</p>
									<p class="box-percentage-green" v-else>+{{ formatPercentage(coin?.atl_change_percentage) }}%</p>
								</div>
							</ion-item>
						</ion-list> 
					</ion-card-header>
				</ion-card>
			</ion-grid>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonButtons,
	IonButton,
	IonBackButton,
	IonContent,
	toastController,
	IonPage,
	IonRefresher,
	IonRefresherContent,
	IonSpinner,
	IonIcon,
	IonRow,
	IonCol,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonImg,
	IonList,
	IonItem,
	IonGrid,
	actionSheetController,
	onIonViewDidEnter,
} from '@ionic/vue';

import { 
	chevronBack, 
	alertCircleOutline,  
	checkmark, 
	trashBin,
	ellipsisHorizontal,
  ellipsisVertical,
} from "ionicons/icons";

import { ref} from "vue";
import EmptyView from "@/components/EmptyView.vue";
import { ViewState } from "@/enums/ViewState";
import { CoinModel } from "@/models/CoinModel";
import CoinService from "@/services/CoinService";
import PriceChart from "@/components/PriceChart.vue";
import { useRoute } from "vue-router";

export default {
	name: 'CoinDetail',
	setup() {
		const ionRefresher = ref();

		// set viewstate enums, coin model and current route
		const viewState = ref<ViewState>(ViewState.INITIAL);
		const coin = ref<CoinModel[]>([]);
		const route = useRoute();

		// get current coin id
		const id = route.params.id as string;

		const onRefreshComplete = () => {
			ionRefresher.value.$el.complete();
		};

		// show action sheet
		const showActionSheet = async () => {
      const actionSheet = await actionSheetController
        .create({
          cssClass: 'my-custom-class',
          buttons: [
            {
              text: checkFavouriteCoin() ? 'Remove Favourite' : 'Favourite',
              handler: () => {
                favouriteCoin();
								presentToast('top', checkFavouriteCoin());
              },
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked')
              },
            },
          ],
        });

			// show the action sheet after it has been created
			await actionSheet.present();

			// close the action sheet
			await actionSheet.onDidDismiss();
		}

		const loadCoin = async () => {
			viewState.value = ViewState.LOADING;

			try {
				// make API call and attach data to coin model value
				const data = await CoinService.loadOne(id);
				coin.value = data.data[0];

				// if array has data, show content and build chart, else notify user no data has been found
				if (coin.value !== null) {
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
			loadCoin();
		};

		const favouriteCoin = () => {
				// get items from localStorage, or declare new one if data doesn't exist
				let coins: any = localStorage.getItem("coins") || '[]';
				coins = JSON.parse(coins);

				if(!coins.includes(id)){
					// push id to array and add it to localStorage
					coins.push(id);
					localStorage.setItem('coins', JSON.stringify(coins));

				} else {
					// get index of current coin and remove coin from the array
					const index = coins.indexOf(id)
					coins.splice(index, 1);

					// add updated array to localStorage
					localStorage.setItem('coins', JSON.stringify(coins));

				}
		};

		const checkFavouriteCoin = () => {
			let favourite = false;

			// get items from localStorage, or declare new one if data doesn't exist
			let coins: any = localStorage.getItem("coins") || '[]';
			coins = JSON.parse(coins);

			// if current coin id is present in array, favourite is true
			if(coins.includes(id)){
				favourite = true;
			} else {
				favourite = false;
			}

			return favourite
		}

		const presentToast = async (position: 'top' | 'middle' | 'bottom', favourite: any) => {
			// determine which message and icon to use
			const message = favourite ? 'Coin added to favourites' : 'Coin removed from favourites';
			const icon = favourite ? checkmark : trashBin;

			// create toast alert
			const toast = await toastController.create({
				message: message,
				duration: 1500,
				position: position,
				icon: icon
			});

			// show toast alert
			await toast.present();
    }

		//load coins on entering the page
		onIonViewDidEnter(() => {
			if (viewState.value !== ViewState.CONTENT) {
				loadCoin();
			}
		});

		return {
			onReload,
			favouriteCoin,
			checkFavouriteCoin,
			showActionSheet,
			viewState,
			ViewState,
			coin,
			ionRefresher,
			chevronBack,
			alertCircleOutline,
			ellipsisHorizontal,
			ellipsisVertical
		};
	},
	methods: {
		checkPercentage(percentage: number) {
			// check if percentage is below zero or not
			let p = ((percentage < 0) ? true : false);
			return p
		},
		formatPercentage(percentage: number){
			// format and return percentage
			const p = percentage.toFixed(2);
			return p
		},
	},
	components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonBackButton,
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonIcon,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonImg,
    IonList,
    IonItem,
    IonGrid,
		PriceChart,
    EmptyView,
}
};
</script>
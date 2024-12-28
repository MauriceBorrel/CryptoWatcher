<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item lines="full">
          <ion-icon :icon="moon" slot="start"/>
          <ion-label>
            Toggle Dark Theme
          </ion-label>
          <ion-toggle slot="end" value="dark" @ionChange="setTheme($event.detail.value)" :checked="checkTheme()"></ion-toggle>
        </ion-item>
        <ion-item lines="full">
          <p style="opacity: 0.6; font-size: 12px;">This app is powered by <a href="https://www.coingecko.com/en/api">CoinGecko</a></p>
        </ion-item>
      </ion-list>
    </ion-content>

  </ion-page>
</template>

<script lang="ts">
  import { 
    IonPage,
    IonHeader,
    IonContent,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonToggle
  } from "@ionic/vue";
  import { defineComponent } from 'vue';
  import { moon } from 'ionicons/icons';
  import { store } from "@/services/ThemeService";

  export default defineComponent({
    name: "SettingsPage",
    components: {
      IonPage,
      IonHeader,
      IonContent,
      IonTitle,
      IonToolbar,
      IonList,
      IonItem,
      IonIcon,
      IonLabel,
      IonToggle
    }, 
    data() {
      return {
        theme: localStorage.getItem("themeSet") as string,
      };
    },
    methods: {
      setTheme(value: string) {
        // if dark theme is already enabled and button is pressed, set value to light
        if (value === 'dark' && localStorage.getItem("themeSet") === 'dark'){
          value = "light";
        }

        // store value in localstorage
        store.setItem(value);
      },
      checkTheme(){
        const theme = localStorage.getItem("themeSet")
        let bool = false

        // return true if dark theme is set, else return false
        if (theme === 'dark'){
          bool = true;
        } else{
          bool = false;
        }

        return bool
      }
    },
    setup(){
      return{
        moon
      }
    }
  });
</script>
<template>
  <ion-page :class="theme">
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="coins" href="/tabs/coins">
          <ion-icon :icon="home"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="saved" href="/tabs/favourite">
          <ion-icon :icon="bookmark" />
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon :icon="cog" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
  import { home, bookmark, cog } from 'ionicons/icons';

  export default defineComponent({
    name: 'TabsPage',
    components: { IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
    data() {
      return {
        theme: localStorage.getItem("themeSet") as string,
      };
    },
    setup() {
      return {
        home, 
        bookmark,
        cog
      }
    }
  });
</script>

<template>
  <div id="container">
    <canvas id="canvas" ref="canvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChartService from "@/services/ChartService";
import CoinService from "@/services/CoinService";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "PriceChart",
  setup(){
    return {}
  },
  mounted(){
    // get canvas element and context
    const canvas = this.$refs['canvas'] as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    // get current route
    const route = useRoute();

    // get current coin id
		const id = route.params.id as string;

    // make API call to get chart data
    const getChart = async () => {
      const chartData = await CoinService.getChart(id);
      ChartService.buildChart(chartData.data, context);
    }

    getChart();
  }
});
</script>
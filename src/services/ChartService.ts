import {
	CategoryScale,
	Chart,
	LinearScale,
	LineController,
	LineElement,
	PointElement,
	Tooltip,
} from "chart.js";

class ChartService{

  buildChart(chartData: any, context: CanvasRenderingContext2D) {
    Chart.register(
      CategoryScale,
      LinearScale,
      LineController,
      PointElement,
      LineElement,
      Tooltip
    );

    // map the date of previous price data
    const labels = chartData.prices.map((a: number[]) =>
      new Date(a[0]).toLocaleString()
    );

    // map coin price history data
    const coinHistory = chartData.prices.map((a: number[]) => a[1]);

    // create the chart
    return new Chart(context, {
      type: "line",
      data: {
      labels: labels,
      datasets: [
        {
        data: coinHistory,
        borderColor: 'rgb(66, 69, 245)',
        fill: false,
        },
      ],
      },
      options: {
      plugins: {
        tooltip: {
        callbacks: {
          label: (tooltipItems: any) => {
          const price = tooltipItems.raw as number;
          return price.toLocaleString()
          },
        },
        },
      },
      responsive: true,
      scales: {
        xAxes: {
        display: false,
        },
        yAxes: {
        display: false,
        },
      },
      },
    });
  }
}

export default new ChartService();
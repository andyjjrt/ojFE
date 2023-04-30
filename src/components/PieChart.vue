<template>
  <Pie id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script setup lang="ts">
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  chartData: ChartData<"pie", number[], unknown>;
}>();

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItems: any) => {
          let stats = tooltipItems.dataset.data;
          let total = 0;
          for (let i in stats) {
            total += stats[i];
          }
          return ` ${tooltipItems.raw} (${(
            (tooltipItems.raw * 100) /
            total
          ).toFixed(2)}%)`;
        },
      },
    },
  },
};
</script>

<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  ChartData,
  BarElement,
} from "chart.js";

const props = defineProps<{
  chartData: ChartData<"bar", (number | [number, number] | null)[], unknown>;
}>();

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

const chartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
};
</script>

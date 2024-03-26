<template>
  <Line :options="chartOptions" :data="data" />
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { watch, computed } from "vue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  chartData: any;
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

const data = computed(() => props.chartData)

watch(
  () => props.chartData,
  (val, val1) => {
    console.log(val, val1);
  }
);
</script>

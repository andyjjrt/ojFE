<template>
  <div>
    admin
    <RouterView v-slot="{ Component }">
      <v-fade-transition mode="out-in">
        <component :is="Component" />
      </v-fade-transition>
    </RouterView>
  </div>
</template>

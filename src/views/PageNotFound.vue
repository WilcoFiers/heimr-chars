<template>
  <v-container text-center>
    <h1 class="display-2 font-weight-bold mb-3">Page does not exist</h1>
    <p class="subheading font-weight-regular">
      Please wait while our gnomes are working on it.
    </p>

    <v-row justify="center">
      <v-col :cols="4">
        <v-img :src="require('../assets/gnome.jpg')" />
      </v-col>
    </v-row>
  </v-container>
</template>

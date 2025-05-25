<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section>
    <h3>About the website</h3>
    <p>This website is a project for NSI</p>
    <p>
      Here you can chat with other people on the <RouterLink to="/main">MainChat</RouterLink> or on
      the <RouterLink to="/temporal">TempChat</RouterLink>.
    </p>
    <p>Website version: 2.0.0-alpha</p>
    <p><a target="_blank" href="https://github.com/Alfakynz/LiepChat">Website's GitHub</a></p>
  </section>
  <section>
    <h3>About the developers</h3>
    <p>
      This website was created by
      <a target="_blank" href="https://github.com/Coconutmilk1">Keerthik</a> and
      <a target="_blank" href="https://github.com/Alfakynz/">Valentin</a>
    </p>
  </section>
</template>

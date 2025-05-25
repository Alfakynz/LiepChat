<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section>
    <h3>Welcome to LiepChat</h3>
    <p>
      To access chat, you can <RouterLink to="/signin">log in</RouterLink> or
      <RouterLink to="signup">create an account</RouterLink>.
    </p>
    <p>
      You can see my code on my
      <a target="_blank" href="https://github.com/Alfakynz/LiepChat">GitHub</a>
    </p>
  </section>
</template>

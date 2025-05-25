<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
  <section>
    <form action="/signin" method="post">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
      </div>
      <button type="submit">Sign In</button>
    </form>
    <p>Don't have an account? <RouterLink to="/signup">Create an account</RouterLink></p>
  </section>
</template>

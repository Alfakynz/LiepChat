<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section>
    <form action="/signup" method="post">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
      </div>
      <div>
        <label for="confirmPassword">Confirm password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required />
      </div>
      <button type="submit">Sign In</button>
    </form>
    <p>Already have an account? <RouterLink to="/signin">Log in</RouterLink></p>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section>
    <h3>{{ t('aboutWebsite.title') }}</h3>
    <p>{{ t('aboutWebsite.text[0]') }}</p>
    <p>
      {{ t('aboutWebsite.text[1]')
      }}<RouterLink to="/main">{{ t('aboutWebsite.text[2]') }}</RouterLink
      >{{ t('aboutWebsite.text[3]') }}
      <RouterLink to="/temporal">{{ t('aboutWebsite.text[4]') }}</RouterLink
      >.
    </p>
    <p>{{ t('aboutWebsite.text[6]') }}</p>
    <p>
      <a target="_blank" href="https://github.com/Alfakynz/LiepChat">{{
        t('aboutWebsite.text[7]')
      }}</a>
    </p>
  </section>
  <section>
    <h3>{{ t('aboutDev.title') }}</h3>
    <p>
      {{ t('aboutDev.text[0]') }}
      <a target="_blank" href="https://github.com/Coconutmilk1">{{ t('aboutDev.text[1]') }}</a>
      {{ t('aboutDev.text[2]') }}
      <a target="_blank" href="https://github.com/Alfakynz/">{{ t('aboutDev.text[3]') }}</a>
    </p>
  </section>
</template>

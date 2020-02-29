<template>
  <h1
    :class="{
      'category-title': true,
      hide,
      active
    }"
    v-on:mouseover="onHover"
    v-on:click="onClick"
  >
    {{ title }}
  </h1>
</template>

<script>
export default {
  name: "CategoryTitle",
  props: ["onClick", "title", "active", "onHover", "hide"]
};
</script>

<style scoped>
.hide {
  color: transparent;
}

.category-title {
  cursor: pointer;
  pointer-events: all;
  transition: color 0.1s;
}

.category-title:hover,
.category-title:focus,
.category-title.active {
  color: var(--white);
}
</style>

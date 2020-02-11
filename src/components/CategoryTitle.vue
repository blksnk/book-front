<template>
  <h1
    :class="`${active ? 'active' : ''} ${hide ? 'hide' : ''} category-title`"
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

@media (max-width: 1100px) {
  h1 {
    font-size: 5rem;
  }
}

@media (max-width: 900px) {
  h1 {
    font-size: 4rem;
  }
}

@media (max-width: 750px) {
  h1 {
    font-size: 3rem;
  }
}

@media (max-width: 600px) {
  h1 {
    font-size: 2rem;
  }
}
</style>

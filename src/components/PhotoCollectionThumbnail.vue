<template>
  <article
    class="photo-collection-thumbnail"
    :style="{
      backgroundImage: `url(${src})`
    }"
    @click="e => onClick(id)"
    @mouseover="e => onHover(index)"
  >
    <h3>{{ name }}</h3>
  </article>
</template>

<script>
export default {
  name: "PhotoCollectionThumbnail",
  props: {
    src: {
      type: String
    },
    name: {
      type: String
    },
    onClick: {
      type: Function
    },
    onHover: {
      type: Function
    },
    index: {
      type: Number
    },
    id: {
      type: Number
    }
  }
};
</script>

<style>
.photo-collection-thumbnail {
  width: 100%;
  height: calc((100vh - 10rem) / 2);
  z-index: 2;
  background-position: center;
  background-size: cover;
  padding: 2rem;
  filter: grayscale(1);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s filter;
  cursor: pointer;
  box-shadow: 0.5rem 0 2rem rgba(0, 0, 0, 0.5);
  border-radius: var(--border-radius);
}

.photo-collection-thumbnail:nth-child(4n + 2) {
  grid-row: span 2;
}

.photo-collection-thumbnail:last-child {
  grid-row: span 1;
  margin-bottom: 4rem;
}

.photo-collection-thumbnail h3 {
  margin: 0;
  font-family: "Bw";
  font-weight: 600;
  font-size: 2rem;
  text-transform: capitalize;
  color: var(--white);
  mix-blend-mode: difference;
}

.photo-collection-thumbnail:hover {
  filter: grayscale(0.7);
}

.photo-collection-thumbnail:hover h3 {
}
</style>

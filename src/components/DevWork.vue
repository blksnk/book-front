<template>
  <article
    :class="{
      'dev-work': true,
      expanded: expanded && expandedIndex === index
    }"
  >
    <div
      :class="{
        'dev-work-top': true,
        switch: index % 2 !== 0
      }"
      @click="e => toggleExpand(index)"
    >
      <h2 class="dev-work-title">
        {{ work.title }}
      </h2>
      <div class="dev-work-index-container">
        <span class="dev-work-index">{{ formattedIndex }}</span>
      </div>
    </div>

    <div class="dev-work-content">
      <div class="dev-work-info">
        <span>client&mdash; {{ work.client }}</span>

        <span>made&mdash; {{ work.date }}</span>
      </div>

      <p class="dev-work-description">
        {{ work.description }}
      </p>

      <a
        class="dev-work-link"
        :href="work.link"
        target="_blank"
        rel="noopener noreferrer"
        >visit website</a
      >
    </div>
  </article>
</template>

<script>
export default {
  name: "DevWork",
  props: {
    work: {
      type: Object,
      default: () => ({
        title: "",
        date: "",
        description: "",
        client: "",
        link: ""
      })
    },
    index: {
      type: Number,
      default: 0
    },
    formattedIndex: {
      type: String,
      default: "01"
    },
    toggleExpand: {
      type: Function
    },
    expanded: {
      type: Boolean,
      default: false
    },
    expandedIndex: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped>
.dev-work {
  z-index: 2;
  grid-column: 2 / 2;
  border: 1px solid var(--white);
  border-bottom: none;
  /* background-color: rgba(0, 0, 0, 0.5); */
}

.dev-work.expanded .dev-work-content {
  display: block;
}

.dev-work-top {
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(max-content, 100%) max-content;
  height: 5rem;
  cursor: pointer;
}

.dev-work-top.switch {
  grid-template-columns: max-content minmax(max-content, 100%);
}

.dev-work:last-child {
  border-bottom: 1px solid var(--white);
}

.dev-work-title {
  /* color: var(--white); */
  z-index: 2;
  padding: 0.2rem 2rem 0 2rem;
  height: 100%;
  grid-column: 1 / 1;
  grid-row: 1 / 1;
  transition: 0.3s color linear;
}

.dev-work-top.switch .dev-work-title {
  grid-column: 2 / 2;
}

.dev-work-index-container {
  display: block;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 2rem 0 2rem;
  height: min-content;
  min-height: 100%;
  width: 10.8rem;

  grid-column: 2 / 2;
  grid-row: 1 / 1;
  border-left: 1px solid var(--white);
  transition: 0.3s background-color linear;
}

.dev-work-top.switch .dev-work-index-container {
  grid-column: 1 / 1;
  border-right: 1px solid var(--white);
  border-left: none;
}

.dev-work-index {
  font-size: 4rem;
  font-family: "Monument";
  color: var(--white);
  font-weight: 700;
  transition: 0.3s color linear;
}

.dev-work-content {
  display: none;
  padding: 2rem 0 0 2rem;
  border-top: 1px solid var(--white);
  color: var(--white);
  min-height: 5rem;
}

.dev-work-content * {
  font-family: "Bw";
  font-weight: 700;
}

.dev-work-info {
  padding-right: 2rem;
  margin-bottom: 4rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.dev-work-info span {
  text-transform: capitalize;
  color: var(--light-grey);
}

.dev-work-link {
  margin-left: auto;
  padding: 1rem 0;
  font-family: "Monument";
  text-align: center;
  font-weight: 700;
  color: var(--black);
  background-color: var(--white);
  text-decoration: none;
  display: block;
  width: 10.8rem;
  margin-top: 2rem;
  border: 1px solid var(--white);
  border-bottom: none;
  transition: 0.3s color;
  transition: 0.3s background-color;
}

.dev-work-link:hover {
  color: var(--white);
  background-color: transparent;
}

.dev-work-top:hover .dev-work-title,
.dev-work.expanded .dev-work-title {
  color: var(--white);
}

.dev-work-top:hover .dev-work-index-container,
.dev-work.expanded .dev-work-index-container {
  background-color: var(--white);
}

.dev-work-top:hover .dev-work-index,
.dev-work.expanded .dev-work-index {
  color: var(--black);
}
</style>

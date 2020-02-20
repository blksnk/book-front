<template>
  <fragment>
    <nav id="top-nav">
      <a
        :class="{
          active: $route.path.includes('/') && $route.path !== '/about',
          'hover-underline': true
        }"
        v-on:click="e => transitionOut(e, '/', false)"
        to="/"
        >work</a
      >
      <a
        :class="{
          active: $route.path.includes('/about'),
          'hover-underline': true
        }"
        v-on:click="e => transitionOut(e, '/about', false)"
        to="/about"
        >about</a
      >
    </nav>
  </fragment>
</template>

<script>
export default {
  name: "Menu",
  props: {
    setCameraTo: {
      type: Function
    },
    setActiveIndex: {
      type: Function
    },
    gl: {
      type: Object
    },
    workSelect: {
      type: Object
    },
    highlightMesh: {
      type: Function
    },
    activeMesh: {
      type: Object
    },
    disableWorkSelect: {
      type: Function
    }
  },
  data() {
    return {
      transitionInProgress: false,
      isWorkSection: this.testIsWorkSection(this.$route.path),
      links: [
        {
          title: "work",
          to: "/"
        },
        {
          title: "about",
          to: "/about"
        }
      ],
      workLinks: [
        {
          title: "development",
          to: "/work/dev"
        },
        {
          title: "design",
          to: "/work/design"
        },
        {
          title: "music",
          to: "/work/music"
        },
        {
          title: "photography",
          to: "/work/photo"
        },
        {
          title: "experiments",
          to: "/work/exp"
        }
      ]
    };
  },
  methods: {
    transitionOut: function(e, url, setWork, index) {
      e.preventDefault();
      if (!this.transitionInProgress && !this.isActive(url)) {
        this.disableWorkSelect();
        if (index) {
          this.setActiveIndex(index);
        }
        this.setCameraTo({
          x: this.workSelect.activeIndex * this.gl.placementOffset,
          y: 0,
          z: 2
        });
        this.highlightMesh(this.activeMesh);
        setTimeout(() => {
          this.$router.push(url);
          this.transitionInProgress = false;
          this.isWorkSection = setWork;
        }, 1300);
      }
    },
    isActive: function(url) {
      return this.$route.path === url;
    },
    testIsWorkSection: function(to) {
      const test = to.includes("/work/") && to !== "/";
      return test;
    }
  },
  watch: {
    $route: function(to) {
      this.isWorkSection = this.testIsWorkSection(to.path);
    }
  }
};
</script>

<style scoped>
nav {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  padding: 0 6rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  z-index: 30;
  mix-blend-mode: difference;
}

#top-nav {
  top: 4rem;
}

#work-nav {
  bottom: 4rem;
}

a {
  font-weight: 600;
  color: var(--white);
  font-size: var(--font-size-small);
  text-decoration: none;
  mix-blend-mode: difference;
  position: relative;
  cursor: pointer;
}
</style>

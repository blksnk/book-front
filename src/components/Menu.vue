<template>
  <fragment>
    <nav id="top-nav">
      <span id="top-nav-title">
        <a
          :class="{
            'hover-underline': true,
            'cursor-pointer': true
          }"
          v-on:click="e => transitionOut(e, '/', false)"
          to="/"
          >genmetsu.</a
        >
      </span>
      <span id="top-nav-right">
        <a
          :class="{
            active: activeLink === '/',
            'hover-underline': true,
            'cursor-pointer': true
          }"
          v-on:click="e => transitionOut(e, '/', false)"
          to="/"
          >.work</a
        >
        <a
          :class="{
            active: activeLink == '/about',
            'cursor-pointer': true,
            'hover-underline': true
          }"
          v-on:click="e => transitionOut(e, '/about', false)"
          to="/about"
          >.about</a
        >
      </span>
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
      activeLink: this.$route.path === "/about" ? "/about" : "/",
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
        this.activeLink = url;
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

#top-nav-right {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}

#work-nav {
  bottom: 4rem;
}

a,
#top-nav-title {
  font-weight: 600;
  color: var(--white);
  font-size: var(--font-size-small);
  text-decoration: none;
  mix-blend-mode: difference;
  position: relative;
  margin-bottom: 0.5rem;
}

#top-nav-title {
}
</style>

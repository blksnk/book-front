<template>
  <fragment>
    <nav id="top-nav">
      <a
        v-for="link in links"
        :class="{ active: $route.path.includes(link.to) }"
        v-on:click="e => transitionOut(e, link.to, false)"
        :to="link.to"
        v-bind:key="'link-' + link.to"
        >{{ link.title }}</a
      >
    </nav>

    <!-- <nav id="work-nav" v-if="isWorkSection">
      <a
        v-for="(link, index) in workLinks"
        :class="{ active: isActive(link.to) }"
        v-on:click="e => transitionOut(e, link.to, true, index)"
        :to="link.to"
        v-bind:key="'work-link-' + link.to"
      >
        {{ link.title }}
      </a>
    </nav> -->
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
  z-index: 0;
  mix-blend-mode: difference;
}

#top-nav {
  top: 4rem;
}

#work-nav {
  bottom: 4rem;
}

a {
  font-family: "Bw";
  font-weight: 600;
  color: var(--light-grey);
  font-size: 1rem;
  text-decoration: none;
  mix-blend-mode: difference;
  position: relative;
  cursor: pointer;
  transition: 0.3s color linear;
}

a::before {
  position: absolute;
  content: "";
  height: 1px;
  width: 0;
  background-color: var(--white);
  left: 0;
  bottom: -1px;
  mix-blend-mode: difference;
  transition: 0.3s width ease-in-out;
}

a:hover::before,
a.active::before {
  width: 100%;
}

a:hover,
a.active {
  color: var(--white);
}

@media (max-width: 750px) {
  nav {
    padding: 0 2rem;
  }
}
</style>

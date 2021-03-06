<template>
  <main id="app">
    <GL
      v-bind="{
        gl,
        workSelect,
        setMeshes,
        clearGLAssets,
        activeMesh,
        stopRedirect: () => setRedirectDone(true)
      }"
    />
    <transition name="pagefade">
      <router-view
        v-if="loaded"
        v-bind="{
          siteData,
          setCameraTo,
          workSelect,
          setWireframeOpacity,
          gl,
          selectCategory,
          setActiveIndex,
          resetSelection,
          currentXOffset,
          hideAllMeshesButOne,
          activeMesh,
          setActiveMeshAsWireframe,
          setActiveMeshAsTransparentWireframe,
          setAllMeshesAsTransparentWireframe,
          tweenDuration
        }"
      ></router-view>
    </transition>
    <Menu
      v-bind="{
        setCameraTo,
        gl,
        workSelect,
        setActiveIndex,
        highlightMesh,
        activeMesh,
        currentXOffset,
        disableWorkSelect
      }"
    />

    <Loader
      v-if="!loaded"
      v-bind="{
        preloaded
      }"
      v-on:loaded="onPreloadingComplete"
    />

    <WindowWarning v-if="windowTooSmall" />
  </main>
</template>

<script>
import "normalize.css";
import "@/scss/fonts.scss";

import VueRouter from "vue-router";
import * as THREE from "three";

import { fetch, formatIntoRows, extractAboutData } from "@/helpers/fetchers.js";
import { degToRad } from "@/helpers/math.js";

import GL from "@/components/GL.vue";
import Loader from "@/components/Loader.vue";
import Menu from "@/components/Menu.vue";
import WindowWarning from "@/components/WindowWarning.vue";

import CategoryWrapper from "@/components/CategoryWrapper.vue";
import About from "@/vues/About.vue";
import Development from "@/vues/Development.vue";
import Design from "@/vues/Design.vue";
import Music from "@/vues/Music.vue";
import Photography from "@/vues/Photography.vue";
import Experiments from "@/vues/Experiments.vue";

const app = {
  name: "app",
  components: {
    GL,
    Menu,
    Loader,
    WindowWarning
  },
  router: new VueRouter({
    mode: "history",
    base: __dirname,
    routes: [
      {
        path: "/",
        component: CategoryWrapper
      },
      {
        path: "/work/dev",
        component: Development
      },
      {
        path: "/work/design",
        component: Design
      },
      {
        path: "/work/photo/",
        component: Photography
      },
      {
        path: "/work/music",
        component: Music
      },
      {
        path: "/work/exp",
        component: Experiments
      },
      {
        path: "/about",
        component: About
      }
    ]
  }),
  data() {
    return {
      workSelect: {
        activeIndex: 0,
        selectionMade: false,
        redirectToUrl: "/",
        redirectDone: false
      },
      siteData: {
        photo: [],
        design: [],
        dev: [],
        music: [],
        exp: [],
        about: {
          presentation: "",
          education: "",
          experience: "",
          skills: "",
          inspiration: "",
          thumbnail: null,
          inspirationLinks: [
            {
              title: "Felipe Pantone",
              url: "https://www.instagram.com/felipepantone/?hl=fr"
            },
            {
              title: "Ghostemane",
              url: "https://www.instagram.com/ghostemane/?hl=fr"
            },
            {
              title: "Graeme Swinton",
              url: "https://actuallystudio.co.uk/"
            },
            {
              title: "$uicideBoy$",
              url: "https://www.instagram.com/suicideboys6/"
            },
            {
              title: "Eliott Grunewald",
              url: "https://www.instagram.com/eliottgrunewald/"
            },
            {
              title: "Julien Gadachoat",
              url: "https://www.instagram.com/julienv3ga/"
            },
            {
              title: "polygon1993",
              url: "https://www.instagram.com/polygon1993/"
            },
            {
              title: "Pierre Châtel-Innocenti",
              url: "https://www.chatel-photo.fr"
            },
            {
              title: "Aristide Benoist",
              url: "https://www.aristidebenoist.com/"
            },
            {
              title: "Charliedelaforet",
              url: "https://www.instagram.com/charliedelaforet"
            }
          ]
        }
      },
      tweenDuration: 0.7,
      loaded: false,
      preloaded: false,
      windowTooSmall: false,
      gl: {
        cameraTo: {
          x: 14,
          y: 0,
          z: 16,
          r: {
            x: 0,
            y: 0,
            z: 0
          }
        },
        materials: {
          wireframeMaterial: new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            wireframeLinewidth: 1,
            transparent: true,
            opacity: 1
          }),
          filledMaterial: new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: false
          }),
          transparentMaterial: new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0
          }),
          lineMaterial: new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 2
          }),
          blackMaterial: new THREE.MeshLambertMaterial({
            color: 0x000000,
            wireframe: false
          })
        },
        geos: [
          new THREE.IcosahedronBufferGeometry(2, 1),
          new THREE.SphereBufferGeometry(2, 15, 15),
          new THREE.TetrahedronBufferGeometry(2, 3),
          new THREE.OctahedronBufferGeometry(2, 2),
          new THREE.DodecahedronBufferGeometry(2, 1)
        ],
        meshes: [],
        scene: new THREE.Scene(),
        placementOffset: 7
      }
    };
  },
  computed: {
    activeMesh: function() {
      return this.gl.meshes[this.workSelect.activeIndex];
    },
    currentXOffset: function() {
      return this.workSelect.activeIndex * this.gl.placementOffset;
    }
  },
  methods: {
    setActiveIndex(index) {
      if (!this.workSelect.selectionMade) {
        this.workSelect.activeIndex = index;
        this.setCameraTo({ x: index * this.gl.placementOffset });
      }
    },
    assignCorrectIndexOnSiteEnter() {
      const workRoutes = [
        "/work/dev",
        "/work/design",
        "/work/music",
        "/work/photo",
        "/work/exp"
      ];
      if (this.$route.path.includes("/work")) {
        this.workSelect.activeIndex = workRoutes.indexOf(this.$route.path);
      }
    },
    resetSelection() {
      this.workSelect = {
        ...this.workSelect,
        selectionMade: false,
        redirectToUrl: "/",
        redirectDone: false
      };
      this.resetMaterials();
    },
    resetMeshMaterials(mesh) {
      mesh.children[0].material = this.gl.materials.blackMaterial;
      mesh.children[1].material = this.gl.materials.wireframeMaterial;
    },
    resetMaterials() {
      this.gl.meshes.forEach(mesh => this.resetMeshMaterials(mesh));
    },
    hideAllMeshesButOne(selected) {
      this.gl.meshes.forEach(mesh => {
        if (mesh !== selected) {
          this.hideMesh(mesh);
        }
      });
    },
    hideMesh(mesh) {
      mesh.children.forEach(child => {
        child.material = this.gl.materials.transparentMaterial;
      });
    },
    createMeshes() {
      const meshes = this.gl.geos.map(geo => {
        const group = new THREE.Group();
        const mesh = new THREE.Mesh(geo, this.gl.materials.blackMaterial);
        const wireframe = new THREE.Mesh(
          geo,
          this.gl.materials.wireframeMaterial
        );
        //remove intersection bewteen mesh and wireframe
        mesh.scale.set(0.999, 0.999, 0.999);
        group.add(mesh);
        group.add(wireframe);
        return group;
      });

      this.setMeshes(meshes);
      return meshes;
    },
    addMeshesToScene(meshes) {
      meshes.forEach((mesh, index) => {
        mesh.rotation.x = 0.75;
        this.gl.scene.add(mesh);
        mesh.position.x = index * this.gl.placementOffset;
      });
    },
    setMeshes(arr) {
      this.gl.meshes = arr;
    },
    setWireframeOpacity(opacity) {
      this.gl.materials.wireframeMaterial.opacity = opacity;
    },
    disableWorkSelect() {
      this.workSelect = {
        ...this.workSelect,
        selectionMade: true
      };
    },
    selectCategory(url) {
      this.workSelect = {
        ...this.workSelect,
        redirectToUrl: url,
        selectionMade: true
      };
      this.highlightMesh(this.activeMesh);
      this.setCameraTo({ z: 2.05 });
    },
    highlightMesh(mesh) {
      mesh.children[0].material = this.gl.materials.filledMaterial;
    },
    setActiveMeshAsWireframe() {
      this.resetMeshMaterials(this.activeMesh);
    },
    setActiveMeshAsTransparentWireframe() {
      this.setMeshAsTransparentWireframe(this.activeMesh);
    },
    setAllMeshesAsTransparentWireframe() {
      const { length } = this.gl.meshes;
      for (let i = 0; i < length; i++) {
        this.setMeshAsTransparentWireframe(this.gl.meshes[i]);
      }
    },
    setMeshAsTransparentWireframe(mesh) {
      mesh.children[0].material = this.gl.materials.transparentMaterial;
    },
    setRedirectDone(bool) {
      this.workSelect.redirectDone = bool;
    },
    formatCameraTo(to, isRotation) {
      let coords = {};
      if (isRotation) {
        coords = {
          x: degToRad(to.x) || this.gl.cameraTo.r.x,
          y: degToRad(to.y) || this.gl.cameraTo.r.y,
          z: degToRad(to.z) || this.gl.cameraTo.r.z
        };
      } else {
        coords = {
          x: to.x || this.gl.cameraTo.x,
          y: to.y || this.gl.cameraTo.y,
          z: to.z || this.gl.cameraTo.z
        };
      }
      if (to.x === 0) {
        coords.x = 0;
      }
      if (to.y === 0) {
        coords.y = 0;
      }
      if (to.z === 0) {
        coords.z = 0;
      }
      if (to.r) {
        coords.r = this.formatCameraTo(to.r, true);
      } else {
        coords.r = {
          x: 0,
          y: 0,
          z: 0
        };
      }
      return coords;
    },
    setCameraTo(to) {
      const coords = this.formatCameraTo(to);
      this.gl.cameraTo = {
        ...this.gl.cameraTo,
        ...coords
      };
    },
    clearGLAssets() {
      this.gl.meshes.forEach((mesh, index) => {
        this.gl.scene.remove(mesh);
        this.gl.geos[index].dispose();
      });
      this.gl.materials.wireframeMaterial.dispose();
      this.gl.materials.filledMaterial.dispose();
    },
    async fetchSiteData() {
      const data = await Promise.all([
        fetch("dev"),
        fetch("design"),
        fetch("photo", formatIntoRows),
        fetch("music"),
        fetch("exp"),
        fetch("about", extractAboutData)
      ]);
      const [dev, design, photo, music, exp, about] = data;
      this.siteData = {
        dev,
        design,
        photo,
        music,
        exp,
        about: {
          ...this.siteData.about,
          ...about
        }
      };
      this.preloaded = true;
    },
    onPreloadingComplete() {
      this.loaded = true;
      this.setCameraTo({
        x: 0,
        z: 6
      });
    },
    checkWindowSize() {
      if (window.innerWidth <= 750 && !this.windowTooSmall) {
        this.windowTooSmall = true;
      } else if (window.innerWidth > 750 && this.windowTooSmall) {
        this.windowTooSmall = false;
      }
    }
  },
  created() {
    this.addMeshesToScene(this.createMeshes());
    this.fetchSiteData();
    this.assignCorrectIndexOnSiteEnter();
  },
  mounted() {
    this.checkWindowSize();
    window.addEventListener("resize", this.checkWindowSize);
  }
};

export default app;
</script>

<style>
* {
  box-sizing: border-box;
  --white: #fff;
  --black: #000;
  --dark-grey: #4a4a4a;
  --light-grey: #b7b7b7;
  --page-padding: 8rem 6rem 4rem 6rem;
  --padding-horizontal: 6rem;
  --padding-top: 8rem;
  --padding-bottom: 4rem;
  --border-radius: 4px;
  --font-size-small: 1rem;
  font-family: "Bw";
  user-select: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: url("./assets/icons/cursor-normal.svg") 8 8, auto;
}

.cursor-pointer,
.cursor-pointer * {
  cursor: url("./assets/icons/cursor-pointer.svg") 16 16, auto !important;
}

*:focus {
  /* outline-color: var(--white); */
  outline: none;
}

::-webkit-scrollbar {
  display: none;
}

html,
body {
  background-color: var(--black);
  overflow: hidden;
}

h1 {
  font-family: "Monument";
  position: relative;
  font-size: 6rem;
  margin: 0;
  font-weight: 700;
  color: transparent;
  -webkit-text-stroke: 1px var(--white);
  text-transform: uppercase;
  display: block;
  transition: 0.1s color linear;
}

h2 {
  font-family: "Monument";
  position: relative;
  font-size: 4rem;
  margin: 0;
  font-weight: 700;
  color: transparent;
  -webkit-text-stroke: 1px var(--white);
  text-transform: uppercase;
  display: block;
  transition: 0.1s color linear;
}

h3 {
  font-family: "Monument";
  position: relative;
  font-size: 1rem;
  margin: 0;
  text-transform: uppercase;
  font-weight: normal;
  display: block;
  color: var(--white);
  transition: 0.1s color linear;
}

p {
  font-family: "Bw";
  margin: 0;
}

a {
  color: var(--white);
  text-decoration: none;
}

hr {
  border: none;
  border-bottom: 1px solid var(--light-grey);
  margin: 0;
}

button {
  border: none;
  padding: 0;
  background: none;
  color: var(--white);
  cursor: pointer;
}

img {
  object-fit: cover;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.hover-underline {
  transition: 0.3s color linear;
  position: relative;
}

.hover-underline::before {
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

.hover-underline:hover::before,
.hover-underline.active::before {
  width: 100%;
}

.hover-underline:hover {
  color: var(--light-grey) !important;
}

.fill-hover:hover {
  color: var(--white);
}

.fade-enter-active {
  transition: opacity 0.2s;
  transition-delay: 0.2s;
}

.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  pointer-events: none;
  opacity: 0;
}

.pagefade-enter-active {
  transition: opacity 1.5s;
}

.pagefade-leave-active {
  transition: opacity 0.2s;
}

.pagefade-enter,
.pagefade-leave-to {
  opacity: 0;
}

[data-align="left"] {
  align-self: flex-start;
}

[data-align="right"] {
  align-self: flex-end;
}

[data-align="center"] {
  align-self: center;
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

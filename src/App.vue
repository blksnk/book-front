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
        v-bind="{
          siteData,
          setCameraTo,
          workSelect,
          setWireframeOpacity,
          gl,
          resetSelection,
          useControls,
          currentXOffset,
          hideAllMeshesButOne,
          activeMesh,
          setActiveMeshAsWireframe,
          setActiveMeshAsTransparentWireframe,
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
        currentXOffset
      }"
    />
  </main>
</template>

<script>
import "normalize.css";
import "./scss/fonts.scss";

import VueRouter from "vue-router";
import * as THREE from "three";

import { fetch } from "./helpers/fetchers.js";

import GL from "./components/GL.vue";
import Menu from "./components/Menu.vue";

import Development from "./vues/Development.vue";
import Design from "./vues/Design.vue";
import Photography from "./vues/Photography.vue";
import PhotoCollection from "./components/PhotoCollection.vue";
import CategoryWrapper from "./components/CategoryWrapper.vue";

const app = {
  name: "app",
  components: {
    GL,
    Menu
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
        path: "/work/photo/collection/:id",
        component: PhotoCollection
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
        exp: []
      },
      tweenDuration: 0.7,
      loaded: false,
      gl: {
        useControls: false,
        cameraTo: {
          x: 0,
          y: 0,
          z: 4
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
          new THREE.OctahedronBufferGeometry(2, 2),
          new THREE.TetrahedronBufferGeometry(2, 3),
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
    useControls(bool) {
      this.gl.useControls = bool;
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
      this.activeMesh.children[0].material = this.gl.materials.transparentMaterial;
    },
    setRedirectDone(bool) {
      this.workSelect.redirectDone = bool;
    },
    setCameraTo(to) {
      let coords = {
        x: to.x || this.gl.cameraTo.x,
        y: to.y || this.gl.cameraTo.y,
        z: to.z || this.gl.cameraTo.z
      };
      if (to.x === 0) {
        coords.x = 0;
      }
      if (to.y === 0) {
        coords.y = 0;
      }
      this.gl.cameraTo = coords;
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
        fetch("dev", false),
        fetch("design", true),
        fetch("photo", true)
      ]);
      const [dev, design, photo] = data;
      this.siteData = {
        dev,
        design,
        photo
      };
      this.loaded = true;
    }
  },
  created() {
    this.addMeshesToScene(this.createMeshes());
    this.fetchSiteData();
    this.assignCorrectIndexOnSiteEnter();
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
  --border-radius: 4px;
  --font-size-small: 1rem;
  font-family: "Bw";
  user-select: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  /* transition: 0.3s color ease-in-out; */
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

p {
  font-family: "Bw";
  margin: 0;
}

html {
  background-color: var(--black);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  display: none;
}

*:focus {
  outline-color: var(--white);
}

.fillHover:hover {
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
</style>

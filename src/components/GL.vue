<template>
  <div id="gl-mount"></div>
</template>

<script>
import CategoryWrapper from "./CategoryWrapper.vue";
import * as THREE from "three";

const gl = {
  name: "GL",
  components: {
    CategoryWrapper
  },
  props: {
    gl: {
      type: Object,
      default: () => ({
        useControls: false,
        cameraTo: {
          x: 0,
          y: 0,
          z: 4,
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
      })
    },
    workSelect: {
      type: Object
    },
    activeMesh: {
      type: Object
    },
    stopRedirect: {
      type: Function
    },
    setMeshes: {
      type: Function
    },
    clearGLAssets: {
      type: Function
    }
  },
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      meshes: [],
      container: null,
      frameId: null,
      controls: null
    };
  },
  methods: {
    init() {
      this.container = document.getElementById("gl-mount");
      const horizontalFov = 90;
      const aspect = window.innerWidth / window.innerHeight;
      const fov =
        (Math.atan(Math.tan(((horizontalFov / 2) * Math.PI) / 180) / aspect) *
          2 *
          180) /
        Math.PI;
      this.camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        0.05,
        40
      );
      this.camera.position.x = 14;
      this.camera.position.y = 0;
      this.camera.position.z = 16;
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setClearColor(0x000000, 0);
      this.sizeRenderer();
      this.container.appendChild(this.renderer.domElement);
    },
    sizeRenderer() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.renderer.setSize(width, height);
      this.sizeCamera();
      this.renderer.setPixelRatio(window.devicePixelRatio);
    },
    sizeCamera() {
      const horizontalFov = 90;
      const aspect = window.innerWidth / window.innerHeight;
      const fov =
        (Math.atan(Math.tan(((horizontalFov / 2) * Math.PI) / 180) / aspect) *
          2 *
          180) /
        Math.PI;
      this.camera.aspect = aspect;
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    },
    animate() {
      this.frameId = requestAnimationFrame(this.animate);
      this.rotateMeshes();

      this.moveCameraAxis(this.gl.cameraTo);
      this.redirectWhenAnimationDone();
      this.renderer.render(this.gl.scene, this.camera);
    },
    rotateMeshes() {
      this.gl.meshes.forEach(mesh => {
        mesh.rotation.y -= 0.01;
      });
    },
    moveCameraAxis({ x, y, z, r }) {
      const changeX = x - this.camera.position.x;
      const changeY = y - this.camera.position.y;
      const changeZ = z - this.camera.position.z;
      this.camera.position.x += changeX / 25;
      this.camera.position.y += changeY / 25;
      this.camera.position.z += changeZ / 25;
      if (changeX === 0.05) {
        this.camera.position.x = x;
      }
      if (changeY === 0.05) {
        this.camera.position.y = y;
      }
      if (changeY === 0.05) {
        this.camera.position.z = z;
      }
      if (r) {
        this.rotateCamera(r);
      }
    },
    rotateCamera({ x, y, z }) {
      const changeX = x - this.camera.rotation.x;
      const changeY = y - this.camera.rotation.y;
      const changeZ = z - this.camera.rotation.z;
      this.camera.rotation.x += changeX / 25;
      this.camera.rotation.y += changeY / 25;
      this.camera.rotation.z += changeZ / 25;
      if (changeX === 0.05) {
        this.camera.rotation.x = x;
      }
      if (changeY === 0.05) {
        this.camera.rotation.y = y;
      }
      if (changeY === 0.05) {
        this.camera.rotation.z = z;
      }
    },
    redirectWhenAnimationDone() {
      const { selectionMade, redirectDone, redirectToUrl } = this.workSelect;
      if (
        selectionMade &&
        !redirectDone &&
        redirectToUrl &&
        this.camera.position.z <= 2.1 &&
        this.camera.position.x <= this.gl.cameraTo.x + 0.05 &&
        this.camera.position.x >= this.gl.cameraTo.x - 0.05
      ) {
        this.stopRedirect();
        this.$router.push(redirectToUrl);
      }
    },
    stop() {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
      window.removeEventListener("resize", this.sizeRenderer);
      this.container.removeChild(this.renderer.domElement);
    }
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.sizeRenderer);
    this.animate();
  },
  beforeDestroy() {
    this.clearGLAssets();
    this.stop();
  }
};

export default gl;
</script>

<style scoped>
#gl-mount {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  z-index: 20;
  user-select: none;
  pointer-events: none;
}

#gl-mount canvas {
  z-index: inherit;
}
</style>

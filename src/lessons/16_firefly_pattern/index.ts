import * as THREE from "three";

import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";

import firefliesVertexShader from "./vertex.glsl";
import firefliesFragmentShader from "./fragment.glsl";

// Continuing with the color pattern

// don't forget to set "transparent" to true in the material
// as you rember, without it the alpha channel can only be 1 or 0
// go to firefliesMaterial  to see what I set

// we will use small value like 0.05 to divide distanceToCenter

// than we will use that value as alpha

// but we will substract (0.05 * 2) from alpha

// that way we got something that looks like fireflies

// but still it didn't look right
// when I move the scene rectangle was too big and
// as I rotate the scene you can see that one
// rectangle was hiding the other
// and it didn't look right so I lowered the size of the rectangle

// Also author of the workshop used strenghth value only for aplpha
// while other values were set to 1.0 (colors)

// I set strength to be value for 3 colors and alpha

// -----------------------------------------------

// but at the end since I'm following the workshop
// I changed everything to his way

// I'll make changes when I finish the workshop

// What is strange for me?

// as I move the scene, and I'm following certain particle
// some other particle is completely hidden by the rectangle
// and other it can be seen through the rectangle

// I would like to know why is that happening

// AI told this:
// I think that is because of the order of the particles
// in the buffer geometry

// ---------------------------------------------------------

// ------------ gui -------------------
/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "Tweak it",
  closeFolders: false,
});

/**
 * @description gui parmeters
 */
const parameters = {
  //
  "rotate model": 0,
  // clearColor: "#ff0000",
  // clearColor: "#473333",
  // clearColor: "#483333",
  clearColor: "#271b1b",
  // instead 200 we will use 100
  size: 50,
};
// gui.hide()
// ----------------------------------

//------------ canvas settings -----------
/**
 * @description canvas settings
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// ----------------------------------------

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  // ---- loaders -------
  /**
   * @description loaders
   */

  const textureLoader = new THREE.TextureLoader();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("draco/");

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------

  // ------- Scene
  const scene = new THREE.Scene();

  //

  // -------- Camera -------------------------------
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(4, 2, 4);
  scene.add(camera);

  //------------------------------------------------
  //------------------------------------------------
  //------------------------------------------------
  //------------------------------------------------
  // ---------- model ______________________________

  // textures
  const bakedTexture = textureLoader.load(
    "/models/portal/baked.jpg",
    (t) => {
      // console.log({ t });
      console.log("texture loaded");
    },
    (p) => {
      console.log("texture loading progress:", p.loaded / p.total);
    },
    (e) => {
      console.log("error loading texture:", e);
    }
  );

  bakedTexture.flipY = false;

  bakedTexture.colorSpace = THREE.SRGBColorSpace;

  // materials
  // ---- adding different material
  const bakedMaterial = new THREE.MeshBasicMaterial({
    // color: 0xff0000, // red
    map: bakedTexture,
  });

  // materials for pole lights meshes and portal mesh
  const poleLampMaterial = new THREE.MeshBasicMaterial({
    color: 0xfffdfb, // extracted it from render image in figma
  });
  const portalMaterial = new THREE.MeshBasicMaterial({
    color: 0xf8eff0,
    side: THREE.DoubleSide,
  });

  // "lee perry-smith head"
  // gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  // gltfLoader.load("/models/head_lee_perry_smith/scene.gltf", (gltf) => {
  // my portal model
  gltfLoader.load(
    "/models/portal/scene.glb",
    (gltf) => {
      console.log("model loaded");

      // console.log({ gltf });

      // gltf.scene.position.y = -4;
      // gltf.scene.position.y = -1;

      gui
        .add(parameters, "rotate model")
        .onChange((a: number) => {
          gltf.scene.rotation.y = Math.PI * a;
        })
        .min(0)
        .max(2);

      // we do not need this anymore
      /* gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          
          child.material = bakedMaterial;
        
        }
      }); */
      // we ca ndo this (ans we will add ,aterial bellow)
      const bakedObject = gltf.scene.children.find((child) => {
        if (child instanceof THREE.Mesh) {
          return child.name === "baked";
        }
      });
      //
      const poleLampGlassMeshOne = gltf.scene.children.find((child) => {
        if (child instanceof THREE.Mesh) {
          return child.name === "LampGlassOne";
        }
      });
      const poleLampGlassMeshTwo = gltf.scene.children.find((child) => {
        if (child instanceof THREE.Mesh) {
          return child.name === "LampGlassTwo";
        }
      });
      const portalCircleMesh = gltf.scene.children.find((child) => {
        if (child instanceof THREE.Mesh) {
          return child.name === "PortalCircle";
        }
      });
      // andd we do this
      if (bakedObject instanceof THREE.Mesh)
        bakedObject.material = bakedMaterial;
      // ------

      if (poleLampGlassMeshOne instanceof THREE.Mesh)
        poleLampGlassMeshOne.material = poleLampMaterial;
      if (poleLampGlassMeshTwo instanceof THREE.Mesh)
        poleLampGlassMeshTwo.material = poleLampMaterial;
      if (portalCircleMesh instanceof THREE.Mesh)
        portalCircleMesh.material = portalMaterial;

      scene.add(gltf.scene);
    },

    (progress) => {
      console.log(
        "Loading progress:",
        (progress.loaded / progress.total) * 100 + "%"
      );
    },
    (error) => {
      console.error("Error loading model:", error);
    }
  );

  // ----------------- Particles (fireflies) ---------------------
  // -------------------------------------------------------------
  //

  const firefliesGeometry = new THREE.BufferGeometry();
  const firefliesCount = 30;
  const positionArray = new Float32Array(firefliesCount * 3);

  for (let i = 0; i < firefliesCount; i++) {
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
    // positionArray[i * 3 + 0] = Math.random() * 4;
    // positionArray[i * 3 + 1] = Math.random() * 2;
    positionArray[i * 3 + 1] = Math.random() * 1.5;
    // positionArray[i * 3 + 1] = Math.random() * 4;
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
    // positionArray[i * 3 + 2] = Math.random() * 4;
  }

  // console.log({ positionArray });

  firefliesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );

  const firefliesMaterial = new THREE.ShaderMaterial({
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,

    uniforms: {
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },

      uSize: { value: parameters.size },
    },
    // we set this
    transparent: true,
  });

  const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);

  scene.add(fireflies);

  gui
    .add(parameters, "size")
    .min(10)
    .max(500)
    .step(1)
    .onChange((size: number) => {
      console.log({ size });
      firefliesMaterial.uniforms.uSize.value = size;
      // works without this also
      // firefliesMaterial.needsUpdate = true;
    })
    .name("uSize (particle size)");

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------

  // ----------------------------------------------
  // ----------------------------------------------
  // Meshes, Geometries, Materials
  // ----------------------------------------------
  // ----------------------------------------------

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // ------------------------- LIGHTS ----------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  /**
   * @description Directional light
   */
  /*  const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
  directionalLight.position.set(-4, 6.5, 2.5);
  scene.add(directionalLight);

  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
  );

  directionalLightCameraHelper.visible = false;

  directionalLight.target.position.set(0, 2, 0);

  scene.add(directionalLightCameraHelper); */

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------

  // ----------------------------------------------
  // ----------------------------------------------
  // ----------------------------------------------
  // ----------------------------------------------

  // -------- Controls and helpers

  const orbit_controls = new OrbitControls(camera, canvas);
  orbit_controls.enableDamping = true;

  // ----------------------------------------------
  // ----------------------------------------------

  // -------------- RENDERER
  // ----------------------------------
  const renderer = new THREE.WebGLRenderer({
    canvas,
    //To make the edges of the objects more smooth (we are setting this in this lesson)
    antialias: true,
    // alpha: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  gui.addColor(parameters, "clearColor").onChange((color: string) => {
    renderer.setClearColor(
      new THREE.Color(/* parameters.clearColor */ color),
      1
    );
  });
  renderer.setClearColor(new THREE.Color(parameters.clearColor), 1);

  // maybe this should be only inside       tick

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // -------------- SHADOWS ----------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ------------- TONE MAPPING ------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  /**
   * Event Listeners
   */

  window.addEventListener("resize", (e) => {
    console.log("resizing");
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // updating the firefliesMaterial
    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "h") {
      gui.show(gui._hidden);
    }
  });

  const mouse = new THREE.Vector2();
  window.addEventListener("mousemove", (_event) => {
    mouse.x = (_event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(_event.clientY / sizes.height) * 2 + 1;

    // console.log({ mouse });
  });

  /* window.addEventListener("dblclick", () => {
    console.log("double click");

    // handling safari
    const fullscreenElement =
      // @ts-ignore webkit
      document.fullscreenElement || document.webkitFullScreenElement;
    //

    // if (!document.fullscreenElement) {
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        // go fullscreen
        canvas.requestFullscreen();

        // @ts-ignore webkit
      } else if (canvas.webkitRequestFullScreen) {
        // @ts-ignore webkit
        canvas.webkitRequestFullScreen();
      }
    } else {
      // @ts-ignore
      if (document.exitFullscreen) {
        document.exitFullscreen();

        // @ts-ignore webkit
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore webkit
        document.webkitExitFullscreen();
      }
    }
  }); */

  // ---------------------- TICK -----------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------

  const clock = new THREE.Clock();

  /**
   * @description tick
   */
  function tick() {
    // for dumping to work
    orbit_controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  tick();
}

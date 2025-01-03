import * as THREE from "three";

import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";

// Improving performances

// We did some performance mistakes in the previous lessons
// We will fix them in this lesson

// monitoring
// We will use Spector.js to monitor the performance of our application
// there is extension for chrome and firefox
// and we also add it as a dependency in our project
// https://github.com/BabylonJS/Spector.js/

// we may not need this since we are using chrome extension
// this would befallback if extension is not available

// ts-expect-error no types
// import * as SPECTOR from "spectorjs";

// console.log({ SPECTOR });

// const spector = new SPECTOR.Spector();
// console.log({ spector });
// spector.displayUI()

// after checking the monitorings
// we see that our model is constructed of too many geometries
// we can merge all the baked objects into one geometry
// that will be drawn in one call

// for example all planks and all trunks can be merged into one geometry
// but we can do more

// - first we will open blender
// - we will make all emission collection as un-selectable
// - we will create empty collection called "merged"

// - select all the object (except the emission objects
// and except camera and light)

// - duplicate them
// - put them into the "merged" collection
// - merge them with CTRL + J
// - rename the object to "baked" (I'm taking about single object in `merged` collection you created)

// - decativate all other collectons except "merged" (just unchecked the eye icon)
// - also you don't need to deactivate the "emission" collection
//   since we want to go into render mode to see how scene will look
// - scene looks like it should be, liek it looked before

// - but this is bad since we have bunch of materials
//   apply the material to the single object

// - remove the materials (not mandatory)
//    I did it (minus sign in materials tab)
// but why is this not mandatory?
// becausee when we are exporting, maybe you remebered that
// we are not exporting materials at all
// you will see that when you next time export the model
// you will see what is uncheked, and we did uncheck materials

// now in render mode I see that object have uniform color

// we don't need materials since we are using texture

// - you can now export
//  selected the "bakded" object in merged collection)
// and select objects from "emission" collection

// and use newly exported file as our static/models/portal/scene.glb

// start your dev server, and after you see the model
// you can run Spectator.js extension again

// you will see that this time you only have onlt
// 4 `drawElements` calls, for two lamps, for portal circle
// and for your merged object

// beforem we had 206 comands executed, but now you will see
// that we only have 16 comands (you can see this in spectors commands tab)

// We could have also merged the lamps and portal circle
// but I didn't do that sice we have materials with different colors
// for them, and as you remeber they are not covered by the texture

// last change we can make is that we do not traverse the scene at
// all

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
  camera.position.set(4, 1, 4);
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
      console.log({ t });
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
      gltf.scene.position.y = -1;

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

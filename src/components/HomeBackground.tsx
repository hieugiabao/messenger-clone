import React, { useEffect } from "react";
import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  TetrahedronGeometry,
  WebGLRenderer,
} from "three";

const HomeBackground = () => {
  let renderer: WebGLRenderer,
    scene: Scene,
    camera: PerspectiveCamera,
    particle: Object3D;
  function init() {
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(
      window.devicePixelRatio ? window.devicePixelRatio : 1
    );
    renderer.setSize(window.innerWidth - 20, window.innerHeight);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    document.getElementById("home-canvas")?.appendChild(renderer.domElement);

    scene = new Scene();

    camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 400;
    scene.add(camera);

    particle = new Object3D();

    scene.add(particle);

    var geometry = new TetrahedronGeometry(2, 0);
    // var geom = new IcosahedronGeometry(5, 1);
    // var geom2 = new IcosahedronGeometry(15, 1);
    var material = new MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
    });

    for (var i = 0; i < 1000; i++) {
      var mesh = new Mesh(geometry, material);
      mesh.position
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize();
      mesh.position.multiplyScalar(90 + Math.random() * 700);
      mesh.rotation.set(
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2
      );
      particle.add(mesh);
    }

    var ambientLight = new AmbientLight(0x999999);
    scene.add(ambientLight);

    var lights = [];
    lights[0] = new DirectionalLight(0xcc9933, 1);
    lights[0].position.set(1, 0, 0);
    lights[1] = new DirectionalLight(0xff9933, 1);
    lights[1].position.set(0.75, 1, 0.5);
    lights[2] = new DirectionalLight(0x880000, 1);
    lights[2].position.set(-0.75, -1, 0.5);
    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
  }

  function animate() {
    requestAnimationFrame(animate);

    particle.rotation.x += 0.0;
    particle.rotation.y -= 0.004;
    renderer.clear();

    renderer.render(scene, camera);
  }
  useEffect(() => {
    init();
    animate();
  }, []);

  return <div id="home-canvas"></div>;
};

export default HomeBackground;

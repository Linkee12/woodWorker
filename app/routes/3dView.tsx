import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
type ThreeDViewProps = {
  scene: THREE.Scene<THREE.Object3DEventMap>;
  models: THREE.Object3D[];
};
export default function ThreeDView({ scene, models }: ThreeDViewProps) {
  const modelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    for (const model of models) {
      if (!scene.children.includes(model)) {
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });

        scene.add(model);
      }
    }
  }, [models, scene]);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    if (!modelRef.current) return;
    const container = modelRef.current;

    const previousBackground = scene.background;
    scene.background = new THREE.Color("#e9ede7");

    const camera = new THREE.PerspectiveCamera(20, 1, 10, 20000);
    camera.up.set(0, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute(
      "aria-label",
      "Forgatható szekrénymodell, 3D nézet",
    );
    container.appendChild(renderer.domElement);

    const bounds = new THREE.Box3();
    for (const model of models) {
      bounds.expandByObject(model);
    }

    if (bounds.isEmpty()) {
      bounds.set(
        new THREE.Vector3(-500, -500, 0),
        new THREE.Vector3(500, 500, 1000),
      );
    }

    const center = bounds.getCenter(new THREE.Vector3());
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(4000, 4000),
      new THREE.MeshStandardMaterial({ color: "#e0e5dc", roughness: 1 }),
    );
    floor.position.set(center.x, center.y, bounds.min.z - 2);
    floor.receiveShadow = true;
    scene.add(floor);

    const ambient = new THREE.HemisphereLight("#fff8ed", "#8c9b8b", 2);
    ambient.position.set(0, 0, 4000);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight("#fff5e6", 3);
    keyLight.position.copy(center).add(new THREE.Vector3(-1800, -2500, 4000));
    keyLight.target.position.copy(center);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -2200;
    keyLight.shadow.camera.right = 2200;
    keyLight.shadow.camera.top = 2200;
    keyLight.shadow.camera.bottom = -2200;
    keyLight.shadow.camera.near = 100;
    keyLight.shadow.camera.far = 8000;
    keyLight.shadow.normalBias = 2;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight, keyLight.target);

    const fillLight = new THREE.DirectionalLight("#e4edf1", 1.2);
    fillLight.position.copy(center).add(new THREE.Vector3(2200, 1000, 1800));
    fillLight.target.position.copy(center);
    scene.add(fillLight, fillLight.target);
    const size = bounds.getSize(new THREE.Vector3());
    const modelRadius = size.length() / 2;
    const viewDirection = new THREE.Vector3(-1.4, -2.3, 1.4).normalize();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.copy(center);
    controls.minDistance = modelRadius * 1.3;
    controls.maxDistance = 7000;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.screenSpacePanning = false;

    let initialView = true;
    const onResize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (initialView) {
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov =
          2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
        const distance =
          (modelRadius / Math.sin(Math.min(verticalFov, horizontalFov) / 2)) *
          1.5;
        camera.position.copy(center).addScaledVector(viewDirection, distance);
        controls.maxDistance = Math.max(7000, distance * 1.5);
        controls.update();
        initialView = false;
      }
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    onResize();

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    cleanup = () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();

      scene.remove(
        floor,
        ambient,
        keyLight,
        keyLight.target,
        fillLight,
        fillLight.target,
      );
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      keyLight.shadow.dispose();

      renderer.dispose();
      renderer.domElement.remove();
    };

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [scene]);

  return <div ref={modelRef} className="flex-1" />;
}

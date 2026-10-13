import * as THREE from "three";

export function createLeg(
  position: { x: number; y: number; z: number },
  length: number = 100, // teljes magasság mm-ben (a korong aljától a tányér tetejéig)
) {
  const group = new THREE.Group();
  group.name = "leg";

  const plastic = new THREE.MeshStandardMaterial({
    color: 0xf2f2f2,
    roughness: 0.55,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x2b2b2b,
    roughness: 0.6,
    side: THREE.DoubleSide,
  });

  // --- Méretek a rajz alapján ---
  const knobH = 18; // recézett állítókorong magassága
  const knobR = 25; // Ø50
  const plateH = 3; // felső tányér vastagsága
  const plateR = 30; // Ø60
  const cupH = 22; // pohár magassága (a tányérral együtt)
  const cupR = 25; // Ø50
  const cupCapH = 2; // pohár alsó fedelének vastagsága
  const sleeveR = 15; // hüvely Ø30
  const rodR = 10; // menetes szár Ø14
  const gapBelowSleeve = 3; // rés a korong és a hüvely között
  const windowH = 35; // ablak magassága a hüvely alján

  const cupBottom = length - cupH;
  const sleeveBottom = knobH + gapBelowSleeve;
  const windowTop = sleeveBottom + windowH;

  // --- Recézett állítókorong ---
  const teeth = 40;
  const knobShape = new THREE.Shape();
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? knobR : knobR - 1.2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) knobShape.moveTo(x, y);
    else knobShape.lineTo(x, y);
  }
  knobShape.closePath();
  const knobGeo = new THREE.ExtrudeGeometry(knobShape, {
    depth: knobH,
    bevelEnabled: false,
  });
  knobGeo.rotateX(-Math.PI / 2);
  const knob = new THREE.Mesh(knobGeo, dark);
  knob.name = "leg-knob";
  group.add(knob);

  // --- Menetes szár ---
  const rodTop = Math.min(windowTop + 15, cupBottom - 2);
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(rodR - 0.8, rodR - 0.8, rodTop - knobH, 24),
    plastic,
  );
  core.position.y = (knobH + rodTop) / 2;
  group.add(core);

  const threadProfile: THREE.Vector2[] = [];
  for (let y = knobH; y < rodTop; y += 2) {
    threadProfile.push(new THREE.Vector2(rodR, y));
    threadProfile.push(new THREE.Vector2(rodR - 0.8, y + 1));
  }
  const rod = new THREE.Mesh(
    new THREE.LatheGeometry(threadProfile, 24),
    plastic,
  );
  rod.name = "leg-rod";
  group.add(rod);

  // --- Hüvely felső része (zárt) ---
  const sleeveUpH = 70;
  const sleeveUp = new THREE.Mesh(
    new THREE.CylinderGeometry(sleeveR, sleeveR, sleeveUpH, 32, 1),
    plastic,
  );
  sleeveUp.position.y = 60;
  sleeveUp.name = "leg-sleeve";
  group.add(sleeveUp);

  // --- Pohár oldala ---
  const cupWallH = cupH - plateH;
  const cupWall = new THREE.Mesh(
    new THREE.CylinderGeometry(cupR, cupR, cupWallH, 48, 1, true),
    plastic,
  );
  cupWall.position.y = cupBottom + cupWallH / 2;
  cupWall.name = "leg-cup";
  group.add(cupWall);

  // --- Pohár alsó fedele (itt megy bele a hüvely, ez zárja le) ---
  const cupCap = new THREE.Mesh(
    new THREE.CylinderGeometry(cupR, cupR, cupCapH, 48),
    plastic,
  );
  cupCap.position.y = cupBottom + cupCapH / 2;
  cupCap.name = "leg-cup-cap";
  group.add(cupCap);

  // --- Felső tányér ---
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(plateR, plateR, plateH, 64),
    plastic,
  );
  plate.position.y = length - plateH / 2;
  plate.name = "leg-plate";
  group.add(plate);
  group.position.set(position.x, position.y, position.z);
  return group.rotateX(Math.PI / 2).translateY(-100);
}

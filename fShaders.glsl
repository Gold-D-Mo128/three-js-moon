uniform sampler2D texture;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(texture, vUv);
}


  loader.load("./assets/scene.gltf", (gltf) => {
    const model = gltf.scene;

    // model.traverse((child) => {
    //   if (child.isMesh) {
    //     // Check if the child is a mesh
    //     const mesh = child;
    //     if (mesh.material) {
    //       // Check if the mesh has a material
    //       const material = mesh.material;

    //       // Set the metalness value of the material
    //       material.metalness = 1;
    //       material.shininess = 2;
    //       material.roughness = 0.5;
    //       material.color.set(0xffffff);
    //       material.emissive.set(0x000000);
    //       material.reflectivity = 1;
    //     }
    //   }
    // });

    model.traverse((child) => {
      if (child.isMesh) {
        const mesh = child;
        if (mesh.material) {
          const material = mesh.material;

          // Set material properties
          material.metalness = 1;
          material.shininess = 2;
          material.roughness = 0.5;
          material.emissive.set(0x000000);
          material.reflectivity = 1;

          // Store the original color for reference
          const originalColor = new THREE.Color(0xffffff);

          // Define animation variables
          let time = 0;

          // Define an animation loop
          function animateColors() {
            // Calculate new color values based on time
            const r = Math.sin(time) * 0.5 + 0.5; // Red component
            const g = Math.cos(time) * 0.5 + 0.5; // Green component
            const b = Math.sin(time + 2.0) * 0.5 + 0.5; // Blue component

            // Update the material's color
            material.color.setRGB(r, g, b);

            // Increment time for the next frame
            time += 0.005; // Adjust the speed of color change

            // Request the next frame
            requestAnimationFrame(animateColors);

            // Render the scene with the updated material
            renderer.render(scene, camera);
          }

          // Start the color animation loop
          animateColors();
        }
      }
    });

    // Adjust the model's scale, position, and rotation as needed
    model.scale.set(8, 8, 8);
    model.position.set(0, -5, 0);
    model.rotation.set(0, 0, 0);

    // Add the model to the scene
    scene.add(model);

    // Call the animate function to start rendering
    animate();
  });
# MARC Hero Animation

The homepage hero uses a procedural Three.js scene embedded in `src/pages/index.astro`.
It includes stylized human and robotic hands, a pulsing orange energy ring, botanical accents,
responsive sizing, and a reduced-motion preference. It does not require external 3D model files.

After pulling the branch, run `npm install` to install the new `three` dependency, then `npm run dev`.
The procedural hands are stylized meshes rather than photorealistic downloaded models; realistic
model assets would be needed to match the Pinterest reference closely.

# MARC Hero Animation

The homepage hero background is a particle sphere: a slowly rotating cloud of dots with a sparse
hollow core and ripples travelling across its outer shell. It lives in
`src/components/HeroParticles.astro` and is placed in the hero of `src/pages/index.astro`.

- Drawn on a plain 2D canvas, so it needs no extra libraries (the `three` dependency is no longer used by the homepage).
- Follows the site theme: blue, light-blue and maroon dots in light mode (`marc`), and white and blue dots in dark mode (`marc-dark`). It updates live when the navbar theme toggle is used.
- Reacts gently to the pointer (parallax).
- Pauses when the hero is off screen or the tab is hidden, uses fewer dots on small screens, and shows a single still frame when the visitor prefers reduced motion.

To tune the look, edit the constants at the top of the `<script>` in `HeroParticles.astro`:
`PALETTES` (colours), `WEIGHTS` (colour mix), `COUNT` (number of dots), and the rotation speed (`t * 0.12`).

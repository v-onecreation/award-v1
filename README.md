# V One Presents – YouTubers Awards
Static site. Run with any local server (e.g. `npx serve .` or VS Code Live Server). Do not open index.html via file:// (fonts and CDN libs work, but a server is safer).
- Photos: put image paths in the `photos` array at the top of js/main.js (one per journey scene). Captions/years: edit index.html `.scene` blocks.
- Categories/nominees: `cats` array in js/main.js. Votes are not saved yet: connect `#submit` to your backend.
- Sponsor logos: replace the `.logo` divs in index.html with <img> tags.
- 3D trophy: procedural gold model in js/main.js. To use your own model, load a .glb with GLTFLoader and replace the group `g`.
- Libraries (CDN): GSAP 3.12.5 + ScrollTrigger, three.js r128, Lenis 1.1.13.

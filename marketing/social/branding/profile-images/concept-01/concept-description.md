# Concept 01 — Vault Tile ⭐ recommended

The KitVault mark as it already exists: the green tile with a dark geometric **K** and the "vault
bar" underneath. It's the same geometry as `app/icon.svg` (the site's favicon) and the logo in
`components/Brand.tsx`.

- **Why it works:** Someone who sees the avatar on Instagram and then opens kitvault.dev sees the
  same mark in the header and the browser tab. One solid shape, maximum contrast (#0d0d0f on
  #4ade80). It holds up at 32px.
- **Variants:**
  - `master-fullbleed.png`: the whole avatar is the tile. The K is as large as it can be, for
    circular avatars.
  - `master-dark.png` / `master-light.png`: the tile sitting on a dark or light field.
- **Weakness:** A single letter says nothing about football on its own. The bio and the content
  have to do that.
- **Circle-safe:** yes. In the full-bleed version the K and the bar sit inside the inscribed
  circle, and in the tile versions the tile's corners stay inside it.

"""Builds every KitVault profile image from vector sources.

The K geometry is the one in app/icon.svg (the site's favicon), so the
avatars and the browser tab stay the same mark. Needs rsvg-convert and
ImageMagick (`magick`). Run from anywhere:

    python3 marketing/social/branding/profile-images/source/build.py
"""

import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "source"
FINAL = ROOT / "final"

BG = "#0d0d0f"
INK = "#f5f5f7"
ACCENT = "#4ade80"
# Darker brand green (the map ramp's family) for light backgrounds, where
# #4ade80 is too pale to hold a thin shape.
ACCENT_ON_LIGHT = "#16a34a"
LIGHT_BG = "#f5f5f7"

# --- Geometry, in the favicon's 32-unit space -------------------------------

# The K from app/icon.svg: stem + both arms as one polygon.
K_STEM = (8.4, 7, 3.9, 15)
K_ARMS = "M11.6 15.1 L18.9 7 L23.7 7 L16.1 15.2 L24 22 L19 22 Z"
K_BOX = (8.4, 7, 24, 22)  # x0, y0, x1, y1


def k_shape(fill, dx=0.0):
    x, y, w, h = K_STEM
    return (
        f'<g fill="{fill}" transform="translate({dx} 0)">'
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}"/>'
        f'<path d="{K_ARMS}"/></g>'
    )


def v_shape(fill, dx=0.0):
    # Same cap height (7..22) and width (15.6) as the K, strokes ~3.9 thick.
    x0 = 8.4
    pts = [
        (x0 + 0.0, 7), (x0 + 4.1, 7), (x0 + 7.8, 18.2),
        (x0 + 11.5, 7), (x0 + 15.6, 7), (x0 + 10.0, 22), (x0 + 5.6, 22),
    ]
    d = "M" + " L".join(f"{px} {py}" for px, py in pts) + " Z"
    return f'<path fill="{fill}" transform="translate({dx} 0)" d="{d}"/>'


def svg(body, bg=None, size=1024):
    rect = f'<rect width="{size}" height="{size}" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
        f'viewBox="0 0 {size} {size}">{rect}{body}</svg>'
    )


def fit(inner, box, scale, size=1024):
    """Centre `inner` (drawn in 32-unit space, bbox `box`) at `scale`."""
    x0, y0, x1, y1 = box
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    tx, ty = size / 2 - cx * scale, size / 2 - cy * scale
    return f'<g transform="translate({tx:.2f} {ty:.2f}) scale({scale})">{inner}</g>'


# --- Concept 01: Vault Tile (the favicon mark) ------------------------------

def tile_mark(tile_fill, k_fill, bar_fill, bar_opacity):
    return (
        f'<rect width="32" height="32" rx="4" fill="{tile_fill}"/>'
        + k_shape(k_fill)
        + f'<rect x="4" y="25.5" width="24" height="2" rx="1" fill="{bar_fill}" opacity="{bar_opacity}"/>'
    )


def c1_tile(bg):
    # Tile at 600px: its corners stay inside a circular crop (radius 512).
    return svg(fit(tile_mark(ACCENT, BG, BG, 0.4), (0, 0, 32, 32), 600 / 32), bg)


def c1_fullbleed():
    # Whole avatar is the tile: biggest possible K for tiny circular avatars.
    inner = k_shape(BG) + f'<rect x="8.4" y="25.5" width="15.6" height="2" rx="1" fill="{BG}" opacity="0.4"/>'
    return svg(fit(inner, (8.4, 7, 24, 27.5), 26), ACCENT)


# --- Concept 02: KV monogram --------------------------------------------------

KV_GAP = 2.2
KV_BOX = (8.4, 7, 24 + 15.6 + KV_GAP, 27.5)


def kv_inner(k_fill, v_fill, bar_fill, bar_opacity):
    return (
        k_shape(k_fill)
        + v_shape(v_fill, dx=15.6 + KV_GAP)
        + f'<rect x="8.4" y="25.5" width="{15.6 * 2 + KV_GAP}" height="2" rx="1" '
        f'fill="{bar_fill}" opacity="{bar_opacity}"/>'
    )


def c2_dark():
    return svg(fit(kv_inner(INK, ACCENT, ACCENT, 0.9), KV_BOX, 20), BG)


def c2_light():
    return svg(fit(kv_inner(BG, ACCENT_ON_LIGHT, ACCENT_ON_LIGHT, 0.9), KV_BOX, 20), LIGHT_BG)


def c2_transparent():
    # A dark rounded tile keeps the white K readable on any background.
    tile = f'<rect x="{512 - 330}" y="{512 - 330}" width="660" height="660" rx="82" fill="{BG}"/>'
    return svg(tile + fit(kv_inner(INK, ACCENT, ACCENT, 0.9), KV_BOX, 14))


# --- Concept 03: Kit Crest (shirt silhouette + K) -------------------------------

SHIRT = (
    "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47"
    "a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 "
    ".99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
)


def c3(bg):
    # Shirt from lucide (the icon the app already uses), K knocked out of the chest.
    k = k_shape(BG if bg != LIGHT_BG else LIGHT_BG)
    k_in_chest = f'<g transform="translate(12 13.6) scale(0.42) translate(-16.2 -14.5)">{k}</g>'
    body = (
        f'<g transform="translate(512 512) scale(30) translate(-12 -12)">'
        f'<path d="{SHIRT}" fill="{ACCENT}"/>{k_in_chest}</g>'
    )
    return svg(body, bg)


# --- Rendering -----------------------------------------------------------------

def render(svg_text, out, size=1024):
    out.parent.mkdir(parents=True, exist_ok=True)
    src = SRC / "svg" / f"{out.parent.name}-{out.stem}.svg"
    src.parent.mkdir(parents=True, exist_ok=True)
    src.write_text(svg_text)
    subprocess.run(
        ["rsvg-convert", "-w", str(size), "-h", str(size), "-o", str(out), str(src)],
        check=True,
    )


def resize(src, out, size):
    subprocess.run(
        ["magick", str(src), "-filter", "Lanczos", "-resize", f"{size}x{size}",
         "-strip", str(out)],
        check=True,
    )


def preview(master_dark, master_light, out, title):
    """Master + circular crops at real avatar sizes on dark and light UIs."""
    tmp = SRC / "tmp"
    tmp.mkdir(exist_ok=True)
    parts = []
    for name, master, ui in (("d", master_dark, "#000000"), ("l", master_light, "#ffffff")):
        for s in (160, 64, 32):
            c = tmp / f"{out.parent.name}-{name}-{s}.png"
            subprocess.run(
                ["magick", str(master), "-resize", f"{s}x{s}",
                 "(", "-size", f"{s}x{s}", "xc:black", "-fill", "white",
                 "-draw", f"circle {s/2 - 0.5},{s/2 - 0.5} {s/2 - 0.5},0", ")",
                 "-alpha", "off", "-compose", "CopyOpacity", "-composite", str(c)],
                check=True,
            )
            parts.append((name, s, c, ui))
    cmd = ["magick", "-size", "1600x1000", "xc:#16161a",
           str(master_dark), "-geometry", "760x760+60+180", "-composite",
           "-fill", "#1f1f25", "-draw", "rectangle 880,180 1540,540",
           "-fill", "#ffffff", "-draw", "rectangle 880,580 1540,940"]
    for name, s, c, _ in parts:
        y = 180 if name == "d" else 580
        x = {160: 920, 64: 1130, 32: 1240}[s]
        cmd += [str(c), "-geometry", f"+{x}+{y + 180 - s // 2}", "-composite"]
    cmd += ["-fill", INK, "-pointsize", "40", "-annotate", "+60+110", title,
            "-fill", "#8a8a96", "-pointsize", "22",
            "-annotate", "+880+160", "On a dark UI — 160 / 64 / 32 px",
            "-annotate", "+880+570", "On a light UI — 160 / 64 / 32 px",
            str(out)]
    subprocess.run(cmd, check=True)


def main():
    # Concept masters
    render(c1_tile(BG), ROOT / "concept-01/master-dark.png")
    render(c1_tile(LIGHT_BG), ROOT / "concept-01/master-light.png")
    render(c1_fullbleed(), ROOT / "concept-01/master-fullbleed.png")
    render(c2_dark(), ROOT / "concept-02/master-dark.png")
    render(c2_light(), ROOT / "concept-02/master-light.png")
    render(c3(BG), ROOT / "concept-03/master-dark.png")
    render(c3(LIGHT_BG), ROOT / "concept-03/master-light.png")

    preview(ROOT / "concept-01/master-fullbleed.png", ROOT / "concept-01/master-light.png",
            ROOT / "concept-01/preview.png", "Concept 01 — Vault Tile")
    preview(ROOT / "concept-02/master-dark.png", ROOT / "concept-02/master-light.png",
            ROOT / "concept-02/preview.png", "Concept 02 — KV Monogram")
    preview(ROOT / "concept-03/master-dark.png", ROOT / "concept-03/master-light.png",
            ROOT / "concept-03/preview.png", "Concept 03 — Kit Crest")

    # Finals: main = concept 01, monogram = concept 02
    render(c1_tile(BG), FINAL / "kitvault-profile-main-dark-1024.png")
    render(c1_tile(LIGHT_BG), FINAL / "kitvault-profile-main-light-1024.png")
    render(c1_tile(None), FINAL / "kitvault-profile-main-transparent-1024.png")
    render(c1_fullbleed(), FINAL / "kitvault-profile-main-fullbleed-1024.png")
    render(c2_dark(), FINAL / "kitvault-profile-monogram-dark-1024.png")
    render(c2_light(), FINAL / "kitvault-profile-monogram-light-1024.png")
    render(c2_transparent(), FINAL / "kitvault-profile-monogram-transparent-1024.png")

    # Platform uploads: the full-bleed tile, at each platform's recommended size.
    fb = FINAL / "kitvault-profile-main-fullbleed-1024.png"
    for name, size in (("instagram", 1024), ("tiktok", 1024), ("x", 400),
                       ("linkedin", 400), ("github", 500), ("producthunt", 240)):
        resize(fb, FINAL / f"{name}-profile.png", size)

    for p in (SRC / "tmp").glob("*.png"):
        p.unlink()
    (SRC / "tmp").rmdir()


if __name__ == "__main__":
    main()

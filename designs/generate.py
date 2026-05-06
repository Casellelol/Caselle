#!/usr/bin/env python3
"""
Generate Quiet Luxury phone case designs for Caselle.
Output: 1800x2400px PNG files ready for Printify upload.
"""
import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
W, H = 1800, 2400

def save(img, name):
    path = os.path.join(OUTPUT_DIR, f"{name}.png")
    img.save(path, "PNG", dpi=(300, 300))
    print(f"  ✓ {name}.png")
    return path

def solid(color, name):
    img = Image.new("RGB", (W, H), color)
    return save(img, name)

def gradient(color_top, color_bottom, name):
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        r = int(color_top[0] + (color_bottom[0] - color_top[0]) * t)
        g = int(color_top[1] + (color_bottom[1] - color_top[1]) * t)
        b = int(color_top[2] + (color_bottom[2] - color_top[2]) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))
    return save(img, name)

def marble(base, vein_color, name, dark=False):
    random.seed(42 if not dark else 99)
    img = Image.new("RGB", (W, H), base)
    draw = ImageDraw.Draw(img)

    # Draw multiple vein layers
    for _ in range(80):
        x = random.randint(0, W)
        y = random.randint(0, H)
        length = random.randint(200, 1200)
        angle = random.uniform(-0.4, 0.4)
        alpha = random.randint(30, 120)
        width = random.randint(1, 4)

        points = []
        cx, cy = x, y
        for i in range(length // 10):
            angle += random.uniform(-0.15, 0.15)
            cx += math.cos(angle) * 10
            cy += math.sin(angle) * 10
            points.append((cx, cy))

        if len(points) >= 2:
            r = int(vein_color[0] * alpha / 255 + base[0] * (255 - alpha) / 255)
            g = int(vein_color[1] * alpha / 255 + base[1] * (255 - alpha) / 255)
            b = int(vein_color[2] * alpha / 255 + base[2] * (255 - alpha) / 255)
            for i in range(len(points) - 1):
                draw.line([points[i], points[i+1]], fill=(r, g, b), width=width)

    # Soften
    img = img.filter(ImageFilter.GaussianBlur(radius=1.5))

    # Add subtle noise texture
    import numpy as np
    arr = np.array(img, dtype=np.int16)
    noise = np.random.randint(-8, 8, arr.shape, dtype=np.int16)
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr)

    return save(img, name)

def linen_texture(base, name):
    """Fine woven textile look."""
    import numpy as np
    img = Image.new("RGB", (W, H), base)
    arr = np.array(img, dtype=np.int16)

    # Horizontal weave lines
    for y in range(H):
        if y % 4 == 0:
            arr[y, :, :] = np.clip(arr[y, :, :] - 12, 0, 255)
    # Vertical weave lines
    for x in range(W):
        if x % 4 == 0:
            arr[:, x, :] = np.clip(arr[:, x, :] - 8, 0, 255)

    noise = np.random.randint(-6, 6, arr.shape, dtype=np.int16)
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr)
    img = img.filter(ImageFilter.GaussianBlur(radius=0.3))
    return save(img, name)

def diagonal_gradient(c1, c2, c3, name):
    """Three-stop diagonal gradient."""
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    for y in range(H):
        for x in range(0, W, 4):
            t = (x / W * 0.4 + y / H * 0.6)
            if t < 0.5:
                tt = t / 0.5
                r = int(c1[0] + (c2[0] - c1[0]) * tt)
                g = int(c1[1] + (c2[1] - c1[1]) * tt)
                b = int(c1[2] + (c2[2] - c1[2]) * tt)
            else:
                tt = (t - 0.5) / 0.5
                r = int(c2[0] + (c3[0] - c2[0]) * tt)
                g = int(c2[1] + (c3[1] - c2[1]) * tt)
                b = int(c2[2] + (c3[2] - c2[2]) * tt)
            draw.line([(x, y), (min(x+4, W), y)], fill=(r, g, b))
    return save(img, name)

def watercolor_wash(base, accent, name):
    """Soft watercolor-style wash."""
    import numpy as np
    img = Image.new("RGB", (W, H), base)
    draw = ImageDraw.Draw(img)
    random.seed(7)

    for _ in range(25):
        cx = random.randint(0, W)
        cy = random.randint(0, H)
        rx = random.randint(200, 600)
        ry = random.randint(200, 800)
        alpha = random.randint(15, 50)
        r = int(accent[0] * alpha / 100 + base[0] * (100 - alpha) / 100)
        g = int(accent[1] * alpha / 100 + base[1] * (100 - alpha) / 100)
        b = int(accent[2] * alpha / 100 + base[2] * (100 - alpha) / 100)
        draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(r, g, b))

    img = img.filter(ImageFilter.GaussianBlur(radius=40))

    arr = np.array(img, dtype=np.int16)
    noise = np.random.randint(-10, 10, arr.shape, dtype=np.int16)
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    return save(img, name)

print("Generating Caselle designs...")

# 1. White Marble
marble((245, 241, 236), (180, 170, 160), "marble-white", dark=False)

# 2. Black Marble
marble((28, 28, 28), (90, 85, 80), "marble-black", dark=True)

# 3. Sage Green — linen texture
linen_texture((143, 175, 138), "sage-green")

# 4. Dusty Rose — watercolor wash
watercolor_wash((218, 195, 190), (190, 140, 135), "dusty-rose")

# 5. Midnight Navy — subtle gradient
gradient((20, 30, 58), (28, 43, 74), "midnight-navy")

# 6. Champagne Gold — diagonal 3-stop
diagonal_gradient((220, 195, 140), (201, 169, 110), (180, 148, 88), "champagne-gold")

# 7. Cloud Grey — linen texture
linen_texture((185, 183, 180), "cloud-grey")

# 8. Terracotta — watercolor wash
watercolor_wash((193, 122, 90), (160, 90, 65), "terracotta")

# 9. Lavender Mist — soft gradient
gradient((196, 183, 215), (175, 158, 200), "lavender-mist")

# 10. Obsidian — near black with subtle depth
gradient((22, 22, 22), (30, 30, 30), "obsidian")

print("\nAll 10 designs generated.")

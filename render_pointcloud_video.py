#!/usr/bin/env python3
"""
Render a rotating point cloud video from PLY file
Requirements: open3d, opencv-python, numpy
Install: pip install open3d opencv-python numpy
"""

import open3d as o3d
import numpy as np
import cv2
import os
from pathlib import Path

# Configuration
PLY_FILE = "/Users/harryjfowen/Desktop/ptw-website.ply"
OUTPUT_DIR = "/Users/harryjfowen/Software/coan-website/public/videos"
OUTPUT_VIDEO = "pointcloud-rotation.mp4"
FRAMES = 180  # 6 seconds at 30fps
IMAGE_WIDTH = 1920
IMAGE_HEIGHT = 1080
FPS = 30

print("Loading point cloud...")
pcd = o3d.io.read_point_cloud(PLY_FILE)
print(f"Loaded {len(pcd.points)} points")

# Normalize colors if they exist
if pcd.has_colors():
    colors = np.asarray(pcd.colors)
    print(f"Color range: {colors.min():.2f} - {colors.max():.2f}")

# Create visualizer
vis = o3d.visualization.Visualizer()
vis.create_window(width=IMAGE_WIDTH, height=IMAGE_HEIGHT, visible=False)
vis.add_geometry(pcd)

# Setup camera
ctr = vis.get_view_control()
ctr.set_front([0, 0, 1])
ctr.set_up([0, -1, 0])
ctr.set_lookat([0, 0, 0])

# Render params
render_option = vis.get_render_option()
render_option.point_size = 2.0
render_option.background_color = np.array([15/255, 23/255, 42/255])  # Dark blue background

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"Rendering {FRAMES} frames...")
frame_paths = []

for i in range(FRAMES):
    # Rotate camera around Z axis
    angle = (i / FRAMES) * 360
    rad = np.radians(angle)

    # Rotate view
    ctr = vis.get_view_control()
    ctr.rotate(10, 0)  # Rotate slightly each frame

    # Capture frame
    vis.poll_events()
    vis.update_renderer()

    # Screenshot
    frame_path = os.path.join(OUTPUT_DIR, f"frame_{i:04d}.png")
    vis.capture_screen_image(frame_path, do_render=True)
    frame_paths.append(frame_path)

    if (i + 1) % 30 == 0:
        print(f"  Rendered {i + 1}/{FRAMES} frames")

vis.destroy_window()

print("Creating video...")
# Create video from frames using OpenCV
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(
    os.path.join(OUTPUT_DIR, OUTPUT_VIDEO),
    fourcc,
    FPS,
    (IMAGE_WIDTH, IMAGE_HEIGHT)
)

for frame_path in frame_paths:
    frame = cv2.imread(frame_path)
    if frame is not None:
        out.write(frame)
    os.remove(frame_path)  # Clean up frame

out.release()

video_path = os.path.join(OUTPUT_DIR, OUTPUT_VIDEO)
print(f"✓ Video created: {video_path}")
print(f"  Duration: {FRAMES / FPS:.1f} seconds")
print(f"  Resolution: {IMAGE_WIDTH}x{IMAGE_HEIGHT}")

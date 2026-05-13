#!/usr/bin/env python3
"""
Render rotating point cloud video by rotating camera around fixed point cloud
"""

import open3d as o3d
import numpy as np
import cv2
import os
import struct

PLY_FILE = "/Users/harryjfowen/Desktop/ptw-website.ply"
OUTPUT_DIR = "/Users/harryjfowen/Software/coan-website/public/videos"
OUTPUT_VIDEO = "pointcloud-rotation.mp4"
FRAMES = 180
IMAGE_WIDTH = 1920
IMAGE_HEIGHT = 1080
FPS = 30

print("Loading point cloud...")
pcd = o3d.io.read_point_cloud(PLY_FILE)
print(f"Loaded {len(pcd.points)} points")

# Center the point cloud
points = np.asarray(pcd.points)
center = points.mean(axis=0)
points = points - center
pcd.points = o3d.utility.Vector3dVector(points)

# Get prediction values for coloring
with open(PLY_FILE, 'rb') as f:
    content = f.read()

header_end = content.find(b'end_header')
header_text = content[:header_end].decode('utf-8')
header_lines = header_text.split('\n')

properties = []
for line in header_lines:
    if line.startswith('property'):
        parts = line.split()
        properties.append(parts[2])

vertex_count = 0
for line in header_lines:
    if line.startswith('element vertex'):
        vertex_count = int(line.split()[2])
        break

# Parse predictions
predictions = []
header_bytes = header_end + 11
offset = header_bytes

for i in range(vertex_count):
    offset += 12  # Skip x, y, z

    for prop_name in properties[3:]:
        if prop_name == 'prediction':
            pred = struct.unpack('<f', content[offset:offset+4])[0]
            predictions.append(pred)
            offset += 4
        else:
            offset += 4

# Color based on prediction
colors = np.zeros((len(predictions), 3))
for i, pred in enumerate(predictions):
    if pred > 0.5:
        colors[i] = [1.0, 0.0, 0.0]  # Red for wood
    else:
        colors[i] = [0.0, 0.0, 0.0]  # Black for leaf

pcd.colors = o3d.utility.Vector3dVector(colors)

# Create visualizer
vis = o3d.visualization.Visualizer()
vis.create_window(width=IMAGE_WIDTH, height=IMAGE_HEIGHT, visible=False)
vis.add_geometry(pcd)

# Render params
render_option = vis.get_render_option()
render_option.point_size = 1.5
render_option.background_color = np.array([1.0, 1.0, 1.0])  # White

os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"Rendering {FRAMES} frames...")

frame_paths = []
for i in range(FRAMES):
    # First 30 frames (1 second) stay static
    # Remaining 150 frames do one slow rotation
    if i < 30:
        angle = 0
    else:
        # One rotation over remaining frames
        progress = (i - 30) / (FRAMES - 30)
        angle = progress * 360

    rad = np.radians(angle)

    # Camera position rotates around Z axis (horizontal spin)
    distance = 10
    cam_x = distance * np.cos(rad)  # Horizontal rotation left/right
    cam_y = distance * np.sin(rad)  # Horizontal rotation front/back
    cam_z = 3  # Fixed elevation

    ctr = vis.get_view_control()
    ctr.set_lookat([0, 0, 0])
    ctr.set_front([cam_x - 0, cam_y - 0, cam_z - 0])
    ctr.set_up([0, 0, 1])  # Z is up

    vis.poll_events()
    vis.update_renderer()

    frame_path = os.path.join(OUTPUT_DIR, f"frame_{i:04d}.png")
    vis.capture_screen_image(frame_path, do_render=True)
    frame_paths.append(frame_path)

    if (i + 1) % 30 == 0:
        print(f"  Rendered {i + 1}/{FRAMES} frames")

vis.destroy_window()

print("Creating video...")
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
    os.remove(frame_path)

out.release()

print(f"✓ Video created: {os.path.join(OUTPUT_DIR, OUTPUT_VIDEO)}")

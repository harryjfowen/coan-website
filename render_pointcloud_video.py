#!/usr/bin/env python3
"""
Render a rotating point cloud video from PLY file
Rotates on Z axis only, centered, with white background
"""

import open3d as o3d
import numpy as np
import cv2
import os

# Configuration
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

# Get bounds
bounds = pcd.get_axis_aligned_bounding_box()
max_extent = np.linalg.norm(bounds.get_extent()) / 2

# Read colors from PLY file (prediction column)
# Prediction: 1 = red (wood), 0 = black (leaf)
ply_data = o3d.io.read_point_cloud(PLY_FILE)
points = np.asarray(ply_data.points)
points = points - center

# Parse PLY to get prediction values
with open(PLY_FILE, 'rb') as f:
    content = f.read()

# Find header
header_end = content.find(b'end_header')
header_text = content[:header_end].decode('utf-8')
header_lines = header_text.split('\n')

# Find property order
properties = []
for line in header_lines:
    if line.startswith('property'):
        parts = line.split()
        properties.append(parts[2])

print(f"Properties: {properties}")

# Parse binary data
header_bytes = header_end + 11  # len("end_header\n")
vertex_count = 0
for line in header_lines:
    if line.startswith('element vertex'):
        vertex_count = int(line.split()[2])
        break

predictions = []
offset = header_bytes
import struct

for i in range(vertex_count):
    # Skip x, y, z (3 floats = 12 bytes)
    offset += 12

    # Read remaining properties
    for j, prop_name in enumerate(properties[3:], start=3):
        if prop_name == 'prediction':
            pred = struct.unpack('<f', content[offset:offset+4])[0]
            predictions.append(1.0 if pred > 0.5 else 0.0)
            offset += 4
        elif prop_name in ['reflectance', 'label', 'pathlength', 'pwood']:
            offset += 4  # float
        else:
            offset += 1  # assume uchar for unknown

# Color based on prediction
colors = np.zeros((len(predictions), 3))
for i, pred in enumerate(predictions):
    if pred > 0.5:  # Red for wood (prediction = 1)
        colors[i] = [1.0, 0.0, 0.0]
    else:  # Black for leaf (prediction = 0)
        colors[i] = [0.0, 0.0, 0.0]

pcd.colors = o3d.utility.Vector3dVector(colors)

# Create visualizer
vis = o3d.visualization.Visualizer()
vis.create_window(width=IMAGE_WIDTH, height=IMAGE_HEIGHT, visible=False)
vis.add_geometry(pcd)

# Setup camera - looking down at the point cloud from above
ctr = vis.get_view_control()
ctr.set_front([0, 0, -1])  # Looking down
ctr.set_up([0, -1, 0])     # Y points down
ctr.set_lookat([0, 0, 0])  # Looking at center

# Set zoom level
ctr.set_zoom(0.8)

# Render params
render_option = vis.get_render_option()
render_option.point_size = 1.0
render_option.background_color = np.array([1.0, 1.0, 1.0])  # White background

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"Rendering {FRAMES} frames...")

# Render frames
frame_paths = []
for i in range(FRAMES):
    # Rotate around Z axis
    angle = (i / FRAMES) * 360

    # Create rotation matrix for Z-axis rotation
    rad = np.radians(angle)
    rotation = np.array([
        [np.cos(rad), -np.sin(rad), 0],
        [np.sin(rad), np.cos(rad), 0],
        [0, 0, 1]
    ])

    # Apply rotation
    rotated_points = points @ rotation.T
    pcd.points = o3d.utility.Vector3dVector(rotated_points)

    # Update geometry
    vis.update_geometry(pcd)
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

video_path = os.path.join(OUTPUT_DIR, OUTPUT_VIDEO)
print(f"✓ Video created: {video_path}")
print(f"  Duration: {FRAMES / FPS:.1f} seconds")
print(f"  Resolution: {IMAGE_WIDTH}x{IMAGE_HEIGHT}")
print(f"  Colors: Red = wood (prediction 1), Black = leaf (prediction 0)")

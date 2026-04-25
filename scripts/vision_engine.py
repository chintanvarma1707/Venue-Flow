import cv2
import json
import time
import os
from ultralytics import YOLO

# Initialize YOLOv8 model (using the 'nano' version for speed)
model = YOLO('yolov8n.pt')

# Define Zones (Coordinates in a 1920x1080 frame)
# In a real scenario, these would be polygons mapped to the stadium floor
ZONES = {
    "Gate_A": {"area": 50, "coords": [0, 0, 960, 540]},      # Top Left
    "Concourse_B": {"area": 120, "coords": [960, 0, 1920, 540]}, # Top Right
    "Food_Court": {"area": 80, "coords": [0, 540, 960, 1080]},  # Bottom Left
    "Gate_C": {"area": 40, "coords": [960, 540, 1920, 1080]}    # Bottom Right
}

def calculate_occupancy(person_count, area_sqm):
    # Max capacity logic: 2 people per sqm is "Critical"
    max_capacity = area_sqm * 2
    occupancy_pct = (person_count / max_capacity) * 100
    
    status = "Optimal"
    if occupancy_pct > 70:
        status = "Critical"
    elif occupancy_pct > 40:
        status = "Busy"
        
    return round(min(occupancy_pct, 100), 1), status

def process_vision():
    # Use 0 for webcam, or path to a video file
    # For "IT Student" style, we mock the video stream if no file exists
    video_source = "stadium_cctv.mp4"
    if not os.path.exists(video_source):
        print(f"Video source {video_source} not found. Running in MOCK mode.")
        video_source = 0 # Fallback to webcam or just random data

    cap = cv2.VideoCapture(video_source)
    
    # Path to save JSON for React app to read
    output_path = os.path.join("..", "public", "vision_data.json")

    print("Vision Engine Started. Press 'q' to quit.")

    while True:
        # If mocking, we just generate random counts
        if video_source == 0:
            counts = {
                "Gate_A": 20 + int(time.time() % 30),
                "Concourse_B": 40 + int(time.time() % 60),
                "Food_Court": 15 + int(time.time() % 40),
                "Gate_C": 5 + int(time.time() % 20)
            }
            time.sleep(1) # Simulate processing time
        else:
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0) # Loop video
                continue

            results = model(frame, classes=[0], verbose=False) # Class 0 is 'person'
            detections = results[0].boxes.data.tolist()
            
            # Reset counts
            counts = {zone: 0 for zone in ZONES}
            
            for det in detections:
                x1, y1, x2, y2, conf, cls = det
                center_x, center_y = (x1 + x2) / 2, (y1 + y2) / 2
                
                # Assign detection to zone
                for zone_id, zone_info in ZONES.items():
                    zx1, zy1, zx2, zy2 = zone_info["coords"]
                    if zx1 <= center_x <= zx2 and zy1 <= center_y <= zy2:
                        counts[zone_id] += 1
                        break

        # Calculate final stats
        vision_stats = []
        for zone_id, person_count in counts.items():
            occupancy, status = calculate_occupancy(person_count, ZONES[zone_id]["area"])
            
            # AI Queue Predictor Logic: 30s per person
            wait_time = int(person_count * 0.5) if "Food" in zone_id or "Gate" in zone_id else 0
            
            vision_stats.append({
                "zone_id": zone_id,
                "occupancy": occupancy,
                "status": status,
                "count": person_count,
                "wait_time": wait_time,
                "last_update": time.strftime("%H:%M:%S")
            })

        # Write to JSON
        with open(output_path, "w") as f:
            json.dump(vision_stats, f, indent=2)

        print(f"Updated vision_data.json - {time.strftime('%H:%M:%S')}")
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    process_vision()

from flask import Flask, render_template_string, jsonify
import datetime

app = Flask(__name__)

# Mock JSON data
data = {
    "id": "1712489583295-3fb4d8ef8913a0f0",
    "date_modified": 1712758889178,
    "date_journal": 1709269200000,
    "timezone": "America/Lima",
    "text": "<p dir=\"auto\">בוקר טוב יום שישי</p><p dir=\"auto\">קמים מוקדם יחסית דוחפים ארוחת בוקר...</p>",
    "preview_text": "<p dir=\"auto\">בוקר טוב יום שישי</p><p dir=\"auto\">קמים מוקדם יחסית דוחפים...</p>",
    "mood": 0,
    "lat": -13.5979289,
    "lon": -71.7734958,
    "address": "C62G+R5, Oropesa 08205, Peru",
    "label": "",
    "folder": "",
    "sentiment": 0,
    "favourite": False,
    "music_title": "",
    "music_artist": "",
    "photos": [],
    "weather": {
        "id": -1,
        "degree_c": 1.7976931348623157e+308,
        "description": "",
        "icon": "",
        "place": ""
    },
    "tags": [],
    "type": "html"
}

# Utility to format timestamps
def format_timestamp(timestamp):
    return datetime.datetime.utcfromtimestamp(timestamp / 1000).strftime('%Y-%m-%d %H:%M:%S')

@app.route('/')
def index():
    formatted_data = {
        "ID": data["id"],
        "Date Modified": format_timestamp(data["date_modified"]),
        "Date Journal": format_timestamp(data["date_journal"]),
        "Timezone": data["timezone"],
        "Preview Text": data["preview_text"],
        "Mood": data["mood"],
        "Location": {
            "Latitude": data["lat"],
            "Longitude": data["lon"],
            "Address": data["address"]
        },
        "Favourite": data["favourite"],
        "Weather": {
            "Description": data["weather"]["description"],
            "Temperature (C)": "N/A" if data["weather"]["degree_c"] == 1.7976931348623157e+308 else data["weather"]["degree_c"]
        }
    }

    # Render HTML using Flask
    html_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Journal Entry Viewer</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 20px;
                background-color: #f4f4f9;
            }
            h1 {
                color: #333;
            }
            .container {
                border: 1px solid #ddd;
                padding: 15px;
                border-radius: 8px;
                background: #fff;
            }
            .section {
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <h1>Journal Entry Viewer</h1>
        <div class="container">
            <div class="section">
                <strong>ID:</strong> {{ data['ID'] }}<br>
                <strong>Date Modified:</strong> {{ data['Date Modified'] }}<br>
                <strong>Date Journal:</strong> {{ data['Date Journal'] }}<br>
                <strong>Timezone:</strong> {{ data['Timezone'] }}
            </div>
            <div class="section">
                <strong>Preview Text:</strong>
                <div style="border: 1px solid #ddd; padding: 10px;">{{ data['Preview Text']|safe }}</div>
            </div>
            <div class="section">
                <strong>Mood:</strong> {{ data['Mood'] }}
            </div>
            <div class="section">
                <strong>Location:</strong><br>
                Latitude: {{ data['Location']['Latitude'] }}<br>
                Longitude: {{ data['Location']['Longitude'] }}<br>
                Address: {{ data['Location']['Address'] }}
            </div>
            <div class="section">
                <strong>Favourite:</strong> {{ "Yes" if data['Favourite'] else "No" }}
            </div>
            <div class="section">
                <strong>Weather:</strong><br>
                Description: {{ data['Weather']['Description'] }}<br>
                Temperature (C): {{ data['Weather']['Temperature (C)'] }}
            </div>
        </div>
    </body>
    </html>
    """
    return render_template_string(html_template, data=formatted_data)

if __name__ == '__main__':
    app.run(debug=True)

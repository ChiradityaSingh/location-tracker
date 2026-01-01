let watchId = null;
let map = null;
let marker = null;
let activity = JSON.parse(localStorage.getItem('locationActivity')) || []; // Load from local storage

// Initialize map
function initMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        marker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 13);
        marker.setLatLng([lat, lon]);
    }
}

// Add to activity and update list
function addActivity(lat, lon) {
    const timestamp = new Date().toLocaleString();
    const entry = { lat, lon, timestamp };
    activity.push(entry);
    localStorage.setItem('locationActivity', JSON.stringify(activity)); // Save to local storage
    // Optional: Send to backend
    // fetch('/api/save-activity', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(entry) });
    updateActivityList();
}

// Update activity list
function updateActivityList() {
    const list = document.getElementById('activityList');
    list.innerHTML = '';
    activity.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.timestamp}: Lat ${entry.lat.toFixed(4)}, Lon ${entry.lon.toFixed(4)}`;
        list.appendChild(li);
    });
}

// Start tracking
document.getElementById('startBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                initMap(lat, lon);
                addActivity(lat, lon);
            },
            (error) => {
                alert(`Error: ${error.message}. Permission denied or unavailable.`);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
    } else {
        alert('Geolocation not supported.');
    }
});

// Stop tracking
document.getElementById('stopBtn').addEventListener('click', () => {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
});

// Load activity on page load
updateActivityList();
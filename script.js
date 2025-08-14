class CityMap {
    constructor() {
        this.cities = [];
        this.selectedCity = null;
        this.showDistances = false;
        this.showNames = true;
        this.showConnections = true;
        this.connections = [];
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.isPanning = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mapElement = document.getElementById('map');
        this.infoPanel = document.getElementById('infoPanel');
        this.toggleDistancesBtn = document.getElementById('toggleDistances');
        this.toggleNamesBtn = document.getElementById('toggleNames');
        this.toggleConnectionsBtn = document.getElementById('toggleConnections');
        this.zoomInBtn = document.getElementById('zoomIn');
        this.zoomOutBtn = document.getElementById('zoomOut');
        this.resetPanBtn = document.getElementById('resetPan');
        
        this.init();
    }

    async init() {
        await this.loadCities();
        this.setupEventListeners();
        this.renderMap();
        this.updateStats();
    }

    async loadCities() {
        // City data is loaded before map initialization
        this.cities = window.cityData.filter(city => city.status === 'found');
        console.log(`Loaded ${this.cities.length} cities`);
    }

    setupEventListeners() {
        this.toggleDistancesBtn.addEventListener('click', () => this.toggleDistances());
        this.toggleNamesBtn.addEventListener('click', () => this.toggleNames());
        this.toggleConnectionsBtn.addEventListener('click', () => this.toggleConnections());
        
        // Add zoom functionality with mouse wheel/trackpad
        this.mapElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.handleZoom(e);
        });
        
        // Add zoom button functionality
        this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        this.resetPanBtn.addEventListener('click', () => this.resetPan());
        
        // Add panning functionality
        this.mapElement.addEventListener('mousedown', (e) => this.startPan(e));
        this.mapElement.addEventListener('mousemove', (e) => this.pan(e));
        this.mapElement.addEventListener('mouseup', () => this.stopPan());
        this.mapElement.addEventListener('mouseleave', () => this.stopPan());
        
        // Prevent context menu on right click
        this.mapElement.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    renderMap() {
        this.mapElement.innerHTML = '';
        this.createCityNodes();
        this.createConnections();
    }

    createCityNodes() {
        const mapWidth = this.mapElement.offsetWidth;
        const mapHeight = this.mapElement.offsetHeight;
        
        // Calculate bounds
        const bounds = this.calculateBounds();
        const scaleX = (mapWidth - 150) / (bounds.maxLng - bounds.minLng);
        const scaleY = (mapHeight - 150) / (bounds.maxLat - bounds.minLat);
        const scale = Math.min(scaleX, scaleY);

        this.cities.forEach(city => {
            const node = document.createElement('div');
            node.className = 'city-node';
            
            // Determine if it's a major city (based on population or importance)
            const majorCities = ['Colombo', 'Moratuwa', 'Kotte', 'Battaramulla', 'Malabe', 'Kaduwela'];
            const isMajor = majorCities.some(name => city.place.includes(name));
            if (isMajor) node.classList.add('major');

            // Position the node with better centering
            const x = ((city.longitude - bounds.minLng) * scale) + 75;
            const y = ((bounds.maxLat - city.latitude) * scale) + 75;
            
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            
            // Create label
            const label = document.createElement('div');
            label.className = 'city-label';
            label.textContent = city.place.split(',')[0]; // Just the city name
            
            // Position label to avoid overlapping with node
            const labelX = x + 15;
            const labelY = y - 10;
            label.style.left = `${labelX}px`;
            label.style.top = `${labelY}px`;
            
            this.mapElement.appendChild(label);
            
            // Add hover events for showing/hiding names and connections
            node.addEventListener('mouseenter', () => {
                if (!this.showNames) {
                    label.style.opacity = '1';
                }
                if (!this.showConnections) {
                    this.showNodeConnections(city, true);
                }
            });
            
            node.addEventListener('mouseleave', () => {
                if (!this.showNames) {
                    label.style.opacity = '0';
                }
                if (!this.showConnections) {
                    this.showNodeConnections(city, false);
                }
            });
            
            // Add click event
            node.addEventListener('click', () => this.selectCity(city));
            
            this.mapElement.appendChild(node);
        });
    }

    createConnections() {
        this.connections = [];
        const mapWidth = this.mapElement.offsetWidth;
        const mapHeight = this.mapElement.offsetHeight;
        
        const bounds = this.calculateBounds();
        const scaleX = (mapWidth - 150) / (bounds.maxLng - bounds.minLng);
        const scaleY = (mapHeight - 150) / (bounds.maxLat - bounds.minLat);
        const scale = Math.min(scaleX, scaleY);

        // Create connections between nearby cities (within 10km)
        for (let i = 0; i < this.cities.length; i++) {
            for (let j = i + 1; j < this.cities.length; j++) {
                const city1 = this.cities[i];
                const city2 = this.cities[j];
                const distance = this.calculateDistance(city1, city2);
                
                if (distance <= 10) { // 10km threshold
                    const connection = this.createConnection(city1, city2, distance, bounds, scale);
                    this.connections.push(connection);
                    this.mapElement.appendChild(connection);
                }
            }
        }
    }

    createConnection(city1, city2, distance, bounds, scale) {
        const connection = document.createElement('div');
        connection.className = 'city-connection';
        
        // Add data attribute to identify which cities this connection links
        connection.setAttribute('data-cities', `${city1.place}|${city2.place}`);
        
        const x1 = ((city1.longitude - bounds.minLng) * scale) + 75;
        const y1 = ((bounds.maxLat - city1.latitude) * scale) + 75;
        const x2 = ((city2.longitude - bounds.minLng) * scale) + 75;
        const y2 = ((bounds.maxLat - city2.latitude) * scale) + 75;
        
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        connection.style.width = `${length}px`;
        connection.style.left = `${x1}px`;
        connection.style.top = `${y1}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        // Create distance label
        const distanceLabel = document.createElement('div');
        distanceLabel.className = 'distance-label';
        distanceLabel.textContent = `${distance.toFixed(1)} km`;
        distanceLabel.style.left = `${length / 2}px`;
        distanceLabel.style.top = '-15px';
        connection.appendChild(distanceLabel);
        
        // Show/hide distances based on toggle
        if (!this.showDistances) {
            distanceLabel.style.opacity = '0';
        }
        
        return connection;
    }

    calculateBounds() {
        const lats = this.cities.map(city => city.latitude);
        const lngs = this.cities.map(city => city.longitude);
        
        return {
            minLat: Math.min(...lats),
            maxLat: Math.max(...lats),
            minLng: Math.min(...lngs),
            maxLng: Math.max(...lngs)
        };
    }

    calculateDistance(city1, city2) {
        const R = 6371; // Earth's radius in km
        const dLat = (city2.latitude - city1.latitude) * Math.PI / 180;
        const dLng = (city2.longitude - city1.longitude) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(city1.latitude * Math.PI / 180) * Math.cos(city2.latitude * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    selectCity(city) {
        // Remove previous selection
        if (this.selectedCity) {
            const prevNode = this.mapElement.querySelector('.city-node.selected');
            if (prevNode) prevNode.classList.remove('selected');
        }
        
        this.selectedCity = city;
        
        // Highlight selected node
        const nodes = this.mapElement.querySelectorAll('.city-node');
        nodes.forEach(node => {
            if (node.style.left === `${((city.longitude - this.calculateBounds().minLng) * Math.min((this.mapElement.offsetWidth - 100) / (this.calculateBounds().maxLng - this.calculateBounds().minLng), (this.mapElement.offsetHeight - 100) / (this.calculateBounds().maxLat - this.calculateBounds().minLat))) + 50}px`) {
                node.classList.add('selected');
            }
        });
        
        this.showCityInfo(city);
    }

    showCityInfo(city) {
        const cityInfo = document.createElement('div');
        cityInfo.className = 'city-info';
        
        const cityName = document.createElement('div');
        cityName.className = 'city-name';
        cityName.textContent = city.place.split(',')[0];
        
        const cityCoords = document.createElement('div');
        cityCoords.className = 'city-coords';
        cityCoords.textContent = `Lat: ${city.latitude.toFixed(6)}, Lng: ${city.longitude.toFixed(6)}`;
        
        cityInfo.appendChild(cityName);
        cityInfo.appendChild(cityCoords);
        
        // Add nearby cities
        const nearbyCities = this.getNearbyCities(city, 15); // 15km radius
        if (nearbyCities.length > 0) {
            const nearbyTitle = document.createElement('div');
            nearbyTitle.style.fontWeight = 'bold';
            nearbyTitle.style.marginTop = '10px';
            nearbyTitle.style.marginBottom = '5px';
            nearbyTitle.textContent = 'Nearby Cities:';
            cityInfo.appendChild(nearbyTitle);
            
            nearbyCities.forEach(nearby => {
                const nearbyItem = document.createElement('div');
                nearbyItem.style.fontSize = '0.9rem';
                nearbyItem.style.marginBottom = '3px';
                nearbyItem.innerHTML = `<span style="color: #e74c3c;">${nearby.city.place.split(',')[0]}</span> - <span class="city-distance">${nearby.distance.toFixed(1)} km</span>`;
                cityInfo.appendChild(nearbyItem);
            });
        }
        
        // Clear previous info and add new
        const existingInfo = this.infoPanel.querySelector('.city-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        this.infoPanel.appendChild(cityInfo);
    }

    getNearbyCities(city, radius) {
        const nearby = [];
        this.cities.forEach(otherCity => {
            if (otherCity !== city) {
                const distance = this.calculateDistance(city, otherCity);
                if (distance <= radius) {
                    nearby.push({ city: otherCity, distance });
                }
            }
        });
        return nearby.sort((a, b) => a.distance - b.distance).slice(0, 8); // Top 8 nearest
    }



    toggleDistances() {
        this.showDistances = !this.showDistances;
        const distanceLabels = this.mapElement.querySelectorAll('.distance-label');
        distanceLabels.forEach(label => {
            label.style.opacity = this.showDistances ? '1' : '0';
        });
        
        this.toggleDistancesBtn.textContent = this.showDistances ? 'Hide Distances' : 'Show Distances';
    }

    toggleNames() {
        this.showNames = !this.showNames;
        const cityLabels = this.mapElement.querySelectorAll('.city-label');
        cityLabels.forEach(label => {
            if (this.showNames) {
                label.style.display = 'block';
                label.style.opacity = '1';
            } else {
                label.style.display = 'block';
                label.style.opacity = '0';
            }
        });
        
        this.toggleNamesBtn.textContent = this.showNames ? 'Hide Names' : 'Show Names';
    }

    toggleConnections() {
        this.showConnections = !this.showConnections;
        const cityConnections = this.mapElement.querySelectorAll('.city-connection');
        cityConnections.forEach(connection => {
            connection.style.display = this.showConnections ? 'block' : 'none';
        });
        
        this.toggleConnectionsBtn.textContent = this.showConnections ? 'Hide Connections' : 'Show Connections';
    }

    showNodeConnections(city, show) {
        // Find all connections that involve this city
        const cityConnections = this.mapElement.querySelectorAll('.city-connection');
        cityConnections.forEach(connection => {
            // Check if this connection involves the hovered city
            const connectionData = connection.getAttribute('data-cities');
            if (connectionData && connectionData.includes(city.place)) {
                connection.style.display = show ? 'block' : 'none';
                
                // Also handle distance labels for this connection
                const distanceLabel = connection.querySelector('.distance-label');
                if (distanceLabel) {
                    distanceLabel.style.opacity = this.showDistances ? '1' : '0';
                }
            }
        });
    }

    handleZoom(e) {
        const zoomSpeed = 0.15;
        const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
        
        // Calculate new zoom level with limits
        const newZoom = Math.max(0.3, Math.min(5, this.zoomLevel + delta));
        
        if (newZoom !== this.zoomLevel) {
            this.zoomLevel = newZoom;
            this.applyZoom();
        }
    }

    applyZoom() {
        // Apply zoom and pan to the entire map container
        this.mapElement.style.transform = `scale(${this.zoomLevel}) translate(${this.panX}px, ${this.panY}px)`;
        this.mapElement.style.transformOrigin = 'center center';
        
        // Update zoom level display
        const zoomDisplay = document.getElementById('zoomLevel');
        if (zoomDisplay) {
            zoomDisplay.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
    }

    zoomIn() {
        const newZoom = Math.min(5, this.zoomLevel + 0.25);
        if (newZoom !== this.zoomLevel) {
            this.zoomLevel = newZoom;
            this.applyZoom();
        }
    }

    zoomOut() {
        const newZoom = Math.max(0.3, this.zoomLevel - 0.25);
        if (newZoom !== this.zoomLevel) {
            this.zoomLevel = newZoom;
            this.applyZoom();
        }
    }

    startPan(e) {
        // Only start panning on left mouse button
        if (e.button === 0) {
            this.isPanning = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.mapElement.style.cursor = 'grabbing';
        }
    }

    pan(e) {
        if (!this.isPanning) return;
        
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        
        this.panX += deltaX;
        this.panY += deltaY;
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        this.applyZoom();
    }

    stopPan() {
        this.isPanning = false;
        this.mapElement.style.cursor = 'grab';
    }

    resetPan() {
        this.panX = 0;
        this.panY = 0;
        this.zoomLevel = 1;
        this.applyZoom();
    }



    updateStats() {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats';
        
        const totalCities = this.cities.length;
        const bounds = this.calculateBounds();
        const area = this.calculateArea(bounds);
        const avgDistance = this.calculateAverageDistance();
        
        statsContainer.innerHTML = `
            <h3>Map Statistics</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${totalCities}</div>
                    <div class="stat-label">Total Cities</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${area.toFixed(1)}</div>
                    <div class="stat-label">Area (km²)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${avgDistance.toFixed(1)}</div>
                    <div class="stat-label">Avg Distance (km)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${this.connections.length}</div>
                    <div class="stat-label">Connections</div>
                </div>
            </div>
        `;
        
        // Insert stats after the map container
        const mapContainer = document.querySelector('.map-container');
        mapContainer.parentNode.insertBefore(statsContainer, mapContainer.nextSibling);
    }

    calculateArea(bounds) {
        const latDiff = bounds.maxLat - bounds.minLat;
        const lngDiff = bounds.maxLng - bounds.minLng;
        // Approximate area calculation (simplified)
        return latDiff * lngDiff * 111 * 111; // Rough conversion to km²
    }

    calculateAverageDistance() {
        let totalDistance = 0;
        let count = 0;
        
        for (let i = 0; i < this.cities.length; i++) {
            for (let j = i + 1; j < this.cities.length; j++) {
                totalDistance += this.calculateDistance(this.cities[i], this.cities[j]);
                count++;
            }
        }
        
        return count > 0 ? totalDistance / count : 0;
    }
}

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.5); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Map initialization is now handled in the HTML after city data is loaded


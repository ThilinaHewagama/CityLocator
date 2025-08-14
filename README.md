# Sri Lanka Cities Interactive Map

An advanced interactive web application that displays 70+ Sri Lankan cities from the Western Province on a dynamic map, featuring real GPS coordinates, distance calculations, and comprehensive interactive features.

## 🌟 Features

- **Interactive City Nodes**: Click on any city to see detailed information and coordinates
- **Real GPS Coordinates**: All cities use actual latitude/longitude data for accurate positioning
- **Distance Calculations**: View precise distances between cities using the Haversine formula
- **Multiple View Modes**: Toggle distances, city names, and connections independently
- **Advanced Navigation**: Zoom in/out (30% to 500%) and pan around the map
- **City Categorization**: Major cities highlighted in blue, others in red
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations and hover effects
- **Statistics Panel**: Real-time map statistics including total cities, area, and connections
- **Smart Connections**: Automatic connection lines between cities within 10km

## 🚀 How to Use

### Basic Navigation
1. **Open the Application**: Open `index.html` in any modern web browser
2. **Explore Cities**: Click on any city node to see detailed information
3. **Zoom & Pan**: Use mouse wheel to zoom, drag to pan around the map
4. **Reset View**: Click the home button (⌂) to return to the default view

### View Controls
- **Show/Hide Distances**: Toggle distance labels between cities
- **Show/Hide Names**: Toggle city name labels on/off
- **Show/Hide Connections**: Toggle connection lines between nearby cities

### City Information
When you click on a city, you'll see:
- City name and exact GPS coordinates
- List of nearby cities within 15km with distances
- Visual highlighting of the selected city

## 🏗️ Technical Architecture

### Frontend Technologies
- **HTML5**: Semantic structure with modern elements
- **CSS3**: Responsive design with gradients, shadows, and smooth animations
- **Vanilla JavaScript**: ES6+ classes with no external dependencies
- **Object-Oriented Design**: Clean `CityMap` class architecture

### Key Components
- **CityMap Class**: Main application controller with all functionality
- **Coordinate System**: Real GPS coordinates with automatic scaling
- **Distance Engine**: Haversine formula for accurate distance calculations
- **Interactive Elements**: Event-driven UI with smooth state management
- **Responsive Layout**: CSS Grid and Flexbox for adaptive design

### Performance Features
- **Efficient Rendering**: Optimized DOM manipulation and event handling
- **Smart Connections**: Only renders connections within 10km threshold
- **Lazy Loading**: City data loaded once and cached for performance
- **Smooth Animations**: CSS transitions and transforms for fluid UX

## 📁 File Structure

```
CityLocator/
├── index.html          # Main HTML file with city data and structure
├── styles.css          # Complete CSS styling and responsive design
├── script.js           # JavaScript application logic (CityMap class)
└── README.md           # This documentation file
```

## 🗺️ City Data

The application includes **70+ cities** from Western Province, Sri Lanka:
- **Major Cities**: Colombo areas, Kotte, Battaramulla, Malabe, Kaduwela, Moratuwa
- **Other Cities**: Various towns and suburbs with real GPS coordinates
- **Data Source**: Structured JSON with place names, coordinates, and status

### City Categories
- **🔵 Major Cities**: Larger nodes (16px) in blue - administrative and commercial centers
- **🔴 Other Cities**: Standard nodes (12px) in red - residential and suburban areas

## 🎯 Interactive Features

### Map Controls
- **Zoom Range**: 30% to 500% with smooth scaling
- **Pan Navigation**: Click and drag to move around the map
- **Reset Function**: One-click return to default view and zoom

### View Modes
- **Distance Labels**: Show/hide kilometer distances between connected cities
- **City Names**: Toggle visibility of city name labels
- **Connection Lines**: Show/hide lines connecting cities within 10km

### Smart Interactions
- **Hover Effects**: Cities highlight and show connections on hover
- **Selection System**: Click to select cities with visual feedback
- **Dynamic Info Panel**: Real-time city information display

## 📊 Statistics & Analytics

The application provides comprehensive map statistics:
- **Total Cities**: Count of all loaded cities
- **Map Area**: Approximate coverage area in square kilometers
- **Average Distance**: Mean distance between all city pairs
- **Total Connections**: Number of city connections within 10km

## 🌐 Browser Compatibility

- **Chrome**: 60+ (Full support)
- **Firefox**: 55+ (Full support)
- **Safari**: 12+ (Full support)
- **Edge**: 79+ (Full support)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet

## 🎨 Design Features

### Visual Elements
- **Gradient Backgrounds**: Modern color schemes with smooth transitions
- **Shadow Effects**: Depth and dimension with CSS box-shadows
- **Smooth Animations**: 0.3s transitions for all interactive elements
- **Responsive Typography**: Scalable text that adapts to screen size

### Color Scheme
- **Primary**: Blue gradients (#3498db, #2980b9)
- **Secondary**: Red accents (#e74c3c, #c0392b)
- **Background**: Purple-blue gradient (#667eea, #764ba2)
- **Text**: Dark grays (#2c3e50, #7f8c8d)

## 🔧 Customization

### Adding Cities
```javascript
// Add to the cityData array in index.html
{
    "place": "New City, Western Province, Sri Lanka",
    "latitude": 6.9271,
    "longitude": 79.8612,
    "status": "found"
}
```

### Modifying Features
- **Distance Threshold**: Change the 10km connection limit in `createConnections()`
- **Zoom Limits**: Adjust min/max zoom levels in zoom functions
- **Styling**: Modify colors and animations in `styles.css`
- **City Categories**: Update major cities list in `createCityNodes()`

## 🚀 Getting Started

1. **Download**: Clone or download all project files
2. **Open**: Navigate to the project folder and open `index.html`
3. **Explore**: Start interacting with the map immediately
4. **No Setup Required**: Pure client-side application with no server dependencies

## 📈 Performance Notes

- **Initial Load**: Fast loading with embedded city data
- **Memory Usage**: Efficient DOM management with minimal memory footprint
- **Smooth Interactions**: 60fps animations and responsive controls
- **Mobile Optimized**: Touch-friendly controls and responsive layout

## 🤝 Contributing

This is a standalone project that can be easily extended:
- Add more cities and regions
- Implement additional map features
- Enhance the UI/UX design
- Add data export capabilities
- Integrate with external mapping APIs

## 📄 License

This project is open source and available for educational and personal use.

---

**Built with ❤️ using vanilla web technologies - no frameworks, no dependencies, just pure HTML, CSS, and JavaScript.**

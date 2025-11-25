import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Try to import react-native-maps, but handle gracefully if it fails (Expo Go)
let MapView, Marker;
let mapsAvailable = false;

// Check if react-native-maps is available
// In Expo Go, this module is not available, so we use a fallback
try {
  // Check if module exists before requiring
  if (typeof require !== 'undefined') {
    const maps = require('react-native-maps');
    if (maps && (maps.default || maps.MapView)) {
      MapView = maps.default || maps.MapView;
      Marker = maps.Marker;
      mapsAvailable = true;
    }
  }
} catch (error) {
  // react-native-maps is not available in Expo Go - this is expected
  mapsAvailable = false;
}

/**
 * Componentă pentru afișarea hărții cu pin-uri pentru locații
 * Folosește fallback pentru Expo Go unde react-native-maps nu este disponibil
 */
export default function MapViewComponent({ locations, onMarkerPress, initialRegion }) {
  // Fallback pentru Expo Go
  if (!mapsAvailable) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <Ionicons name="map-outline" size={64} color="#007AFF" />
          <Text style={styles.fallbackTitle}>Hartă indisponibilă în Expo Go</Text>
          <Text style={styles.fallbackText}>
            Pentru a folosi hărțile, construiește aplicația cu EAS Build
          </Text>
          <ScrollView style={styles.fallbackList}>
            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.fallbackItem}
                onPress={() => onMarkerPress(location)}
              >
                <Ionicons name="location" size={20} color="#007AFF" />
                <View style={styles.fallbackItemContent}>
                  <Text style={styles.fallbackItemName}>{location.name}</Text>
                  <Text style={styles.fallbackItemAddress}>{location.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  if (mapsAvailable && locations.length === 0) {
    return (
      <View style={styles.emptyMapContainer}>
        <Ionicons name="map-outline" size={52} color="#999" />
        <Text style={styles.emptyMapTitle}>Nicio locație pentru filtrele curente</Text>
        <Text style={styles.emptyMapText}>
          Revino la vizualizarea listă pentru a ajusta căutarea sau filtrele.
        </Text>
      </View>
    );
  }

  // Versiunea cu hărți (pentru development build)
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.coordinates.latitude,
              longitude: location.coordinates.longitude,
            }}
            title={location.name}
            description={location.address}
            onPress={() => onMarkerPress(location)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  fallbackList: {
    width: '100%',
    flex: 1,
  },
  fallbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fallbackItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  fallbackItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fallbackItemAddress: {
    fontSize: 12,
    color: '#666',
  },
  emptyMapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  emptyMapTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  emptyMapText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});


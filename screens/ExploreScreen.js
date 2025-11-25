import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import LocationCard from '../components/LocationCard';
import MapViewComponent from '../components/MapViewComponent';
// Import JSON - Metro bundler suportă importurile JSON
import locationsData from '../data/locations.json';

/**
 * Ecran principal Explore cu toggle între Map View și List View
 */
export default function ExploreScreen({ navigation }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' sau 'map'
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 46.7712,
    longitude: 23.6236,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    loadLocations();
    requestLocationPermission();
  }, []);

  const loadLocations = async () => {
    try {
      // Simulare încărcare date
      await new Promise(resolve => setTimeout(resolve, 500));
      setLocations(locationsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading locations:', error);
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleLocationPress = (location) => {
    navigation.navigate('Details', { location });
  };

  const toggleRatingFilter = () => {
    setMinRating((prev) => (prev === 0 ? 4 : 0));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMinRating(0);
  };

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = location.rating >= minRating;
    return matchesSearch && matchesRating;
  });

  const hasActiveFilters = searchQuery.trim().length > 0 || minRating > 0;

  const renderListItem = ({ item }) => (
    <LocationCard location={item} onPress={handleLocationPress} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Se încarcă locațiile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search & filters */}
      <View style={styles.filterRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Caută locații sau adrese"
            placeholderTextColor="#999"
            style={styles.searchInput}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterChip, minRating > 0 && styles.filterChipActive]}
          onPress={toggleRatingFilter}
          activeOpacity={0.8}
        >
          <Ionicons
            name="options"
            size={16}
            color={minRating > 0 ? '#fff' : '#444'}
          />
          <Text
            style={[
              styles.filterChipText,
              minRating > 0 && styles.filterChipTextActive,
            ]}
          >
            {minRating > 0 ? 'Rating 4+ ⭐' : 'Toate rating-urile'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toggle buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Ionicons 
            name="list" 
            size={20} 
            color={viewMode === 'list' ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.toggleText,
            viewMode === 'list' && styles.toggleTextActive
          ]}>
            Listă
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <Ionicons 
            name="map" 
            size={20} 
            color={viewMode === 'map' ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.toggleText,
            viewMode === 'map' && styles.toggleTextActive
          ]}>
            Hartă
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === 'list' ? (
        filteredLocations.length > 0 ? (
          <FlatList
            data={filteredLocations}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#999" />
            <Text style={styles.emptyStateTitle}>Nicio locație găsită</Text>
            <Text style={styles.emptyStateText}>
              Ajustează căutarea sau filtrele pentru a vedea mai multe rezultate.
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearFilters}
                activeOpacity={0.8}
              >
                <Text style={styles.clearFiltersText}>Șterge filtrele</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      ) : (
        <MapViewComponent
          locations={filteredLocations}
          onMarkerPress={handleLocationPress}
          initialRegion={initialRegion}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#e6e6e6',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 48,
  },
  emptyStateTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  clearFiltersButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  clearFiltersText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});


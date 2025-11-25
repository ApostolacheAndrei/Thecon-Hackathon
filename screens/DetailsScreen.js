import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateVibe } from '../api/ai';

/**
 * Ecran de detalii pentru o locație
 * Afișează informații complete și butoane pentru rezervare și generare vibe
 */
export default function DetailsScreen({ route, navigation }) {
  const { location } = route.params;
  const [description, setDescription] = useState(location.short_description);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleReserve = () => {
    const message = `Rezervare pentru ${location.name}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert('Eroare', 'WhatsApp nu este instalat pe acest dispozitiv.');
        }
      })
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Eroare', 'Nu s-a putut deschide WhatsApp.');
      });
  };

  const handleGenerateVibe = async () => {
    setIsGenerating(true);
    try {
      const newDescription = await generateVibe(location.short_description);
      setDescription(newDescription);
    } catch (error) {
      console.error('Error generating vibe:', error);
      Alert.alert('Eroare', 'Nu s-a putut genera descrierea. Te rugăm să încerci din nou.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image 
        source={{ uri: location.image_url }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>{location.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>{location.rating}</Text>
        </View>

        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.address}>{location.address}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Descriere</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.reserveButton]}
            onPress={handleReserve}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
            <Text style={styles.buttonText}>Rezervă</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.vibeButton]}
            onPress={handleGenerateVibe}
            disabled={isGenerating}
            activeOpacity={0.8}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="sparkles" size={20} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {isGenerating ? 'Se generează...' : 'Generează vibe'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  buttonsContainer: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  reserveButton: {
    backgroundColor: '#25D366', // WhatsApp green
  },
  vibeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});



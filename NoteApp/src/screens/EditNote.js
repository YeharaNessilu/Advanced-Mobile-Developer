import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, Share } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore'; 
import { db } from '../config/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard'; // Clipboard එකට

const COLORS = ['#FFFFFF', '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#BBDEFB', '#B2EBF2', '#C8E6C9', '#FFF9C4', '#FFCCBC'];

export default function EditNote() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params; 

  const [title, setTitle] = useState(item.title);
  const [note, setNote] = useState(item.content);
  const [selectedColor, setSelectedColor] = useState(item.color || '#FFFFFF');
  const [loading, setLoading] = useState(false);

  // 1. Character සහ Word count Logic
  const charCount = note.length;
  const wordCount = note.trim() === '' ? 0 : note.trim().split(/\s+/).length;

  // 2. Share Function එක
  const onShare = async () => {
    try {
      await Share.share({
        message: `${title}\n\n${note}\n\nSent from My Note App`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  // 3. Copy to Clipboard Function එක
  const onCopyToClipboard = async () => {
    await Clipboard.setStringAsync(note);
    if (Platform.OS === 'web') {
        alert('Copied to clipboard!');
    } else {
        Alert.alert('Copied', 'Note content copied to clipboard!');
    }
  };

  const onUpdate = async () => {
    if (title.trim() === '' || note.trim() === '') {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const noteRef = doc(db, 'notes', item.id);
      await updateDoc(noteRef, {
        title: title,
        content: note,
        color: selectedColor,
        updatedAt: new Date()
      });
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      {/* Header with Action Buttons */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Edit Note</Text>
        
        <View style={styles.headerActions}>
            <TouchableOpacity onPress={onCopyToClipboard} style={styles.iconBtn}>
                <Ionicons name="copy-outline" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} style={styles.iconBtn}>
                <Ionicons name="share-social-outline" size={22} color="#333" />
            </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.form}>
          <TextInput
            style={styles.inputTitle}
            placeholder="Title"
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          
          <TextInput
            style={styles.inputNote}
            placeholder="Start typing..."
            placeholderTextColor="#666"
            multiline={true}
            textAlignVertical="top" 
            value={note}
            onChangeText={setNote}
          />

          {/* Character & Word Count */}
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{wordCount} words | {charCount} characters</Text>
          </View>
        </ScrollView>

        {/* Color Picker Section */}
        <View style={styles.colorPickerContainer}>
          <Text style={styles.colorLabel}>Change Background Color:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorList}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedCircle
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Update Button */}
        {!loading ? (
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={onUpdate}>
                    <Text style={styles.buttonText}>Update Note</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.7)', borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  headerActions: { flexDirection: 'row' },
  iconBtn: { padding: 8 },
  
  form: { padding: 25 },
  inputTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  inputNote: { fontSize: 18, color: '#444', lineHeight: 28, minHeight: 300 },

  countContainer: {
    marginTop: 10, paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: '#ccc', alignItems: 'flex-end'
  },
  countText: { fontSize: 12, color: '#666' },

  colorPickerContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  colorLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 10 },
  colorList: { flexDirection: 'row', marginBottom: 10 },
  colorCircle: { width: 35, height: 35, borderRadius: 17.5, marginRight: 15, borderWidth: 1, borderColor: '#ddd' },
  selectedCircle: { borderWidth: 3, borderColor: '#6C63FF', transform: [{ scale: 1.1 }] },

  footer: { padding: 20, backgroundColor: 'rgba(255,255,255,0.8)', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  button: { backgroundColor: '#6C63FF', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
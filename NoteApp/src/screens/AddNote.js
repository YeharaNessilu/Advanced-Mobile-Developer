import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore'; 
import { db, auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const COLORS = ['#FFFFFF', '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#BBDEFB', '#B2EBF2', '#C8E6C9', '#FFF9C4', '#FFCCBC'];

export default function AddNote() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [loading, setLoading] = useState(false);

  // Character සහ Word count ගණනය කරන Logic එක
  const charCount = note.length;
  const wordCount = note.trim() === '' ? 0 : note.trim().split(/\s+/).length;

  const onSave = async () => {
    if (title.trim() === '' || note.trim() === '') {
      if (Platform.OS === 'web') {
        alert('Please fill all fields');
      } else {
        Alert.alert('Error', 'Please fill all fields');
      }
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'notes'), {
        title: title,
        content: note,
        color: selectedColor,
        userId: auth.currentUser?.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Note</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
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

          {/* Counts Display */}
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{wordCount} words</Text>
            <Text style={styles.countText}> | </Text>
            <Text style={styles.countText}>{charCount} characters</Text>
          </View>
        </ScrollView>

        <View style={styles.colorPickerContainer}>
          <Text style={styles.colorLabel}>Select Background Color:</Text>
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

        {!loading ? (
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={onSave}>
                    <Text style={styles.buttonText}>Save Note</Text>
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
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.7)', borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  backBtn: { padding: 5 },
  form: { padding: 25 },
  inputTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  inputNote: { fontSize: 18, color: '#444', lineHeight: 28, minHeight: 250 },
  
  // Count Styles
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc'
  },
  countText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },

  colorPickerContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  colorLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 10 },
  colorList: { flexDirection: 'row', marginBottom: 10 },
  colorCircle: { width: 35, height: 35, borderRadius: 17.5, marginRight: 15, borderWidth: 1, borderColor: '#ddd' },
  selectedCircle: { borderWidth: 3, borderColor: '#6C63FF', transform: [{ scale: 1.1 }] },
  footer: { padding: 20, backgroundColor: 'rgba(255,255,255,0.8)', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  button: { backgroundColor: '#6C63FF', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
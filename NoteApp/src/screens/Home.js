import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Platform, Alert, StatusBar, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Home() {
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [loading, setLoading] = useState(true);

  // 1. Time-based Greeting Function
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 16) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  // 2. Data කියවන කොටස
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, 'notes'), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesList = [];
      querySnapshot.forEach((doc) => {
        notesList.push({ ...doc.data(), id: doc.id });
      });

      const sortedNotes = notesList.sort((a, b) => {
        return (b.isPinned === a.isPinned) ? 0 : b.isPinned ? 1 : -1;
      });

      setNotes(sortedNotes);
      setFilteredNotes(sortedNotes); 
      setLoading(false);
    }, (error) => {
      console.log(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Favorite / Pin Toggle Function
  const togglePin = async (noteId, currentStatus) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        isPinned: !currentStatus 
      });
    } catch (error) {
      console.error("Error updating pin status:", error);
    }
  };

  // 4. Search Logic
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const newData = notes.filter((item) => {
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        const contentData = item.content ? item.content.toUpperCase() : ''.toUpperCase();
        return itemData.indexOf(textData) > -1 || contentData.indexOf(textData) > -1;
      });
      setFilteredNotes(newData);
    } else {
      setFilteredNotes(notes);
    }
  };

  // 5. Log Out Function
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        signOut(auth).then(() => navigation.replace('index')).catch(console.error);
      }
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: 'destructive', onPress: () => signOut(auth).then(() => navigation.replace('index')).catch(console.error) }
      ]);
    }
  };

  // 6. Delete Function
  const handleDelete = async (noteId) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("Delete this note?");
      if (confirm) await deleteDoc(doc(db, "notes", noteId));
    } else {
      Alert.alert("Delete Note", "This action cannot be undone.", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => await deleteDoc(doc(db, "notes", noteId)) }
      ]);
    }
  };

  // Note Card Design
  const renderNote = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.card, 
        { backgroundColor: item.color || '#fff' }, 
        item.isPinned && styles.pinnedCard
      ]}
      onPress={() => navigation.navigate('edit', { item: item })}
      activeOpacity={0.8}
    >
      <View style={[styles.cardLeftStrip, { backgroundColor: item.isPinned ? '#FFD700' : '#6C63FF' }]} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <TouchableOpacity onPress={() => togglePin(item.id, item.isPinned)} style={styles.pinIcon}>
                <Ionicons 
                    name={item.isPinned ? "star" : "star-outline"} 
                    size={20} 
                    color={item.isPinned ? "#FFD700" : "#ccc"} 
                />
            </TouchableOpacity>
        </View>
        
        <Text style={styles.cardBody} numberOfLines={2}>{item.content}</Text>
        
        <View style={styles.cardFooter}>
            <Text style={styles.date}>
                <Ionicons name="time-outline" size={12} color="#666" /> {item.updatedAt?.toDate().toLocaleDateString() || item.createdAt?.toDate().toLocaleDateString()}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-bin-outline" size={18} color="#FF5252" />
            </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
      
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
            <View>
                {/* මෙතනදී තමයි වෙලාව අනුව සුබ පතන්නේ */}
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.headerTitle}>My Notes 📝</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#E0E0E0" style={{marginRight: 10}} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search notes..."
                placeholderTextColor="#E0E0E0"
                value={searchQuery}
                onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                    <Ionicons name="close-circle" size={20} color="#E0E0E0" />
                </TouchableOpacity>
            )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={filteredNotes} 
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name={searchQuery ? "search-outline" : "document-text-outline"} size={80} color="#E0E0E0" />
                <Text style={styles.emptyText}>
                    {searchQuery ? "No notes found matching your search." : "No notes yet. Start writing!"}
                </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('add')}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#6C63FF',
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  greeting: { fontSize: 16, color: '#E0E0E0', fontWeight: '600' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 45,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 16 },

  card: {
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#eee'
  },
  pinnedCard: {
    borderColor: '#FFD700',
    borderWidth: 1.5
  },
  cardLeftStrip: { width: 6, height: '100%' },
  cardContent: { flex: 1, padding: 15 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
  pinIcon: { padding: 5 },
  cardBody: { fontSize: 14, color: '#444', lineHeight: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  date: { fontSize: 12, color: '#666' },

  fab: {
    position: 'absolute', bottom: 30, right: 30,
    backgroundColor: '#6C63FF', width: 60, height: 60,
    borderRadius: 30, justifyContent: 'center', alignItems: 'center',
    elevation: 8,
  },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#888', marginTop: 10, fontSize: 16, textAlign: 'center' }
});
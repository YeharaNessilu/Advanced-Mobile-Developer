import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import Ionicons from '@expo/vector-icons/Ionicons'; // අයිකන් පාවිච්චි කරන්න

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onHandleLogin = () => {
    if (email !== '' && password !== '') {
      setLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log("Login Success");
            navigation.replace('home'); 
        })
        .catch((err) => Alert.alert("Login Error", "Invalid email or password."))
        .finally(() => setLoading(false));
    } else {
        Alert.alert("Error", "Please enter both email and password.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
      
      {/* 1. ඉහළ කොටස (Header / Branding Area) */}
      <View style={styles.header}>
        <Ionicons name="journal" size={80} color="#fff" />
        <Text style={styles.headerTitle}>Welcome Back!</Text>
        <Text style={styles.headerSubtitle}>Login to your notes</Text>
      </View>

      {/* 2. පහළ කොටස (Form Area) */}
      <View style={styles.footer}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            
            {/* Email Input */}
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={{marginRight: 10}} />
                <TextInput
                    style={styles.input}
                    placeholder="hello@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={{marginRight: 10}} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            {/* Login Button */}
            {loading ? (
                <ActivityIndicator size="large" color="#6C63FF" style={{marginTop: 20}} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
            )}

            {/* Signup Link */}
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                    <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C63FF', // Main Theme Color (Purple)
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    marginTop: 5,
  },
  footer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 50,
    elevation: 10, // Shadow effect
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#6C63FF',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: 'gray',
    fontSize: 14,
  },
  signupLink: {
    color: '#6C63FF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
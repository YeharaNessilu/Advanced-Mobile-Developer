import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Signup() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onHandleSignup = async () => {
    if (email !== '' && password !== '') {
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate('index'); // Login පිටුවට යවනවා
      } catch (err) {
        Alert.alert("Signup Error", err.message);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "Please enter email and password.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
      
      {/* 1. ඉහළ කොටස (Header) */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
            <Ionicons name="person-add" size={50} color="#6C63FF" />
        </View>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Sign up to get started!</Text>
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
                    placeholder="Enter your email"
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
                    placeholder="Create a password"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            {/* Signup Button */}
            {loading ? (
                <ActivityIndicator size="large" color="#6C63FF" style={{marginTop: 20}} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            )}

            {/* Login Link */}
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('index')}> 
                    <Text style={styles.loginLink}>Log In</Text>
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
    backgroundColor: '#6C63FF', // Purple Background
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
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
    elevation: 10,
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
  loginContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: 'gray',
    fontSize: 14,
  },
  loginLink: {
    color: '#6C63FF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
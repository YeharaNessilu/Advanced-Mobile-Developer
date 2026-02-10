import { useNavigation } from '@react-navigation/native'; // 1. Navigation Import කරගන්න ඕනේ
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase';

export default function Login() {
  const navigation = useNavigation(); // 2. Navigation Hook එක පාවිච්චි කරන්න
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onHandleLogin = () => {
    if (email !== '' && password !== '') {
      setLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log("Login Success");
            // Login වුනාම Home එකට යන්න
            navigation.replace('home'); 
        })
        .catch((err) => Alert.alert("Login Error", err.message))
        .finally(() => setLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Note App</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#f57c00" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>Log In</Text>
        </TouchableOpacity>
      )}

      <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
        <Text style={{color: 'gray', fontWeight: '600', fontSize: 14}}>Don't have an account? </Text>
        
        {/* 3. මෙතන Navigation එක හරිගස්සන්න */}
        <TouchableOpacity onPress={() => navigation.navigate('signup')}>
          <Text style={{color: '#f57c00', fontWeight: '600', fontSize: 14}}> Sign Up</Text>
        </TouchableOpacity>
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f57c00',
    alignSelf: 'center',
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: '#f57c00',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
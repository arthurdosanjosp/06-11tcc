import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth'; 

const Drawer = ({ onClose }) => {
  const router = useRouter();
  const [values, setValues] = useState({
    name: '',
    publicName: '',
    email: '',
    senha: '',
  });
  const [isEditing, setIsEditing] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'usuarios', user.uid); 
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setValues(userDoc.data());
          }
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (field, text) => {
    setValues((prev) => ({
      ...prev,
      [field]: text,
    }));
  };

  const handleNavigation = (path) => {
    router.push(path);
    onClose(); // Fecha o menu ao navegar para outra tela
  };

  const handleGoBack = () => {
    router.back(); // Função para voltar à tela anterior
    onClose(); // Fecha o menu ao voltar para a tela anterior
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Realiza o logout
      router.push('/cadastrar');    
} catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <View style={styles.drawer}>
      {/* Menu de navegação com fechamento */}
      <TouchableOpacity onPress={onClose} style={styles.menuIcon}>
        <Icon name="menu" size={30} color="#000" />
      </TouchableOpacity>
      
      {/* Cabeçalho com ícone de perfil */}
      <View style={styles.header}>
        <Icon name="account-circle" size={65} color="#000" />
        <View style={styles.userInfo}>
          {isEditing.name ? (
            <TextInput
              style={styles.input}
              value={values.name}
              onChangeText={(text) => handleChange('name', text)}
              onBlur={() => toggleEdit('name')}
            />
          ) : (
            <Text style={styles.infoValue}>{values.name}</Text>
          )}
          {isEditing.email ? (
            <TextInput
              style={styles.input}
              value={values.email}
              onChangeText={(text) => handleChange('email', text)}
              onBlur={() => toggleEdit('email')}
            />
          ) : (
            <Text style={styles.infoValue}>{values.email}</Text>
          )}
        </View>
      </View>

      {/* Itens do menu */}
      <View style={styles.items}></View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/blocos/areadtrabalho')} style={styles.item}>
          <Icon name="work" size={25} color="#696969" />
          <Text style={styles.itemText}>Área de Trabalho</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/meusblocos')} style={styles.item}>
          <Icon name="view-quilt" size={25} color="#696969" />
          <Text style={styles.itemText}>Meus Blocos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/favoritos')} style={styles.item}>
          <Icon name="favorite" size={25} color="#696969" />
          <Text style={styles.itemText}>Favoritos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/configuracoes')} style={styles.item}>
          <Icon name="settings" size={25} color="#696969" />
          <Text style={styles.itemText}>Configurações</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/conta/ajuda')} style={styles.item}>
          <Icon name="help" size={25} color="#696969" />
          <Text style={styles.itemText}>Ajuda</Text>
        </TouchableOpacity>
      </View>

      {/* Adicionando o botão de Logout */}
      <View style={styles.items}>
      <TouchableOpacity style={styles.item} onPress={() => router.push(handleLogout)}>
          <Icon name="exit-to-app" size={25} color="#696969" />
          <Text style={styles.itemText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 40,
    zIndex: 1000,
    paddingHorizontal: 10,
  },
  menuIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1001,
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10,
    marginTop: 40,
  },
  userInfo: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  infoValue: {
    fontSize: 18,
    color: '#000',
  },
  items: {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  itemText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#000',
  },
});

export default Drawer;

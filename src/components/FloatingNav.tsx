import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

interface NavItemProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    isActive?: boolean;
    onPress?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        className="items-center justify-center gap-1 w-12"
    >
        <MaterialIcons
            name={icon}
            size={24}
            color={isActive ? "#9f4bf6" : "#9ca3af"}
        />
        <Text className={`text-[10px] ${isActive ? 'font-space-bold text-primary-light' : 'font-space-medium text-gray-400'}`}>
            {label}
        </Text>
    </TouchableOpacity>
);

export const FloatingNav: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();

    return (
        <View className="absolute bottom-12 left-0 right-0 px-12 z-20">
            <BlurView
                intensity={50}
                tint="dark"
                className="w-full h-16 rounded-full overflow-hidden"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    elevation: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
            >
                <View className="flex-1 flex-row items-center justify-around">
                    <NavItem
                        icon="home"
                        label="Home"
                        isActive={route.name === 'Home'}
                        onPress={() => navigation.navigate('Home')}
                    />
                    <NavItem
                        icon="history"
                        label="History"
                        isActive={route.name === 'History'}
                        onPress={() => navigation.navigate('History')}
                    />
                    <NavItem
                        icon="person-outline"
                        label="Profile"
                        isActive={route.name === 'Profile'}
                        onPress={() => navigation.navigate('Profile')}
                    />
                </View>
            </BlurView>
        </View>
    );
};

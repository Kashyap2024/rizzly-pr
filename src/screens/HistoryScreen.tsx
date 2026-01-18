import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import Background from "../components/Background";
import { ScreenHeader } from "../components/ScreenHeader";
import { FloatingNav } from "../components/FloatingNav";
import { historyService, HistoryItem } from "../services/historyService";
import { RizzCard } from "../components/RizzCard";

export default function HistoryScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'All' | 'Pickup Line' | 'Reply Generator'>('All');

    const fetchHistory = async () => {
        try {
            const data = await historyService.getHistory();
            setHistory(data);
            applyFilter(data, activeFilter);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const applyFilter = (data: HistoryItem[], filter: string) => {
        if (filter === 'All') {
            setFilteredHistory(data);
        } else {
            setFilteredHistory(data.filter(item => item.type === filter));
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        applyFilter(history, activeFilter);
    }, [activeFilter, history]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderItem = ({ item }: { item: HistoryItem }) => (
        <View className="mb-6">
            <View className="flex-row items-center justify-between px-1 mb-2">
                <View className="flex-row items-center gap-2">
                    <View className={`w-2 h-2 rounded-full ${item.type === 'Pickup Line' ? 'bg-primary' : 'bg-blue-500'}`} />
                    <Text className="text-gray-400 text-[10px] font-space-bold uppercase tracking-widest">
                        {item.type}
                    </Text>
                </View>
                <Text className="text-gray-500 text-[10px] font-space-medium">
                    {formatDate(item.timestamp)}
                </Text>
            </View>
            <RizzCard
                text={item.text}
                onCopy={() => { }}
            // Feedback removed based on user request "remove the feedback option like and dislike"
            />
            {item.settings && (
                <View className="flex-row flex-wrap gap-2 mt-2 px-1">
                    {item.settings.vibe && item.settings.vibe !== 'default' && (
                        <View className="bg-white/5 px-2 py-0.5 rounded-full">
                            <Text className="text-[8px] text-gray-500 font-space-bold uppercase">{item.settings.vibe}</Text>
                        </View>
                    )}
                    {item.settings.targetGender && (
                        <View className="bg-white/5 px-2 py-0.5 rounded-full">
                            <Text className="text-[8px] text-gray-500 font-space-bold uppercase">{item.settings.targetGender}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-background-dark relative">
            <StatusBar style="light" />
            <Background />

            <ScreenHeader
                title="History"
                subtitle="Your Past Rizz"
                onBack={() => navigation.goBack()}
            />

            <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
                {/* Privacy Banner */}
                <View className="mx-4 mt-28 mb-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 flex-row items-start gap-3">
                    <MaterialIcons name="security" size={20} color="#9f4bf6" />
                    <View className="flex-1">
                        <Text className="text-primary-light font-space-bold text-[11px] uppercase tracking-wider mb-1">Privacy Mode Active</Text>
                        <Text className="text-gray-400 font-space-regular text-[10px] leading-relaxed">
                            Your history is stored <Text className="text-white font-space-bold">100% locally</Text> on this device. Deleting the app or logging out will clear all data.
                        </Text>
                    </View>
                </View>

                {/* Filter Bar */}
                <View className="px-4 mb-4 flex-row gap-2">
                    {['All', 'Pickup Line', 'Reply Generator'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setActiveFilter(f as any)}
                            className={`px-4 py-2 rounded-full border ${activeFilter === f ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                        >
                            <Text className={`text-[10px] font-space-bold ${activeFilter === f ? 'text-white' : 'text-gray-400'}`}>
                                {f === 'Pickup Line' ? 'Pickups' : f === 'Reply Generator' ? 'Replies' : 'All'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {loading && !refreshing ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#9f4bf6" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredHistory}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingTop: 10,
                            paddingHorizontal: 16,
                            paddingBottom: 150
                        }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#9f4bf6"
                                colors={["#9f4bf6"]}
                            />
                        }
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center pt-20">
                                <MaterialIcons name="history" size={64} color="rgba(255,255,255,0.1)" />
                                <Text className="text-gray-500 font-space-medium mt-4">No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} history yet.</Text>
                            </View>
                        }
                    />
                )}

                <FloatingNav />
            </SafeAreaView>
        </View>
    );
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_STORAGE_KEY = 'rizzly_local_history';

export interface HistoryItem {
    id: string;
    text: string;
    type: 'Pickup Line' | 'Reply Generator';
    timestamp: number;
    settings: {
        vibe?: string;
        flattery?: number;
        emoji?: string;
        targetGender?: string;
    };
}

export const historyService = {
    /**
     * Saves a new rizz item to local storage
     */
    async saveHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<HistoryItem> {
        try {
            const newItem: HistoryItem = {
                ...item,
                id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: Date.now(),
            };

            const existingHistory = await this.getHistory();
            const updatedHistory = [newItem, ...existingHistory];

            await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
            return newItem;
        } catch (error) {
            console.error('Error saving local history:', error);
            throw error;
        }
    },

    /**
     * Retrieves the full history from local storage
     */
    async getHistory(): Promise<HistoryItem[]> {
        try {
            const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
            return historyJson ? JSON.parse(historyJson) : [];
        } catch (error) {
            console.error('Error getting local history:', error);
            return [];
        }
    },

    /**
     * Clears all local history data
     */
    async clearHistory(): Promise<void> {
        try {
            await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing local history:', error);
        }
    }
};

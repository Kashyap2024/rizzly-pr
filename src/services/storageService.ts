import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';

const BUCKET_NAME = process.env.EXPO_PUBLIC_SUPABASE_BUCKET_NAME || 'chat-screenshots';

export const storageService = {
    /**
     * Uploads a chat screenshot to Supabase Storage using ArrayBuffer for stability
     * @param uri The local URI of the image
     * @param userId The ID of the current user for path structuring
     * @returns The path in the format: bucket/file_path
     */
    async uploadChatScreenshot(uri: string, userId: string): Promise<string> {
        try {
            // Read file as base64 string
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64' as any,
            });

            // Convert base64 to ArrayBuffer (more stable in React Native than FormData/Blob)
            const arrayBuffer = decode(base64);
            const fileName = `${Date.now()}.png`;
            const path = `${userId}/${fileName}`;

            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(path, arrayBuffer, {
                    contentType: 'image/png',
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                console.error('Supabase storage upload error:', error);
                throw error;
            }

            // Return path expected by backend: bucket/file_path
            return `${BUCKET_NAME}/${data.path}`;
        } catch (error) {
            console.error('Error in uploadChatScreenshot:', error);
            throw error;
        }
    }
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { historyService } from '../services/historyService';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    hasCompletedOnboarding: boolean;
    profile: { display_name: string; gender: string } | null;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
    const [profile, setProfile] = useState<{ display_name: string; gender: string } | null>(null);

    const checkProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('display_name, gender')
                .eq('id', userId)
                .single();

            if (error) {
                console.log('Profile fetch error (possibly new user):', error.message);
                return false;
            }

            const complete = !!(data?.display_name && data?.gender);
            setHasCompletedOnboarding(complete);
            if (complete) {
                setProfile({ display_name: data.display_name, gender: data.gender });
            } else {
                setProfile(null);
            }
            return complete;
        } catch (err) {
            console.error('Error checking profile:', err);
            return false;
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await checkProfile(user.id);
        }
    };

    useEffect(() => {
        // Configure Google Sign-In
        const config = {
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        };

        GoogleSignin.configure(config);

        // Initial session check
        const initializeAuth = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await checkProfile(session.user.id);
            }

            setLoading(false);
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await checkProfile(session.user.id);
            } else {
                setHasCompletedOnboarding(false);
                setProfile(null);
            }

            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await GoogleSignin.signIn();

            // Handle different library versions (v10 vs v11+)
            const idToken = userInfo.data?.idToken || (userInfo as any).idToken;

            if (!idToken) {
                throw new Error('No ID token present!');
            }

            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: idToken,
            });

            if (error) throw error;

            if (data.user) {
                await checkProfile(data.user.id);
            }
        } catch (error: any) {
            console.error('Google Sign-In Error:', error.message || error);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            await GoogleSignin.signOut();
            await supabase.auth.signOut();
            await historyService.clearHistory();
            setHasCompletedOnboarding(false);
            setProfile(null);
        } catch (error) {
            console.error('Sign Out Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, hasCompletedOnboarding, profile, signInWithGoogle, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

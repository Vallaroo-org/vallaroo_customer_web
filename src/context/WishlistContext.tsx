'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Product } from '../app/actions/get-products';

// Define Wishlist Item - keeping it aligned with Product interface but simpler
export interface WishlistItem {
    id: string;
    name: string;
    product: Product; // Keeping full product to restore later
    addedAt: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load wishlist from local storage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('vallaroo_wishlist');
        if (savedWishlist) {
            try {
                setWishlistItems(JSON.parse(savedWishlist));
            } catch (error) {
                console.error('Failed to parse wishlist from local storage:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save wishlist to local storage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('vallaroo_wishlist', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, isLoaded]);

    const addToWishlist = useCallback((product: Product) => {
        setWishlistItems((prev) => {
            if (prev.some(item => item.id === product.id)) return prev;
            return [...prev, {
                id: product.id,
                name: product.name,
                product: product,
                addedAt: new Date().toISOString()
            }];
        });
    }, []);

    const removeFromWishlist = useCallback((productId: string) => {
        setWishlistItems((prev) => prev.filter(item => item.id !== productId));
    }, []);

    const isInWishlist = useCallback((productId: string) => {
        return wishlistItems.some(item => item.id === productId);
    }, [wishlistItems]);

    const clearWishlist = useCallback(() => {
        setWishlistItems([]);
    }, []);

    const getWishlistCount = useCallback(() => {
        return wishlistItems.length;
    }, [wishlistItems]);

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
                getWishlistCount,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import StoryViewer from './StoryViewer';

interface Story {
    id: string;
    media_url: string;
    media_type: string;
    created_at: string;
    shop_id: string;
}

interface ShopWithStories {
    shop_id: string;
    shop_name: string;
    shop_logo: string;
    stories: Story[];
}

const FollowingStories = () => {
    const [followedObs, setFollowedObs] = useState<ShopWithStories[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShopIndex, setSelectedShopIndex] = useState<number | null>(null);
    const { t, locale } = useLanguage();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) {
                    setLoading(false);
                    return;
                }

                // 1. Get shops user follows
                const { data: follows, error: followError } = await supabase
                    .from('shop_followers')
                    .select('shop_id')
                    .eq('follower_id', session.user.id);

                if (followError || !follows || follows.length === 0) {
                    setLoading(false);
                    return;
                }

                const shopIds = follows.map(f => f.shop_id);

                // 2. Get active stories for these shops
                const now = new Date().toISOString();
                const { data: stories, error: storiesError } = await supabase
                    .from('stories')
                    .select('*, shops (id, name, name_ml, logo_url)')
                    .in('shop_id', shopIds)
                    .gt('expires_at', now)
                    .order('created_at', { ascending: true });

                if (storiesError || !stories) {
                    setLoading(false);
                    return;
                }

                // 3. Group stories by shop
                const grouped: Record<string, ShopWithStories> = {};

                stories.forEach(story => {
                    const shop = story.shops as any; // Type assertion for joined data
                    if (!shop) return;

                    if (!grouped[shop.id]) {
                        grouped[shop.id] = {
                            shop_id: shop.id,
                            shop_name: locale === 'ml' ? (shop.name_ml || shop.name) : shop.name,
                            shop_logo: shop.logo_url,
                            stories: []
                        };
                    }
                    grouped[shop.id].stories.push({
                        id: story.id,
                        media_url: story.media_url,
                        media_type: story.media_type,
                        created_at: story.created_at,
                        shop_id: story.shop_id
                    });
                });

                setFollowedObs(Object.values(grouped));
            } catch (err) {
                console.error('Error fetching following stories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [locale]);

    if (loading) return null; // Or a skeleton loader
    if (followedObs.length === 0) return null;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 px-1">{t('followingUpdates') || 'Updates'}</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {followedObs.map((item, index) => (
                    <div
                        key={item.shop_id}
                        className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 group"
                        onClick={() => setSelectedShopIndex(index)}
                    >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600 group-hover:scale-105 transition-transform">
                            <div className="w-full h-full rounded-full border-2 border-background overflow-hidden bg-muted">
                                {item.shop_logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.shop_logo} alt={item.shop_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold">
                                        {item.shop_name.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-center truncate w-20 sm:w-24">
                            {item.shop_name}
                        </span>
                    </div>
                ))}
            </div>

            {selectedShopIndex !== null && (
                <StoryViewer
                    stories={followedObs[selectedShopIndex].stories}
                    onClose={() => setSelectedShopIndex(null)}
                />
            )}
        </div>
    );
};

export default FollowingStories;

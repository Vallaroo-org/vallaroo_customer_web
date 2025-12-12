'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShopCard from '../components/ShopCard';
import ProductCard from '../components/ProductCard';
import FollowingStories from '../components/FollowingStories';
import { fetchShops, fetchProducts, fetchCategories, Shop, Product, Category } from '../lib/api';
import { Search, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { getDrivingDistances } from '../lib/locationService';

const DiscoverPage = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'shops' | 'products'>('products');
  const { latitude, longitude, requestLocation, permissionStatus, isLoading: isLocationLoading } = useLocation();
  const [distancesCalculated, setDistancesCalculated] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [shopsData, productsData, categoriesData] = await Promise.all([
          fetchShops(),
          fetchProducts(),
          fetchCategories()
        ]);
        setShops(shopsData);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate distances when location and shops are available
  useEffect(() => {
    const calculateDistances = async () => {
      if (latitude && longitude && shops.length > 0 && !distancesCalculated) {
        const distances = await getDrivingDistances(latitude, longitude, shops);

        setShops(prevShops => {
          const updatedShops = prevShops.map(shop => ({
            ...shop,
            distance: distances[shop.id] ? `${distances[shop.id]} km` : shop.distance
          }));

          // Sort by distance if available
          return updatedShops.sort((a, b) => {
            const distA = distances[a.id] ? parseFloat(distances[a.id]) : Infinity;
            const distB = distances[b.id] ? parseFloat(distances[b.id]) : Infinity;

            // If both are Infinity (no distance), keep original order or sort by some other metric
            if (distA === Infinity && distB === Infinity) return 0;
            return distA - distB;
          });
        });

        setDistancesCalculated(true);
      }
    };

    calculateDistances();
  }, [latitude, longitude, shops.length, distancesCalculated]);

  const { t, locale } = useLanguage();

  const getLocalizedContent = (item: any, field: string) => {
    if (locale === 'ml') {
      return item[`${field}_ml`] || item[field];
    }
    return item[field];
  };

  const filteredShops = shops.filter((shop) => {
    const name = getLocalizedContent(shop, 'name');
    const city = getLocalizedContent(shop, 'city');
    const description = getLocalizedContent(shop, 'description');

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (city && city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'All' ||
      name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      (description && description.toLowerCase().includes(activeCategory.toLowerCase())) ||
      (city && city.toLowerCase().includes(activeCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const filteredProducts = products.filter((product) => {
    const name = getLocalizedContent(product, 'name');
    const description = getLocalizedContent(product, 'description');
    const shopName = product.shops ? getLocalizedContent(product.shops, 'name') : '';

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shopName && shopName.toLowerCase().includes(searchQuery.toLowerCase()));

    const categoryName = categories.find(c => c.id === product.category_id)?.name;

    const matchesCategory = activeCategory === 'All' ||
      categoryName === activeCategory ||
      name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      (description && description.toLowerCase().includes(activeCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-screen-2xl">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('discoverLocal')}</h1>
              <p className="text-muted-foreground max-w-2xl">
                {t('exploreBest')}
              </p>
            </div>

            {/* Location Request Button */}
            {!latitude && (
              <button
                onClick={requestLocation}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium self-start md:self-center"
                disabled={isLocationLoading}
              >
                <MapPin className="w-4 h-4" />
                {isLocationLoading ? 'Locating...' : permissionStatus === 'denied' ? 'Location Denied' : t('useCurrentLocation')}
              </button>
            )}
          </div>

          <FollowingStories />

          {/* Search Bar */}
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="search"
              className="block w-full p-4 pl-10 text-sm border border-input rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none shadow-sm transition-all placeholder:text-muted-foreground"
              placeholder={activeTab === 'shops' ? t('searchShops') : t('searchExample')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-background focus:ring-primary ${activeTab === 'products'
              ? 'bg-background shadow-md text-foreground'
              : 'text-muted-foreground hover:bg-background/50 hover:text-foreground hover:shadow-sm'
              }`}
          >
            {t('products')}
          </button>
          <button
            onClick={() => setActiveTab('shops')}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-background focus:ring-primary ${activeTab === 'shops'
              ? 'bg-background shadow-md text-foreground'
              : 'text-muted-foreground hover:bg-background/50 hover:text-foreground hover:shadow-sm'
              }`}
          >
            {t('shops')}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'shops' ? (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">{t('nearbyShops')}</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 rounded-lg bg-muted animate-pulse"></div>
                ))}
              </div>
            ) : filteredShops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredShops.map((shop) => (
                  <ShopCard
                    key={shop.id}
                    id={shop.id}
                    name={getLocalizedContent(shop, 'name')}
                    category={getLocalizedContent(shop, 'city') || 'Local Store'}
                    imageUrl={shop.cover_image_url || ''}
                    logoUrl={shop.logo_url}
                    rating={shop.rating || 0}
                    distance={shop.distance || (latitude ? 'Calculating...' : 'Nearby')}
                    deliveryTime={shop.delivery_time || 'Standard'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed rounded-lg">
                <p className="text-muted-foreground">{t('noShopsFound')}</p>
              </div>
            )}
          </section>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">{t('freshFinds')}</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-48 rounded-lg bg-muted animate-pulse"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={getLocalizedContent(product, 'name')}
                    price={product.price}
                    mrp={product.mrp}
                    imageUrl={product.image_urls?.[0] || null}
                    shopName={product.shops ? getLocalizedContent(product.shops, 'name') : 'Unknown Shop'}
                    shopId={product.shop_id}
                    shopPhone={product.shops?.phone_number || undefined}
                    shopLogo={product.shops?.logo_url || undefined}
                    category={getLocalizedContent(categories.find(c => c.id === product.category_id) || {}, 'name')}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed rounded-lg">
                <p className="text-muted-foreground">{t('noProductsFound')}</p>
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DiscoverPage;
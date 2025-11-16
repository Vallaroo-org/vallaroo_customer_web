'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_urls: string[];
  shop_id: string;
}

const ProductPage = ({ params }: { params: { productId: string } }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = getSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.productId)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProduct(data);
        if (data.image_urls && data.image_urls.length > 0) {
          setSelectedImage(data.image_urls[0]);
        }
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-500">No Image</span>
            )}
          </div>
          {product.image_urls && product.image_urls.length > 1 && (
            <div className="flex justify-center p-2 space-x-2 mt-4">
              {product.image_urls.map((url, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 border-2 rounded-md cursor-pointer ${selectedImage === url ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(url)}
                >
                  <img
                    src={url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl text-gray-700 mt-2">₹{product.price.toFixed(2)}</p>
          <p className="text-gray-600 mt-4">{product.description || 'No description available.'}</p>
          <a
            href={`/store/${product.shop_id}`}
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            Back to store
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
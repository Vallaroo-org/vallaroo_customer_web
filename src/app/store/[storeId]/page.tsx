import ShareButton from '@/components/ShareButton';
import { getSupabaseClient } from '@/lib/supabase';
import ProductList from '@/components/ProductList';
import StoreDetails from '@/components/StoreDetails';

// Using `props: any` because the params object is unexpectedly a Promise
export default async function StorePage(props: any) {
  const supabase = getSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  // Await the params promise to get the actual parameters
  const params = await props.params;
  const { storeId } = params;

  const { data: store, error: storeError } = await supabase
    .from('shops')
    .select('*')
    .eq('id', storeId)
    .single();

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', storeId);

  console.log('Store data:', JSON.stringify(store, null, 2));
  console.log('Products data:', JSON.stringify(products, null, 2));

  if (storeError || !store) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-gray-800">404 - Store Not Found</h1>
          <p className="text-xl text-gray-600 mt-4">
            We couldn't find the store you're looking for.
          </p>
          <div className="mt-8 p-4 border rounded-md bg-red-50 text-left">
            <h3 className="font-bold text-red-800">Debugging Information:</h3>
            <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
              {JSON.stringify({
                storeId,
                storeFound: !!store,
                storeError,
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      {store.cover_image_url && (
        <div className="w-full h-48 sm:h-64 md:h-80 bg-gray-200">
          <img
            src={store.cover_image_url}
            alt={`${store.name} cover`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <header className="bg-white rounded-lg shadow-md p-6 mb-8 -mt-24 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full mr-6 flex-shrink-0 border-4 border-white">
                {store.logo_url && (
                  <img
                    src={store.logo_url}
                    alt={store.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{store.name}</h1>
                <p className="text-lg text-gray-600">{store.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ShareButton store={store} />
            </div>
          </div>
        </header>

        {/* Store Details and Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <StoreDetails store={store} />

          {/* Right Column: Products */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Products</h2>
              {productsError && (
                <div className="mt-8 p-4 border rounded-md bg-red-50 text-left">
                  <h3 className="font-bold text-red-800">Products Error:</h3>
                  <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                    {JSON.stringify(productsError, null, 2)}
                  </pre>
                </div>
              )}
              {products && <ProductList products={products} shop={store} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

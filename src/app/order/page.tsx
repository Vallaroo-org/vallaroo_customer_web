'use client';

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

import Navbar from '@/components/Navbar';

interface OrderItem {
    productId: string;
    quantity: number;
    product?: any;
    total?: number;
}

function OrderPageContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const shopId = searchParams.get('shop');
    const itemsString = searchParams.get('items');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [shop, setShop] = useState<any>(null);
    const [finalItems, setFinalItems] = useState<(OrderItem & { product: any; total: number })[]>([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [customerDetails, setCustomerDetails] = useState<any>(null);

    useEffect(() => {
        const loadOrder = async () => {
            setLoading(true);
            try {
                if (orderId) {
                    // Fetch from DB
                    const { data: order, error: fetchError } = await supabase
                        .from('orders')
                        .select(`
                            *,
                            shop:shops(*),
                            order_items(
                                quantity,
                                total,
                                product:products(*)
                            )
                        `)
                        .eq('id', orderId)
                        .single();

                    if (fetchError) throw fetchError;
                    if (!order) throw new Error('Order not found');

                    setShop(order.shop);
                    setGrandTotal(order.total_amount);
                    setCustomerDetails({
                        name: order.customer_name,
                        phone: order.customer_phone,
                        address: order.customer_address
                    });

                    // Map items
                    setFinalItems(order.order_items.map((item: any) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        product: item.product,
                        total: item.total
                    })));

                } else if (shopId && itemsString) {
                    // LEGACY: URL Params
                    const { data: shopData, error: shopError } = await supabase
                        .from('shops')
                        .select('name, address, location_name, logo_url')
                        .eq('id', shopId)
                        .single();

                    if (shopError || !shopData) throw new Error('Shop not found');
                    setShop(shopData);

                    // Parse Items
                    const parsedItems: OrderItem[] = itemsString.split(',').map((pair) => {
                        const [id, qty] = pair.split(':');
                        return { productId: id, quantity: parseInt(qty, 10) || 1 };
                    });

                    const productIds = parsedItems.map((i) => i.productId);
                    const { data: products } = await supabase
                        .from('products')
                        .select('id, name, price, image_urls')
                        .in('id', productIds);

                    const prodMap = new Map(products?.map((p) => [p.id, p]));
                    let total = 0;

                    const mappedItems = parsedItems
                        .map((item) => {
                            const product = prodMap.get(item.productId);
                            if (!product) return null;
                            const itemTotal = product.price * item.quantity;
                            total += itemTotal;
                            return { ...item, product, total: itemTotal };
                        })
                        .filter(Boolean) as any;

                    setFinalItems(mappedItems);
                    setGrandTotal(total);
                } else {
                    setError('Invalid order link');
                }
            } catch (err: any) {
                console.error("Error loading order:", err);
                setError(err.message || 'Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId, shopId, itemsString]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-muted-foreground">
                <p>Loading order details...</p>
            </div>
        );
    }

    if (error || !shop) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-muted-foreground">
                <p>{error || 'Order not found'}</p>
                {orderId && <p className="text-sm mt-2">ID: {orderId}</p>}
            </div>
        );
    }

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-card text-card-foreground shadow-lg rounded-2xl overflow-hidden border border-border">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-white">
                        <h1 className="text-3xl font-bold">Order Summary</h1>
                        <p className="opacity-90 mt-2">
                            Receipt from <span className="font-semibold">{shop.name}</span>
                        </p>
                        {orderId && <p className="text-xs opacity-75 mt-1">Order #{orderId.slice(0, 8)}</p>}
                    </div>

                    <div className="p-8">
                        {/* Shop Info */}
                        <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-border">
                            {shop.logo_url ? (
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border">
                                    <Image
                                        src={shop.logo_url}
                                        alt={shop.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                </div>
                            )}
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">{shop.name}</h2>
                                <p className="text-muted-foreground">{shop.location_name || shop.address}</p>
                            </div>
                        </div>

                        {/* Customer Details (If available) */}
                        {customerDetails && (
                            <div className="mb-8 p-4 bg-muted/50 rounded-lg">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Customer</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Name</p>
                                        <p className="font-medium text-foreground">{customerDetails.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Phone</p>
                                        <p className="font-medium text-foreground">{customerDetails.phone}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-muted-foreground">Address</p>
                                        <p className="font-medium text-foreground">{customerDetails.address}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Items List */}
                        <div className="space-y-6">
                            {finalItems.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            {(item.product.image_url || (item.product.image_urls && item.product.image_urls.length > 0)) ? (
                                                <Image
                                                    src={item.product.image_url || item.product.image_urls[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-muted rounded-lg p-2 font-mono font-bold text-muted-foreground">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-foreground">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                ₹{item.product.price} per unit
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-semibold text-foreground">
                                        ₹{item.total}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="border-t border-border mt-8 pt-8 flex justify-between items-center">
                            <span className="text-lg font-medium text-muted-foreground">Total Amount</span>
                            <span className="text-3xl font-bold text-green-600 dark:text-green-500">
                                ₹{grandTotal}
                            </span>
                        </div>

                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            <p>Order details generated by Vallaroo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <main className="flex-1">
                <Suspense fallback={<div className="text-center p-8 text-muted-foreground">Loading...</div>}>
                    <OrderPageContent />
                </Suspense>
            </main>
        </div>
    );
}

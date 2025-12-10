import React from 'react';
import Link from 'next/link';

export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping & Delivery Policy</h1>
                    <p className="text-gray-500 mb-8">Last updated on Dec 9 2025</p>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                        <p>
                            For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only.
                        </p>
                        <p>
                            Orders are shipped within 0-7 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms.
                        </p>
                        <p>
                            ADAKAM JANARDHANAN SUSMITH is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 0-7 days rom the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
                        </p>
                        <p>
                            Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration.
                        </p>
                        <p>
                            For any issues in utilizing our services you may contact our helpdesk on 8137946044 or support@vallaroo.com
                        </p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                        <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

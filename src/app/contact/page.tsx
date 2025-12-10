import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
                    <p className="text-gray-500 mb-12">Last updated on Dec 9 2025</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                            <p className="text-gray-600 text-sm">
                                Adakam House, Kallar,<br />
                                Rajapuram, Kasargod<br />
                                kanhangad KERALA 671532
                            </p>
                        </div>

                        <div className="flex flex-col items-center p-6 bg-green-50 rounded-xl">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <Phone size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                            <p className="text-gray-600 text-sm">
                                8137946044
                            </p>
                        </div>

                        <div className="flex flex-col items-center p-6 bg-purple-50 rounded-xl">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                            <p className="text-gray-600 text-sm">
                                support@vallaroo.com
                            </p>
                        </div>
                    </div>

                    <div className="text-left bg-gray-50 p-6 rounded-xl space-y-2">
                        <p className="text-gray-600"><span className="font-semibold text-gray-900">Merchant Legal Entity Name:</span> ADAKAM JANARDHANAN SUSMITH</p>
                        <p className="text-gray-600"><span className="font-semibold text-gray-900">Registered Address:</span> Adakam House, Kallar, Rajapuram, Kasargod kanhangad KERALA 671532</p>
                        <p className="text-gray-600"><span className="font-semibold text-gray-900">Operational Address:</span> Adakam House, Kallar, Rajapuram, Kasargod kanhangad KERALA 671532</p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                        <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

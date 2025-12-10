import React from 'react';
import Link from 'next/link';

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancellation & Refund Policy</h1>
                    <p className="text-gray-500 mb-8">Last updated on Dec 9 2025</p>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                        <p>
                            ADAKAM JANARDHANAN SUSMITH believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
                        </p>

                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                Cancellations will be considered only if the request is made within Same day of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
                            </li>
                            <li>
                                ADAKAM JANARDHANAN SUSMITH does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                            </li>
                            <li>
                                In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within Same day of receipt of the products.
                            </li>
                            <li>
                                In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within Same day of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
                            </li>
                            <li>
                                In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
                            </li>
                            <li>
                                In case of any Refunds approved by the ADAKAM JANARDHANAN SUSMITH, it'll take 1-2 days for the refund to be processed to the end customer.
                            </li>
                        </ul>
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

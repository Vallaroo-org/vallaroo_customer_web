import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-gray-500 mb-8">Last updated on Dec 9 2025</p>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
                        <p>
                            This privacy policy sets out how ADAKAM JANARDHANAN SUSMITH uses and protects any information that you give ADAKAM JANARDHANAN SUSMITH when you visit their website and/or agree to purchase from them.
                        </p>
                        <p>
                            ADAKAM JANARDHANAN SUSMITH is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement.
                        </p>
                        <p>
                            ADAKAM JANARDHANAN SUSMITH may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mt-6">We may collect the following information:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Name</li>
                            <li>Contact information including email address</li>
                            <li>Demographic information such as postcode, preferences and interests, if required</li>
                            <li>Other information relevant to customer surveys and/or offers</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 mt-6">What we do with the information we gather</h3>
                        <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Internal record keeping.</li>
                            <li>We may use the information to improve our products and services.</li>
                            <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
                            <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</li>
                            <li>We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 mt-6">How we use cookies</h3>
                        <p>
                            A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
                        </p>
                        <p>
                            We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
                        </p>
                        <p>
                            Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
                        </p>
                        <p>
                            You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mt-6">Controlling your personal information</h3>
                        <p>You may choose to restrict the collection or use of your personal information in the following ways:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
                            <li>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at support@vallaroo.com</li>
                        </ul>
                        <p>
                            We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
                        </p>
                        <p>
                            If you believe that any information we are holding on you is incorrect or incomplete, please write to Adakam House, Kallar, Rajapuram, Kasargod kanhangad KERALA 671532 . or contact us at 8137946044 or support@vallaroo.com as soon as possible. We will promptly correct any information found to be incorrect.
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

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageTemplate = ({ title, content }: { title: string, content: React.ReactNode }) => (
    <div className="container mx-auto px-4 py-32 max-w-4xl min-h-screen">
        <Link to="/" className="inline-flex items-center text-violet-600 hover:text-violet-700 font-medium mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-gray-900 mb-8">{title}</h1>
        <div className="prose prose-lg prose-violet max-w-none text-gray-600">
            {content}
        </div>
    </div>
);

export function AboutUs() {
    return <PageTemplate title="About Us" content={
        <div className="space-y-6">
            <p>Welcome to LUMORA. We believe that skincare goes beyond surface-level beauty—it's about how you feel in your own skin.</p>
            <p>Our mission is to provide high-quality, cruelty-free, and vegan skincare products that are accessible to everyone, all while promoting self-care and confidence.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cruelty-Free & Vegan:</strong> We love animals as much as we love skincare.</li>
                <li><strong>Dermatologist-Approved:</strong> Formulated with ingredients backed by science.</li>
                <li><strong>Transparency:</strong> No hidden ingredients, no false promises.</li>
            </ul>
        </div>
    } />;
}

export function Contact() {
    return <PageTemplate title="Contact Us" content={
        <div className="space-y-6">
            <p>We'd love to hear from you! Whether you have a question about our products, your order, or just want to say hello, our team is here to help.</p>
            <div className="bg-violet-50 p-6 rounded-2xl mt-8">
                <h3 className="font-bold text-gray-900 mb-2">Customer Support</h3>
                <p>Email: <a href="mailto:support@lumora.com" className="text-violet-600">support@lumora.com</a></p>
                <p>Hours: Mon-Fri, 9am - 5pm EST</p>
            </div>
        </div>
    } />;
}

export function FAQ() {
    return <PageTemplate title="Frequently Asked Questions" content={
        <div className="space-y-8">
            <div>
                <h3 className="font-bold text-gray-900 mb-2">Are your products vegan and cruelty-free?</h3>
                <p>Yes! Every single product in the Lumora line is 100% vegan and certified cruelty-free. We never test on animals.</p>
            </div>
            <div>
                <h3 className="font-bold text-gray-900 mb-2">How long does shipping take?</h3>
                <p>Standard shipping usually takes 3-5 business days within the contiguous US. International shipping can take 7-14 business days.</p>
            </div>
            <div>
                <h3 className="font-bold text-gray-900 mb-2">Do you offer returns?</h3>
                <p>We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, please contact us for a return authorization.</p>
            </div>
        </div>
    } />;
}

export function Shipping() {
    return <PageTemplate title="Shipping Information" content={
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Domestic Shipping (US)</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Standard Shipping (3-5 business days): $5.99</li>
                <li>Express Shipping (1-2 business days): $14.99</li>
                <li>Free Standard Shipping on all orders over $50!</li>
            </ul>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">International Shipping</h2>
            <p>We currently ship to over 50 countries globally. Shipping rates and times vary depending on the destination. Customs fees and duties may apply and are the responsibility of the customer.</p>
        </div>
    } />;
}

export function Returns() {
    return <PageTemplate title="Returns & Exchanges" content={
        <div className="space-y-6">
            <p>Your satisfaction is our top priority. If you do not love your Lumora products, we offer a 30-day money-back guarantee.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Return</h2>
            <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our support team at <a href="mailto:support@lumora.com" className="text-violet-600">support@lumora.com</a> with your order number.</li>
                <li>We will provide a pre-paid return label.</li>
                <li>Print the label, attach it to your package, and drop it off at the designated carrier.</li>
                <li>Refunds are processed within 5-7 business days after we receive your return.</li>
            </ol>
        </div>
    } />;
}

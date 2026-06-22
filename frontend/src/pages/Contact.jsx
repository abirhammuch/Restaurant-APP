import React, { useRef, useState } from 'react';

import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
    const form = useRef();
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const sendEmail = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setStatus({ type: '', message: '' });

        try {
            // ✅ Using your actual keys from .env
            const result = await emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,   // 'gmail_service'
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,  // 'template_p3s4s4r'
                form.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY    // 'AxvhC5X2UpbLbbUvm'
            );
            
            console.log('Email sent:', result.text);
            setStatus({ 
                type: 'success', 
                message: 'Message sent successfully! We\'ll get back to you soon.' 
            });
            form.current.reset();
        } catch (error) {
            console.error('Failed to send email:', error);
            setStatus({ 
                type: 'error', 
                message: 'Failed to send message. Please try again later.' 
            });
        } finally {
            setIsSending(false);
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
            
            {/* Status Message */}
            {status.message && (
                <div className={`mb-6 p-4 rounded-lg text-center ${
                    status.type === 'success' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                }`}>
                    {status.message}
                </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
                    <form ref={form} onSubmit={sendEmail} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Name</label>
                            <input 
                                type="text" 
                                name="user_name"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary"
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input 
                                type="email" 
                                name="user_email"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Message</label>
                            <textarea 
                                name="message"
                                rows="5"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-primary"
                                placeholder="Your message..."
                                required
                            ></textarea>
                        </div>
                        <button 
                            type="submit"
                            disabled={isSending}
                            className="cursor-pointer bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dull transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FaPhone className="text-primary text-xl text-orange-500" />
                            <div>
                                <p className="font-semibold">Phone</p>
                                <p className="text-gray-600">+2 (51) 973-769-266</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaEnvelope className="text-primary text-xl text-orange-500" />
                            <div>
                                <p className="font-semibold">Email</p>
                                <p className="text-gray-600">abirhammuch526@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-primary text-xl text-orange-500" />
                            <div>
                                <p className="font-semibold">Address</p>
                                <p className="text-gray-600">Poly Street, Bahir Dar City, Ethiopia</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaClock className="text-primary text-xl text-orange-500" />
                            <div>
                                <p className="font-semibold">Business Hours</p>
                                <p className="text-gray-600">Monday - Friday: 9am - 8pm</p>
                                <p className="text-gray-600">Saturday: 10am - 6pm</p>
                                <p className="text-gray-600">Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
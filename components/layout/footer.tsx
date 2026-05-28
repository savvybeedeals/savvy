"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, Send, Globe, Heart, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-gray-300 font-sans mt-10" aria-label="Site Footer">
      {/* 1. الجزء العلوي: تم تقليل py من 12 إلى 6 لتصغير المسافة */}
      <div className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">
              JOIN THE <span className="text-sky-500">BEE</span> HIVE! 🐝
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              Join our platform today to unlock access to the latest verified coupons and exclusive daily deals.
            </p>
          </div>
          <div className="w-full max-w-md flex justify-center md:justify-end">
            <Link 
              href="/register" 
              className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 text-white font-bold py-2.5 px-12 rounded-full text-sm transition-all shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2 active:scale-95"
              aria-label="Subscribe to our newsletter by registering an account"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              Subscribe Now
            </Link>
          </div>
        </div>
      </div>

      {/* 2. الجزء الأوسط: تم تقليل py من 16 إلى 8 وتقليل الـ gap بين الأعمدة */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* العمود الأول: عن الموقع */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 group focus:outline-none focus:underline" aria-label="Savvy Bee Deals Homepage">
            <div className="w-7 h-7 bg-[#FFD700] flex items-center justify-center [clip-path:polygon(25%_0%,_75%_0%,_100%_50%,_75%_100%,_25%_100%,_0%_50%)] group-hover:rotate-12 transition-transform" aria-hidden="true">
               <span className="text-black font-black text-xs">S</span>
            </div>
            <span className="text-lg font-black text-white tracking-tighter uppercase">
              Savvy<span className="text-sky-500">Bee</span>Deals
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-gray-400">
            The world's smartest coupon platform. Helping you save money on your favorite US & UK brands with verified deals.
          </p>
          <div className="flex items-center gap-4 text-gray-500">
             <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500/50">Follow Us</span>
             <div className="h-px w-8 bg-gray-800" aria-hidden="true"></div>
             <Link href="#" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors" aria-label="Visit our Global Website">
               <Globe className="w-4 h-4" />
             </Link>
             <Link href="mailto:hello@savvybeedeals.com" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors" aria-label="Contact us via Email">
               <Mail className="w-4 h-4" />
             </Link>
          </div>
        </div>

        {/* العمود الثاني: روابط سريعة */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px] border-l-2 border-sky-500 pl-3">Quick Links</h4>
          <ul className="space-y-3 text-xs font-medium">
            <li><Link href="/coupons" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">Latest Coupons</Link></li>
            <li><Link href="/stores" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">Top Stores</Link></li>
            <li><Link href="/deals" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">Flash Deals</Link></li>
            <li><Link href="/discounts" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">Discounts</Link></li>
          </ul>
        </div>

        {/* العمود الثالث: الدعم */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px] border-l-2 border-sky-500 pl-3">Support</h4>
          <ul className="space-y-3 text-xs font-medium">
            <li><Link href="/support" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">Support Center</Link></li>
            <li><Link href="/about" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">Contact Us</Link></li>
            <li><Link href="/privacy" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* العمود الرابع: الاتصال */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-[10px] border-l-2 border-sky-500 pl-3">Get in Touch</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2 group">
              <MapPin className="w-4 h-4 text-sky-500 shrink-0 group-hover:animate-bounce" aria-hidden="true" />
              <span className="text-gray-400">Global Coupon & Promo Codes Store</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-500 shrink-0" aria-hidden="true" />
              <a href="mailto:hello@savvybeedeals.com" className="text-gray-400 hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">hello@savvybeedeals.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-500 shrink-0" aria-hidden="true" />
              <a href="tel:+15557288923" className="text-gray-400 hover:text-sky-500 focus:outline-none focus:text-sky-500 transition-colors">+1 (555) SAVVY-BEE</a>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. الجزء السفلي: تم تقليل py من 8 إلى 4 */}
      <div className="border-t border-gray-800/30 py-4 bg-[#151515]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
          <p>© {currentYear} Savvy Bee Deals. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" aria-hidden="true" />
              <span>For Shoppers</span>
            </div>
            <div className="h-3 w-px bg-gray-800" aria-hidden="true"></div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-sky-500" aria-hidden="true" />
              <span>SSL Secured</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
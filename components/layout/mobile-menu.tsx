"use client";

import React from 'react';
import Link from 'next/link';
import { User, LogIn, Ticket, Tag, TrendingDown, Flame, X, LogOut, Store, Smartphone } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Category } from '@/types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categoriesTree: Category[];
  getSafeSlug: (cat: any) => string;
  appLinks: { googlePlay?: string; appStore?: string } | null; // الحقل المضاف لحل خطأ الـ TypeScript
}

export default function MobileMenu({ isOpen, onClose, categoriesTree, getSafeSlug, appLinks }: MobileMenuProps) {
  const { user, logout } = useAuth();

  // منطق جلب اسم العميل بشكل ديناميكي من الميتاداتا لشاشة الموبايل أيضاً
  const displayName = user?.user_metadata?.first_name || user?.user_metadata?.name || user?.email?.split('@')[0] || "Account";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex md:hidden">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Menu Content */}
      <div className="relative ml-auto w-full max-w-xs h-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <span className="text-base font-black text-slate-800">Menu</span>
            <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <Link
              href="/stores"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-sky-500 font-bold text-sm transition-colors"
            >
              <Store className="w-4 h-4" />
              <span>Stores</span>
            </Link>
            <Link
              href="/coupons"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-sky-500 font-bold text-sm transition-colors"
            >
              <Ticket className="w-4 h-4" />
              <span>Coupons</span>
            </Link>
            <Link
              href="/deals"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-sky-500 font-bold text-sm transition-colors"
            >
              <Tag className="w-4 h-4" />
              <span>Deals</span>
            </Link>
            <Link
              href="/discounts"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-sky-500 font-bold text-sm transition-colors"
            >
              <TrendingDown className="w-4 h-4" />
              <span>Discounts</span>
            </Link>
            <Link
              href="/trending"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-orange-600 hover:bg-orange-50 font-bold text-sm transition-colors"
            >
              <Flame className="w-4 h-4 fill-orange-600" />
              <span>Trending</span>
            </Link>
          </nav>

          {/* App Download Links in Mobile */}
          {(appLinks?.googlePlay || appLinks?.appStore) && (
            <div className="pt-4 border-t border-gray-100">
              <span className="px-4 text-xs font-black text-slate-400 block mb-2 uppercase tracking-wider">Get Our App</span>
              <div className="flex flex-col gap-2">
                {appLinks.googlePlay && (
                  <a
                    href={appLinks.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-all"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-sky-500" />
                    <span>Google Play Store</span>
                  </a>
                )}
                {appLinks.appStore && (
                  <a
                    href={appLinks.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-all"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-sky-500" />
                    <span>Apple App Store</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Actions Account */}
        <div className="pt-6 border-t border-gray-100">
          {user ? (
            <div className="space-y-3">
              <Link
                href="/profile"
                onClick={onClose}
                className="w-full bg-slate-50 border border-slate-100 text-slate-800 py-3 rounded-full font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span className="truncate">{displayName}</span>
              </Link>
              <button
                onClick={() => {
                  logout?.();
                  onClose();
                }}
                className="w-full border border-red-100 text-red-600 bg-red-50/50 py-3 rounded-full font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full border border-slate-200 text-slate-700 py-3 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="w-full bg-[#333333] text-white py-3 rounded-full font-bold hover:bg-black transition-all flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
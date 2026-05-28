"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface VipButtonProps {
  text: string;
  href: string;
  variant?: "sky" | "orange" | "black"; // خيارات الألوان للأقسام المختلفة
}

export const VipButton = ({ text, href, variant = "sky" }: VipButtonProps) => {
  const borderColors = {
    sky: "border-sky-500",
    orange: "border-orange-500",
    black: "border-black",
  };

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group cursor-pointer w-fit"
      >
        {/* توهج خلفي ثابت بدون وميض نبضي */}
        <div className="absolute inset-0 bg-[#FFD700] rounded-[2rem] blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>
        
        {/* التعديل: حجم الزر أصبح متجاوباً (Mobile: px-6 py-3) و (Desktop: md:px-10 md:py-4) */}
        <div className={`relative bg-[#FFD700] border-[3px] ${borderColors[variant]} text-black px-6 py-3 md:px-10 md:py-4 rounded-[2rem] flex items-center gap-2 md:gap-3 shadow-lg overflow-hidden`}>
          
          {/* تأثير اللمعان الانسيابي */}
          <motion.div 
            animate={{ x: ['-150%', '150%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
          />
          
          {/* التعديل: النص أصبح more bold (font-black) مع حجم خط متجاوب */}
          <span className="relative z-10 font-black text-xs md:text-sm tracking-widest uppercase italic whitespace-nowrap">
            {text}
          </span>
          
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform relative z-10 flex-shrink-0" />
        </div>
      </motion.div>
    </Link>
  );
};
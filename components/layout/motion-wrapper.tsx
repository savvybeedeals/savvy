"use client";
import { motion } from "framer-motion";

export const MotionDiv = ({ children, idx }: { children: React.ReactNode, idx: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
    >
      {/* تم حذف كود أنيميشن التحليق (Floating) من هنا ليبقى العنصر ثابتاً */}
      {children}
    </motion.div>
  );
};
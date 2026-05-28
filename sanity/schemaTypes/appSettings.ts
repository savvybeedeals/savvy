import { Smartphone } from 'lucide-react';

export default {
  name: 'appSettings',
  title: 'App Settings',
  type: 'document',
  icon: Smartphone,
  fields: [
    {
      name: 'googlePlay',
      title: 'Google Play Store URL',
      type: 'url',
      description: 'أدخل رابط تطبيق أندرويد بالكامل على متجر جوجل بلاي',
    },
    {
      name: 'appStore',
      title: 'Apple App Store URL',
      type: 'url',
      description: 'أدخل رابط تطبيق آيفون بالكامل على متجر آب ستور',
    },
  ],
};
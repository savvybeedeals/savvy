import { defineField, defineType } from 'sanity';
import React from 'react';

// 1. بناء مكون الجراف التفاعلي باستخدام React.createElement لتفادي خطأ تسمية الملفات والـ JSX
const SeoDashboard = (props: any) => {
  const { value = [] } = props;

  // حساب عدد الكلمات تلقائياً
  const textBlocks = value.filter((block: any) => block._type === 'block');
  const fullText = textBlocks
    .map((block: any) => block.children?.map((child: any) => child.text).join(' '))
    .join(' ');
  const wordCount = fullText.trim() === '' ? 0 : fullText.trim().split(/\s+/).length;

  // حساب الروابط الداخلية
  let internalLinks = 0;

  textBlocks.forEach((block: any) => {
    block.children?.forEach((child: any) => {
      if (child.marks && block.markDefs) {
        child.marks.forEach((markId: string) => {
          const linkDef = block.markDefs.find((def: any) => def._key === markId && def._type === 'link');
          if (linkDef) {
            const url = linkDef.href || '';
            if (url.includes('savvybeedeals.com') || url.startsWith('/') || url.startsWith('#')) {
              internalLinks++;
            }
          }
        });
      }
    });
  });

  const wordTarget = 300;
  const wordPercentage = Math.min((wordCount / wordTarget) * 100, 100);
  const linkPercentage = internalLinks >= 1 ? 100 : 0;

  // رندرة العناصر برمجياً بدون استخدام وسوم التاغ المباشرة تفادياً لخطأ الـ TS2304
  return React.createElement('div', { style: { fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', gap: '12px' } },
    React.createElement('div', {
      style: {
        backgroundColor: '#14141f',
        border: '1px solid #2e2e42',
        borderRadius: '8px',
        padding: '16px',
        color: '#ffffff',
        marginBottom: '12px'
      }
    },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
        React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', color: '#f59e0b' } }, '📊 Yoast SEO Live Analytics Gauge'),
        
        // جراف الكلمات
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement('span', { style: { fontSize: '12px', fontWeight: '600', color: '#9ca3af' } }, 'Word Count Progress:'),
            React.createElement('span', {
              style: {
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: wordCount >= 300 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: wordCount >= 300 ? '#10b981' : '#ef4444'
              }
            }, `${wordCount} / ${wordTarget} words`)
          ),
          React.createElement('div', { style: { width: '100%', backgroundColor: '#2e2e42', borderRadius: '9999px', height: '10px', overflow: 'hidden' } },
            React.createElement('div', { style: { width: `${wordPercentage}%`, backgroundColor: wordCount >= 300 ? '#10b981' : '#f59e0b', height: '100%', transition: 'width 0.3s ease-in-out' } })
          )
        ),

        // جراف الروابط
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement('span', { style: { fontSize: '12px', fontWeight: '600', color: '#9ca3af' } }, 'Internal Link Optimizer:'),
            React.createElement('span', {
              style: {
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: internalLinks >= 1 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: internalLinks >= 1 ? '#10b981' : '#ef4444'
              }
            }, `${internalLinks} Found`)
          ),
          React.createElement('div', { style: { width: '100%', backgroundColor: '#2e2e42', borderRadius: '9999px', height: '10px', overflow: 'hidden' } },
            React.createElement('div', { style: { width: `${linkPercentage}%`, backgroundColor: internalLinks >= 1 ? '#10b981' : '#ef4444', height: '100%', transition: 'width 0.3s ease-in-out' } })
          )
        ),

        // النتيجة الكلية
        React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '4px' } },
          React.createElement('span', {
            style: {
              fontSize: '12px',
              fontWeight: 'bold',
              padding: '4px 10px',
              borderRadius: '4px',
              backgroundColor: (wordCount >= 300 && internalLinks >= 1) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: (wordCount >= 300 && internalLinks >= 1) ? '#10b981' : '#f59e0b',
              border: `1px solid ${(wordCount >= 300 && internalLinks >= 1) ? '#10b981' : '#f59e0b'}`
            }
          }, (wordCount >= 300 && internalLinks >= 1) ? '🟢 SEO Score: Optimizations Passed' : '⚠️ SEO Score: Adjustments Required')
        )
      )
    ),
    props.renderDefault(props)
  );
};

export default defineType({
  name: 'blog',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Meta Title / Title',
      type: 'string',
      description: 'Recommended length: 50-60 characters for optimal Google display.',
      validation: (Rule) =>
        Rule.custom((title) => {
          if (!title) return 'The title is required.';
          const charCount = title.length;
          if (charCount < 40) return `⚠️ Title is too short (${charCount} chars).`;
          if (charCount > 60) return `⚠️ Title is too long (${charCount} chars).`;
          return true;
        }).required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured Main Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Meta Description / Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(120).max(160),
    }),
    defineField({
      name: 'content',
      title: 'Article Body Content',
      type: 'array',
      components: {
        input: SeoDashboard
      },
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 1', value: 'h1' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet List', value: 'bullet' },
            { title: 'Numbered List', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Hyperlink / SEO Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) => Rule.required()
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true
                  },
                  {
                    name: 'nofollow',
                    type: 'boolean',
                    title: 'Mark as nofollow'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text (SEO Alt Text)',
              validation: (Rule) => Rule.required()
            }
          ]
        }
      ],
      // 👈 تم تعديل الصياغة هنا: كتابة الـ .warning() مباشرة بعد الـ .custom() دون تداخل كتل الـ Rule الخاطئة
      validation: (Rule) =>
        Rule.required().custom((content) => {
          if (!content) return true; // السماح للمقال الجديد تماماً بالظهور بدون مشاكل حمراء

          const textBlocks = content.filter((block: any) => block._type === 'block');
          const fullText = textBlocks
            .map((block: any) => block.children?.map((child: any) => child.text).join(' '))
            .join(' ');
          const wordCount = fullText.trim() === '' ? 0 : fullText.trim().split(/\s+/).length;

          let internalLinks = 0;
          textBlocks.forEach((block: any) => {
            block.children?.forEach((child: any) => {
              if (child.marks && block.markDefs) {
                child.marks.forEach((markId: string) => {
                  const linkDef = block.markDefs.find((def: any) => def._key === markId && def._type === 'link');
                  if (linkDef) {
                    const url = linkDef.href || '';
                    if (url.includes('savvybeedeals.com') || url.startsWith('/') || url.startsWith('#')) {
                      internalLinks++;
                    }
                  }
                });
              }
            });
          });

          if (wordCount < 300 && internalLinks === 0) {
            return '⚠️ Yoast Alert: Thin content (< 300 words) & No internal links detected.';
          }
          if (wordCount < 300) {
            return '⚠️ Yoast Alert: Thin content. Try adding more text to reach the 300 words mark.';
          }
          if (internalLinks === 0) {
            return '⚠️ Yoast Alert: Missing internal links. Add some related site links for optimal SEO.';
          }

          return true;
        }).warning(),
    }),
  ],
});
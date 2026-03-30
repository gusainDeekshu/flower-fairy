// src\components\product\aplus\TextBlock.tsx
import { TextBlockContent } from '@/types/aplus';

export default function TextBlock({ content }: { content: TextBlockContent }) {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-6 px-4 md:px-0 py-8">
      {content.title && (
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {content.title}
        </h3>
      )}
      
      {content.description && (
        <div 
          // prose classes from @tailwindcss/typography are great here if you use rich text
          className="text-gray-600 leading-relaxed text-lg md:text-xl prose prose-lg prose-indigo mx-auto"
          // If you are using a rich text editor in the admin, use dangerouslySetInnerHTML:
          dangerouslySetInnerHTML={{ __html: content.description }}
          
          // Alternatively, if it's just plain text with line breaks, use this instead:
          // className="text-gray-600 leading-relaxed text-lg md:text-xl whitespace-pre-wrap"
          // >{content.description}</div>
        />
      )}
    </div>
  );
}
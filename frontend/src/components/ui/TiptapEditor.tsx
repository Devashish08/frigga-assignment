// frontend/src/components/TiptapEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { mentionSuggestion } from '@/lib/mentionSuggestion';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: mentionSuggestion,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none border rounded-md p-4 min-h-[400px]',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Handle external content updates without disrupting user typing
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Only update if the editor is not currently focused (user not typing)
      if (!editor.isFocused) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  return <EditorContent editor={editor} />;
};

export default TiptapEditor;
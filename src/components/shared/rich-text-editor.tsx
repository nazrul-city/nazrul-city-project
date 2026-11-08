'use client';

import { useEffect, type ReactNode } from 'react';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  BoldIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  Redo2Icon,
  Undo2Icon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TRichTextEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

type TToolbarButtonProps = {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function normalizeEditorHtml(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();

  return text.length === 0 ? '' : html;
}

function ToolbarButton({
  label,
  pressed = false,
  disabled = false,
  onClick,
  children,
}: Readonly<TToolbarButtonProps>) {
  return (
    <Button
      type="button"
      variant={pressed ? 'secondary' : 'ghost'}
      size="icon-lg"
      className="min-h-11 min-w-11"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({
  id,
  value,
  onChange,
  disabled = false,
  'aria-invalid': ariaInvalid = false,
  'aria-describedby': ariaDescribedBy,
}: Readonly<TRichTextEditorProps>) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        strike: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: false,
        defaultProtocol: 'https',
        validate: (href) => /^https?:\/\//i.test(href),
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        id,
        class: cn(
          'rich-text min-h-40 w-full px-3 py-2 text-base outline-none',
          'focus-visible:ring-0'
        ),
        ...(ariaInvalid ? { 'aria-invalid': 'true' } : {}),
        ...(ariaDescribedBy ? { 'aria-describedby': ariaDescribedBy } : {}),
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChange(normalizeEditorHtml(nextEditor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const current = normalizeEditorHtml(editor.getHTML());
    const next = normalizeEditorHtml(value);

    if (current === next) {
      return;
    }

    editor.commands.setContent(value || '', { emitUpdate: false });
  }, [editor, value]);

  function handleBold() {
    editor?.chain().focus().toggleBold().run();
  }

  function handleItalic() {
    editor?.chain().focus().toggleItalic().run();
  }

  function handleHeading2() {
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  }

  function handleHeading3() {
    editor?.chain().focus().toggleHeading({ level: 3 }).run();
  }

  function handleBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }

  function handleOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }

  function handleLink() {
    if (!editor) {
      return;
    }

    const previous = editor.getAttributes('link').href;
    const previousUrl = typeof previous === 'string' ? previous : 'https://';
    const url = window.prompt('Enter a link URL (http or https)', previousUrl);

    if (url === null) {
      return;
    }

    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    if (!/^https?:\/\//i.test(url.trim())) {
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  }

  function handleUndo() {
    editor?.chain().focus().undo().run();
  }

  function handleRedo() {
    editor?.chain().focus().redo().run();
  }

  const isDisabled = disabled || !editor;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-input bg-background ring-offset-background',
        'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
        ariaInvalid &&
          'border-destructive ring-3 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40'
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-border bg-card p-1">
        <ToolbarButton
          label="Bold"
          pressed={editor?.isActive('bold')}
          disabled={isDisabled}
          onClick={handleBold}
        >
          <BoldIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          pressed={editor?.isActive('italic')}
          disabled={isDisabled}
          onClick={handleItalic}
        >
          <ItalicIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          pressed={editor?.isActive('heading', { level: 2 })}
          disabled={isDisabled}
          onClick={handleHeading2}
        >
          <Heading2Icon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          pressed={editor?.isActive('heading', { level: 3 })}
          disabled={isDisabled}
          onClick={handleHeading3}
        >
          <Heading3Icon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          pressed={editor?.isActive('bulletList')}
          disabled={isDisabled}
          onClick={handleBulletList}
        >
          <ListIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          pressed={editor?.isActive('orderedList')}
          disabled={isDisabled}
          onClick={handleOrderedList}
        >
          <ListOrderedIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          pressed={editor?.isActive('link')}
          disabled={isDisabled}
          onClick={handleLink}
        >
          <LinkIcon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Undo"
          disabled={isDisabled || !editor?.can().undo()}
          onClick={handleUndo}
        >
          <Undo2Icon aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={isDisabled || !editor?.can().redo()}
          onClick={handleRedo}
        >
          <Redo2Icon aria-hidden="true" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

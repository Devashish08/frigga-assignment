/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { MentionList } from '@/components/MentionList'; // We will create this component
import { User } from '@/types';

interface SuggestionProps {
  query: string;
  editor: any;
  range: any;
  text: string;
  clientRect?: any;
  decorationNode?: Element | null;
}



export const mentionSuggestion = {
  items: async ({ query }: { query: string }): Promise<User[]> => {
    if (query.length === 0) {
      return [];
    }
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/search?q=${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const users = await response.json();
    return users;
  },

  render: () => {
    let component: ReactRenderer<typeof MentionList>;
    let popup: any[];

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
}; 
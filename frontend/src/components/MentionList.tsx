import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { User } from '@/types';

interface MentionListProps {
  items: User[];
  command: (item: { id: number, label: string }) => void;
}

export const MentionList = forwardRef((props: MentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.ID, label: item.name });
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-white rounded-md shadow-lg border p-2 text-sm">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={index}
            className={`w-full text-left p-2 rounded-md ${
              index === selectedIndex ? 'bg-gray-200' : ''
            }`}
            onClick={() => selectItem(index)}
          >
            {item.name} ({item.email})
          </button>
        ))
      ) : (
        <div className="p-2">No results</div>
      )}
    </div>
  );
});

MentionList.displayName = 'MentionList'; 
'use client';

import { useState } from 'react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';

interface ChatInputProps {
  onSend: (text: string) => void;
  onTyping?: () => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, onTyping, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onTyping?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2 p-4 border-t border-dark-border bg-dark-surface"
    >
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 px-4 py-2.5 bg-dark-bg border border-dark-border rounded-full text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="p-2.5 bg-primary rounded-full text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />
      </button>
    </form>
  );
}

'use client';

import { useState } from 'react';

const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={copyToClipboard}
      className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
    >
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
};

export default ShareButton;

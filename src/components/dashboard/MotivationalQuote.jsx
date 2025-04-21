// components/dashboard/MotivationalQuote.jsx
import React, { useState, useEffect } from 'react';

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  }
];

const MotivationalQuote = () => {
  const [quote, setQuote] = useState(null);
  
  useEffect(() => {
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);
  
  if (!quote) return null;
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
      <blockquote className="text-center">
        <p className="text-xl font-medium italic">"{quote.text}"</p>
        <footer className="mt-2">— {quote.author}</footer>
      </blockquote>
    </div>
  );
};

export default MotivationalQuote;
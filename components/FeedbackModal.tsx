
import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComment('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Feedback</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star fill="currentColor" size={32} />
            </div>
            <p className="font-bold text-gray-900">Thank you!</p>
            <p className="text-sm text-gray-500">Your feedback helps Zen Producer grow.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">How's your experience?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    className={`transition-colors p-1 ${rating >= s ? 'text-yellow-400' : 'text-gray-200 hover:text-gray-300'}`}
                  >
                    <Star fill={rating >= s ? "currentColor" : "none"} size={32} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Any suggestions?</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Submit Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

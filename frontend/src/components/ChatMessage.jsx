import React from 'react';

/**
 * ChatMessage Component
 * Displays a single chat message with sender information
 */
const ChatMessage = ({ message, isOwnMessage, otherUserName }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwnMessage
              ? 'bg-primary-600 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          {/* Show sender name if not own message */}
          {!isOwnMessage && (
            <p className="text-xs font-semibold mb-1 opacity-75">
              {otherUserName}
            </p>
          )}
          
          {/* Message content */}
          <p className="text-sm md:text-base">{message.content}</p>
          
          {/* Timestamp */}
          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-200' : 'text-gray-500'}`}>
            {formatTime(message.timestamp || message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

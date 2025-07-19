import { useEffect, useState } from 'react';
import { fetchMessages } from '../lib/supabaseClient';
import { supabase } from '../lib/supabaseClient';
import { toast } from '../hooks/use-toast';
import { Trash2, Reply, ArrowLeft, Mail, Clock, User, Send, Bell, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MessagesPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Request notification permission
  const requestNotificationPermission = async () => {
    toast({
      title: 'Notifications',
      description: 'Notification permission is managed by OneSignal.',
    });
    return true;
  };

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMessages();
        setMessages(data);
      } catch (err) {
        setError('Failed to fetch messages.');
      }
      setLoading(false);
    };
    getMessages();
  }, []);

  // Real-time subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, 
        (payload) => {
          const newMessage = payload.new;
          setMessages(prev => [newMessage, ...prev]);
          toast({
            title: 'New Message',
            description: `${newMessage.name} sent you a message`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setReplyText('');
    setIsReplying(false);
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
    setSelectedMessages([]);
  };

  const handleBackToPortfolio = () => {
    navigate('/');
  };

  const handleMessageSelect = (messageId) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      setSelectedMessages(prev => prev.filter(id => id !== messageId));
      
      toast({
        title: 'Message deleted',
        description: 'Message has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete message.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .in('id', selectedMessages);
      
      if (error) throw error;
      
      setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg.id)));
      setSelectedMessages([]);
      
      toast({
        title: 'Messages deleted',
        description: `${selectedMessages.length} messages have been deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete messages.',
        variant: 'destructive',
      });
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || isReplying) return;
    
    setIsReplying(true);
    try {
      console.log('Reply data:', {
        to: selectedMessage.email,
        toName: selectedMessage.name,
        content: replyText,
        originalMessageId: selectedMessage.id,
        sentAt: new Date().toISOString(),
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Reply sent',
        description: `Reply sent to ${selectedMessage.name}`,
      });
      
      setReplyText('');
      setIsReplying(false);
    } catch (error) {
      console.error('Reply error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reply. Please try again.',
        variant: 'destructive',
      });
      setIsReplying(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {selectedMessage ? (
            <button
              onClick={handleBackToList}
              className="text-indigo-400 hover:text-indigo-200"
              aria-label="Back to messages"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            <button 
              onClick={handleBackToPortfolio}
              className="text-indigo-400 hover:text-indigo-200"
              aria-label="Back to portfolio"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-indigo-400" />
            <h1 className="text-xl font-bold">Messages</h1>
            <span className="text-gray-400 text-sm">({messages.length})</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedMessages.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="p-2 text-red-400 hover:bg-red-600/20 rounded-lg"
              aria-label="Delete selected"
            >
              <Trash2 size={20} />
            </button>
          )}
          {(!notificationsEnabled && Notification.permission !== 'granted') && (
            <button
              onClick={requestNotificationPermission}
              className="p-2 text-indigo-400 hover:bg-indigo-600/20 rounded-lg"
              aria-label="Enable notifications"
            >
              <Bell size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex bg-gray-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedMessage && (
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Back to messages"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="flex items-center gap-3">
                <Mail className="h-8 w-8 text-indigo-400" />
                <h1 className="text-2xl font-bold">Messages</h1>
                <span className="text-gray-400">({messages.length})</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {(!notificationsEnabled && Notification.permission !== 'granted') && (
                <button
                  onClick={requestNotificationPermission}
                  className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-sm"
                >
                  <Bell size={16} />
                  Enable Notifications
                </button>
              )}
              
              {selectedMessages.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Selected ({selectedMessages.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {selectedMessage ? (
          /* Full Message View */
          <div className="animate-fade-in">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden">
              {/* Message Header */}
              <div className="p-4 md:p-6 border-b border-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                      <User size={18} className="md:size-5" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-white">{selectedMessage.name}</h2>
                      <p className="text-gray-400 text-sm md:text-base">{selectedMessage.email}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs md:text-sm text-gray-500">
                        <Clock size={12} className="md:size-4" />
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsReplying(!isReplying)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Reply"
                    >
                      <Reply size={18} className="md:size-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} className="md:size-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-4 md:p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-white text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Reply Section */}
              {isReplying && (
                <div className="p-4 md:p-6 border-t border-gray-800 bg-gray-800/30">
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-semibold">Reply to {selectedMessage.name}</h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full h-24 md:h-32 p-3 md:p-4 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                    />
                    <div className="flex gap-2 md:gap-3">
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors text-sm md:text-base"
                      >
                        <Send size={14} className="md:size-4" />
                        {isReplying ? 'Sending...' : 'Send Reply'}
                      </button>
                      <button
                        onClick={() => setIsReplying(false)}
                        className="px-3 py-2 md:px-4 md:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm md:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="space-y-2 md:space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <Mail className="h-12 w-12 md:h-16 md:w-16 text-gray-600 mx-auto mb-3 md:mb-4" />
                <p className="text-gray-400 text-base md:text-lg">No messages found.</p>
                <button
                  onClick={handleBackToPortfolio}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white flex items-center gap-2 mx-auto text-sm md:text-base"
                >
                  <ChevronLeft size={16} />
                  Back to Portfolio
                </button>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group ${
                    selectedMessages.includes(message.id) ? 'ring-2 ring-indigo-500 bg-indigo-900/20' : ''
                  }`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleMessageSelect(message.id);
                      }}
                      className="mt-0.5 md:mt-1 w-4 h-4 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1">
                            <h3 className="text-white font-semibold text-sm md:text-base truncate">{message.name}</h3>
                            <span className="text-gray-400 text-xs md:text-sm truncate">
                              {message.email}
                            </span>
                          </div>
                          <p className="text-gray-300 text-xs md:text-sm line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-2 md:ml-4">
                          <span className="text-xs text-gray-500">
                            {formatDate(message.created_at)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMessage(message.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600/20 rounded transition-all"
                          >
                            <Trash2 size={14} className="md:size-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
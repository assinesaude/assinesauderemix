import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Send, Inbox, Mail, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export function MessagingModule() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient_name: '',
    content: ''
  });
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (profile) {
      fetchMessages();
    }
  }, [profile, filter]);

  const fetchMessages = async () => {
    if (!profile) return;

    try {
      let query = supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });

      if (filter === 'unread') {
        query = query.eq('is_read', false).eq('recipient_id', profile.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!profile || !newMessage.content) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      const { data: recipient, error: recipientError } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', newMessage.recipient_name)
        .maybeSingle();

      if (recipientError || !recipient) {
        alert('Destinatário não encontrado.');
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: profile.id,
          recipient_id: recipient.id,
          content: newMessage.content,
        }]);

      if (error) throw error;

      setNewMessage({ recipient_name: '', content: '' });
      setShowCompose(false);
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erro ao enviar mensagem');
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('recipient_id', profile.id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Erro ao excluir mensagem');
    }
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (message.recipient_id === profile?.id && !message.is_read) {
      handleMarkAsRead(message.id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Mensagens</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <Mail className="w-5 h-5" />
            {filter === 'all' ? 'Não Lidas' : 'Todas'}
          </button>
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="flex items-center gap-2 bg-brand-purple-600 text-white px-4 py-2 rounded-lg hover:bg-brand-purple-700 transition-colors"
          >
            <Send className="w-5 h-5" />
            Nova Mensagem
          </button>
        </div>
      </div>

      {showCompose && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Compor Mensagem</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Destinatário (Nome)</label>
              <input
                type="text"
                value={newMessage.recipient_name}
                onChange={(e) => setNewMessage({ ...newMessage, recipient_name: e.target.value })}
                placeholder="Nome do destinatário"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mensagem</label>
              <textarea
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                placeholder="Escreva sua mensagem aqui..."
                rows={5}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple-600 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSendMessage}
                className="flex items-center gap-2 bg-brand-purple-600 text-white px-6 py-2 rounded-lg hover:bg-brand-purple-700 transition-colors"
              >
                <Send className="w-5 h-5" />
                Enviar
              </button>
              <button
                onClick={() => setShowCompose(false)}
                className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Inbox className="w-5 h-5" />
              Caixa de Entrada
            </h3>
          </div>
          <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-6 text-center text-slate-500">Nenhuma mensagem encontrada</div>
            ) : (
              messages.map((message) => {
                const isReceived = message.recipient_id === profile?.id;

                return (
                  <div
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-brand-purple-50' : ''
                    } ${isReceived && !message.is_read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className={`font-medium text-slate-800 ${isReceived && !message.is_read ? 'font-bold' : ''}`}>
                        {isReceived ? 'Recebida' : 'Enviada'}
                      </p>
                      {isReceived && !message.is_read && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Nova</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{message.content}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(message.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-slate-200">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-slate-600">
                      {selectedMessage.recipient_id === profile?.id ? 'Mensagem recebida' : 'Mensagem enviada'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(selectedMessage.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-slate-700 whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 p-12">
              <div className="text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Selecione uma mensagem para visualizar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
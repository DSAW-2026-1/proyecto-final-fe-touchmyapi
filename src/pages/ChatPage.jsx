import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, MessageSquare, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoSabana from '../assets/sabanalogo.png';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8080');

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn: authIsLoggedIn } = useAuth();
  
  const savedUser = localStorage.getItem('user');
  const userData = user || (savedUser ? JSON.parse(savedUser) : null);
  const currentUserId = user?.id ?? userData?.id ?? localStorage.getItem('userId');
  const currentUserEmail = user?.email ?? userData?.email ?? localStorage.getItem('userEmail');
  const isLoggedIn = authIsLoggedIn || localStorage.getItem('isLoggedIn') === 'true';

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para acceder a tus mensajes.");
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!currentUserEmail) return;

    const fetchChatHistory = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/v1/chats/user/${currentUserEmail}`);
        if (response.ok) {
          const data = await response.json();
          setChats(data);

          const incomingRoomId = location.state?.activeRoomId;
          
          if (incomingRoomId) {
            setActiveChatId(incomingRoomId);
            socket.emit('join_room', incomingRoomId);
          } else if (data.length > 0 && !activeChatId) {
            setActiveChatId(data[0].id || data[0].roomId);
            socket.emit('join_room', data[0].id || data[0].roomId);
          }

          data.forEach(chat => {
            const rId = chat.id || chat.roomId;
            if (rId) socket.emit('join_room', rId);
          });
        }
      } catch (error) {
        console.error("Error al cargar historial de chat desde el servidor:", error);
      }
    };

    fetchChatHistory();
  }, [currentUserEmail, location.state]);

  useEffect(() => {
    socket.on('receive_message', (messagePayload) => {
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          const rId = chat.id || chat.roomId;
          if (rId === messagePayload.roomId) {
            const messageExists = chat.messages.some(msg => msg.id === messagePayload.id);
            if (messageExists) return chat;

            return {
              ...chat,
              messages: [...chat.messages, messagePayload]
            };
          }
          return chat;
        });
      });
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId]);

  const activeChat = useMemo(() => {
    return chats.find(c => (c.id === activeChatId || c.roomId === activeChatId)) || null;
  }, [chats, activeChatId]);

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    socket.emit('join_room', id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const rId = activeChat.id || activeChat.roomId;

    const chatPayload = {
      roomId: rId,
      productId: activeChat.productId,
      productTitle: activeChat.productTitle,
      productImage: activeChat.productImage,
      buyerEmail: activeChat.buyerEmail,
      sellerEmail: activeChat.sellerEmail,
      senderEmail: currentUserEmail,
      text: newMessage.trim()
    };

    socket.emit('send_message', chatPayload);
    setNewMessage("");
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getInterlocutorLabel = (chat) => {
    const amIBuyer = chat.buyerEmail?.toLowerCase() === currentUserEmail?.toLowerCase();
    const targetEmail = amIBuyer ? chat.sellerEmail : chat.buyerEmail;
    const prefix = amIBuyer ? "Vendedor" : "Comprador";
    return targetEmail ? `${prefix}: ${targetEmail.split('@')[0]}` : `${prefix}: Estudiante`;
  };

  return (
    <div className="min-h-screen bg-sabana-light flex flex-col font-sans antialiased">
      
      {/* HEADER DE LA PÁGINA CHAT */}
      <header className="bg-sabana-blue px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md text-white">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95"
            title="Volver atrás"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl hidden sm:block">
              <img src={logoSabana} alt="Logo" className="h-6 w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">Centro de Mensajes</h1>
              <p className="text-[10px] font-medium text-sabana-softGold/80 uppercase tracking-widest">Marketplace Universitario</p>
            </div>
          </div>
        </div>
        <div className="text-xs font-bold bg-white/10 px-4 py-2 rounded-xl border border-white/10">
          {currentUserEmail}
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL DEL CHAT */}
      <div className="flex-1 container mx-auto p-4 md:p-6 flex gap-6 h-[calc(100vh-80px)] overflow-hidden">
        
        {/* PANEL IZQUIERDO: LISTA DE CONVERSACIONES */}
        <aside className={`w-full md:w-80 lg:w-96 bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col overflow-hidden ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-black text-sabana-blue text-lg flex items-center gap-2">
              <MessageSquare size={18} className="text-sabana-blue-light" />
              Tus Conversaciones
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Tratos directos acordados en el campus.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chats.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <div className="bg-sabana-light p-4 rounded-full mb-3 text-sabana-blue/20">
                  <MessageSquare size={32} />
                </div>
                <p className="text-sm font-bold text-sabana-blue/60">No hay chats activos</p>
                <p className="text-xs max-w-[200px] mt-1">Cuando contactes a un vendedor aparecerán aquí.</p>
              </div>
            ) : (
              chats.map((chat) => {
                const chatId = chat.id || chat.roomId;
                const isActive = chatId === activeChatId;
                const lastMsg = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
                
                return (
                  <div
                    key={chatId}
                    onClick={() => handleSelectChat(chatId)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-start gap-3 ${
                      isActive 
                        ? 'bg-sabana-blue text-white border-sabana-blue shadow-md' 
                        : 'bg-white hover:bg-sabana-light/50 border-gray-100 hover:border-sabana-softGold/30'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-sabana-light text-sabana-blue'}`}>
                      <User size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-[11px] font-black uppercase tracking-wider truncate ${isActive ? 'text-sabana-softGold' : 'text-sabana-blue-light'}`}>
                          {getInterlocutorLabel(chat)}
                        </span>
                        {lastMsg && (
                          <span className={`text-[9px] shrink-0 ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                            {formatTime(lastMsg.timestamp)}
                          </span>
                        )}
                      </div>
                      <h4 className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-sabana-blue'}`}>
                        {chat.productTitle}
                      </h4>
                      {lastMsg && (
                        <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {lastMsg.text}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* PANEL DERECHO: CONVERSACIÓN ACTIVA */}
        <main className={`flex-1 bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col overflow-hidden ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* HEADER DEL CHAT ACTIVO */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setActiveChatId(null)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-sabana-light shrink-0 border border-gray-200">
                    <img 
                      src={activeChat.productImage || logoSabana} 
                      alt={activeChat.productTitle} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = logoSabana; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-sabana-blue truncate">{activeChat.productTitle}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
                      {getInterlocutorLabel(activeChat)}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/')} 
                  className="shrink-0 p-2 text-sabana-blue-light hover:text-sabana-blue bg-sabana-light/60 hover:bg-sabana-light rounded-xl transition-all font-bold text-xs flex items-center gap-1.5"
                >
                  <ShoppingBag size={14} />
                  <span className="hidden lg:inline">Ver Marketplace</span>
                </button>
              </div>

              {/* ÁREA DE MENSAJES FLUJO */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-sabana-light/20 space-y-4">
                {activeChat.messages && activeChat.messages.map((msg) => {
                  const isMe = msg.senderEmail?.toLowerCase() === currentUserEmail?.toLowerCase();
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                    >
                      <div className={`max-w-[75%] md:max-w-[60%] p-3.5 rounded-2xl shadow-sm text-sm ${
                        isMe 
                          ? 'bg-sabana-blue text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                      }`}>
                        <p className="leading-relaxed break-words">{msg.text}</p>
                        <div className={`text-[9px] mt-1.5 text-right ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* CAJA DE TEXTO/ENVÍO DE MENSAJE */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-3 bg-white">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-sabana-light/50 px-4 py-3 rounded-xl text-sm text-sabana-blue placeholder:text-gray-400 focus:outline-none focus:bg-sabana-light border border-transparent focus:border-sabana-blue/20 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="bg-sabana-blue hover:bg-sabana-blue-hover text-white p-3 rounded-xl transition-all active:scale-95 shrink-0 shadow-md shadow-sabana-blue/10"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 bg-gray-50/20">
              <div className="bg-sabana-light p-6 rounded-full mb-4 text-sabana-blue/20">
                <MessageSquare size={48} />
              </div>
              <h3 className="text-xl font-bold text-sabana-blue/80 mb-1">Tu Bandeja de Entrada</h3>
              <p className="text-sm max-w-sm">
                Selecciona una conversación de la barra lateral para coordinar entregas, precios y puntos de encuentro dentro de la Universidad.
              </p>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-black uppercase text-sabana-blue-light bg-sabana-blue-light/10 px-4 py-1.5 rounded-full">
                Intercambios seguros en La Sabana
                <ArrowRight size={12} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
// frontend/src/pages/ChatsPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_BASE_URL, SOCKET_URL } from '../config';
import './css/ChatsPage.css';

const ChatsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const socket = useRef();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        socket.current = io(SOCKET_URL);
        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/api/chats/user/${user.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChats(response.data);

                if (location.state?.chatData) {
                    const { material_id, buyer_id, seller_id } = location.state.chatData;
                    const existingChat = response.data.find(chat =>
                        chat.material_id === material_id &&
                        ((chat.buyer_id === buyer_id && chat.seller_id === seller_id) ||  
                        (chat.buyer_id === seller_id && chat.seller_id === buyer_id))  
                    );

                    if (existingChat) {  
                        setActiveChat(existingChat);  
                    } else {  
                        const newChatResponse = await axios.post(`${API_BASE_URL}/api/chats`,  
                            location.state.chatData,  
                            { headers: { Authorization: `Bearer ${token}` } }  
                        );  
                        setActiveChat(newChatResponse.data);  
                        setChats(prev => [...prev, newChatResponse.data]);  
                    }  
                }
            } catch (err) {
                setError('Error loading chats');
                console.error('Error loading chats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, [location.state, user.user_id]);

    useEffect(() => {
        if (activeChat) {
            const fetchMessages = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(
                        `${API_BASE_URL}/api/chats/${activeChat.chat_id}/messages`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setMessages(response.data);
                    scrollToBottom();
                } catch (err) {
                    setError('Error loading messages');
                    console.error('Error loading messages', err);
                }
            };

            fetchMessages();
            socket.current.emit('join_chat', activeChat.chat_id);
        }

        return () => {
            if (activeChat) {
                socket.current.emit('leave_chat', activeChat.chat_id);
            }
        };
    }, [activeChat]);

    useEffect(() => {
        if (!socket.current) return;

        const handleReceiveMessage = (message) => {
            if (message.chat_id === activeChat?.chat_id) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            }
        };

        socket.current.on('receive_message', handleReceiveMessage);

        return () => {
            socket.current.off('receive_message', handleReceiveMessage);
        };
    }, [activeChat]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeChat) return;

        const messageData = {
            chat_id: activeChat.chat_id,
            sender_id: user.user_id,
            content: newMessage.trim()
        };

        socket.current.emit('send_message', messageData);
        setNewMessage('');
    };

    const getOtherUser = (chat) => {
        return chat.buyer_id === user.user_id
            ? { id: chat.seller_id, name: chat.seller_name }
            : { id: chat.buyer_id, name: chat.buyer_name };
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="chats-container">
            <div className="chat-list">
                <div className="chat-list-header">
                    <h2>Chats</h2>
                </div>
                <div className="chat-list-items">
                    {chats.length === 0 ? (
                        <div className="no-chats-message">
                            <p>You have no chats yet. Start a conversation!</p>
                        </div>
                    ) : (
                        chats.map(chat => {
                            const otherUser = getOtherUser(chat);
                            return (
                                <div
                                    key={chat.chat_id}
                                    className={`chat-item ${activeChat?.chat_id === chat.chat_id ? 'active' : ''}`}
                                    onClick={() => setActiveChat(chat)}
                                >
                                    <div className="chat-avatar">
                                        {otherUser.name && otherUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="chat-info">
                                        <div className="chat-name">{otherUser.name}</div>
                                        <div className="chat-material">{chat.material_name}</div>
                                        <div className="chat-preview">
                                            {chat.last_message || 'No messages yet'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="chat-window">
                {activeChat ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="chat-avatar">
                                    {getOtherUser(activeChat).name && getOtherUser(activeChat).name.charAt(0).toUpperCase()}
                                </div>
                                <div className="chat-title">{getOtherUser(activeChat).name}</div>
                                <div className="chat-subtitle">{activeChat.material_name}</div>
                            </div>
                        </div>

                        <div className="messages-container">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${message.sender_id === user.user_id ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">{message.content}</div>
                                    <div className="message-time">
                                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef}/>
                        </div>

                        <div className="message-input-container">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
                                </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <div className="welcome-message">
                            <h2>Smart Waste Messenger</h2>
                            <p>Select a chat to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatsPage;

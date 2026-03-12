import { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, Car, Clock, MessageCircle, User } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/services/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
} from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Explore Cars', href: '/explore', icon: <Car size={16} /> },
  { label: 'My Trips', href: '/dashboard/trips', icon: <Clock size={16} /> },
  { label: 'Messages', href: '/dashboard/messages', icon: <MessageCircle size={16} /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <User size={16} /> },
];

interface Message {
  id: string;
  bookingId?: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt?: { toDate?: () => Date };
}

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', user.id),
      orderBy('createdAt', 'asc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Message[];
      setMessages(data);
    });
    return () => unsub();
  }, [user?.id]);

  const conversations = useMemo(() => {
    if (!user?.id) return [];
    const map = new Map<string, Message>();
    messages.forEach((m) => {
      const otherId = m.senderId === user.id ? m.receiverId : m.senderId;
      const key = otherId;
      const prev = map.get(key);
      if (!prev || (m.createdAt?.toDate?.() || 0) > (prev.createdAt?.toDate?.() || 0)) {
        map.set(key, m);
      }
    });
    return Array.from(map.entries()).map(([otherId, lastMessage]) => ({
      otherId,
      lastMessage,
    }));
  }, [messages, user?.id]);

  const currentMessages = useMemo(() => {
    if (!selectedConversation || !user?.id) return [];
    return messages.filter(
      (m) =>
        (m.senderId === user.id && m.receiverId === selectedConversation) ||
        (m.senderId === selectedConversation && m.receiverId === user.id),
    );
  }, [messages, selectedConversation, user?.id]);

  const handleSend = async () => {
    if (!user?.id || !selectedConversation || !text.trim()) return;
    await addDoc(collection(db, 'messages'), {
      senderId: user.id,
      receiverId: selectedConversation,
      text: text.trim(),
      participants: [user.id, selectedConversation],
      createdAt: new Date(),
    });
    setText('');
  };

  return (
    <DashboardLayout navItems={navItems} title="Messages">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 pb-20 md:pb-0">
        <motion.div variants={fadeInUp}>
          <h1 className="font-display text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">Chat with owners about your bookings.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[520px]">
          {/* Conversations list */}
          <div className="bg-card rounded-xl shadow-md p-4 flex flex-col">
            <h2 className="label-caps text-muted-foreground mb-3">Conversations</h2>
            <div className="flex-1 overflow-y-auto space-y-1">
              {conversations.map((c) => {
                const active = c.otherId === selectedConversation;
                return (
                  <button
                    key={c.otherId}
                    onClick={() => setSelectedConversation(c.otherId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${
                      active ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <div className="font-medium">User {c.otherId.slice(0, 6)}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.lastMessage.text}</div>
                  </button>
                );
              })}
              {conversations.length === 0 && (
                <p className="text-xs text-muted-foreground mt-4 text-center">No messages yet.</p>
              )}
            </div>
          </div>

          {/* Chat window */}
          <div className="md:col-span-2 bg-card rounded-xl shadow-md p-4 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="border-b border-border/50 pb-3 mb-3">
                  <h2 className="font-display font-semibold text-lg">Chat with User {selectedConversation.slice(0, 6)}</h2>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                  {currentMessages.map((m) => {
                    const mine = m.senderId === user?.id;
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                            mine
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-muted text-foreground rounded-bl-sm'
                          }`}
                        >
                          <p>{m.text}</p>
                          {m.createdAt?.toDate && (
                            <p className="text-[10px] mt-1 opacity-70 text-right">
                              {m.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {currentMessages.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-4 text-center">No messages in this conversation yet.</p>
                  )}
                </div>
                <form
                  className="flex gap-2 mt-auto"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <Input
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="bg-input border-0 h-10"
                  />
                  <Button type="submit" className="h-10 px-4">
                    Send
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                Select a conversation to start chatting.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}


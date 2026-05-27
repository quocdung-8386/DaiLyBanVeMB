export interface ChatMessage {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

type Listener = (messages: ChatMessage[]) => void;

class AiChatStore {
  private messages: ChatMessage[] = [
    { 
      id: 1, 
      role: 'bot', 
      text: 'Xin chào! Tôi là Skyward AI Assistant. Tôi có thể giúp bạn tìm kiếm chuyến bay, kiểm tra giá vé, phân tích dữ liệu và tối ưu hóa vận hành. Bạn cần giúp gì?' 
    }
  ];
  private listeners: Set<Listener> = new Set();

  getMessages() {
    return this.messages;
  }

  addMessage(msg: ChatMessage) {
    this.messages = [...this.messages, msg];
    this.notify();
  }

  setMessages(msgs: ChatMessage[]) {
    this.messages = msgs;
    this.notify();
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.messages);
    }
  }
}

export const aiChatStore = new AiChatStore();

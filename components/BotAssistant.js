import { useState, useEffect, useRef } from 'react';

export default function BotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ 
        role: 'assistant', 
        content: 'Bonjour ! Assistant REUSSITESS. 61 pages + 26 boutiques Amazon. Posez vos questions !' 
      }]);
    }
  }, [isOpen]);

  const getResponse = function(userMessage) {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('france')) {
      return 'France - Paris 68M. 49 UNESCO: Tour Eiffel, Versailles. [Voir](/bibliotheque/europe/france)';
    }
    if (msg.includes('italie')) {
      return 'Italie - Rome 59M. 58 UNESCO RECORD: Colisée, Pompéi. [Voir](/bibliotheque/europe/italie)';
    }
    if (msg.includes('allemagne')) {
      return 'Allemagne - Berlin 84M. 51 UNESCO: Neuschwanstein. [Voir](/bibliotheque/europe/allemagne)';
    }
    if (msg.includes('royaume-uni') || msg.includes('uk')) {
      return 'Royaume-Uni - Londres 67M. 33 UNESCO: Stonehenge. [Voir](/bibliotheque/europe/royaume-uni)';
    }
    if (msg.includes('espagne')) {
      return 'Espagne - Madrid 47M. 50 UNESCO: Alhambra. [Voir](/bibliotheque/europe/espagne)';
    }
    if (msg.includes('suede')) {
      return 'Suède - Stockholm 10.5M. 15 UNESCO: Prix Nobel. [Voir](/bibliotheque/europe/suede)';
    }
    if (msg.includes('bresil')) {
      return 'Brésil - Brasília 215M. 23 UNESCO: Christ Rio. [Voir](/bibliotheque/amerique-sud/bresil)';
    }
    if (msg.includes('singapour')) {
      return 'Singapour - 5.9M. Gardens Bay, 3e hub financier. [Voir](/bibliotheque/asie-pacifique/singapour)';
    }
    if (msg.includes('australie')) {
      return 'Australie - Canberra 26M. 20 UNESCO: Barrière Corail. [Voir](/bibliotheque/asie-pacifique/australie)';
    }
    if (msg.includes('nouvelle-zelande') || msg.includes('nouvelle zelande')) {
      return 'Nouvelle-Zélande - Wellington 5.1M. All Blacks. [Voir](/bibliotheque/asie-pacifique/nouvelle-zelande)';
    }
    if (msg.includes('amazon') || msg.includes('boutique')) {
      return '26 boutiques Amazon dans 14 pays. [Voir](/hub-central)';
    }
    if (msg.includes('bibliotheque') || msg.includes('pages')) {
      return '61 pages: Europe, Amériques, Afrique, Asie. [Voir](/bibliotheque)';
    }
    
    return 'Je connais 61 pages patrimoine + 26 boutiques Amazon. Demandez un pays !';
  };

  const handleSubmit = function(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    const newUserMsg = { role: 'user', content: userMessage };
    setMessages(function(prev) { return prev.concat(newUserMsg); });
    setIsLoading(true);

    setTimeout(function() {
      const response = getResponse(userMessage);
      const newBotMsg = { role: 'assistant', content: response };
      setMessages(function(prev) { return prev.concat(newBotMsg); });
      setIsLoading(false);
    }, 300);
  };

  return (
    <div>
      <button
        onClick={function() { setIsOpen(!isOpen); }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all z-50 animate-pulse"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-6 w-[500px] h-[700px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border-4 border-purple-600">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl">🤖</div>
              <div>
                <h3 className="font-bold text-lg">REUSSITESS Assistant</h3>
                <p className="text-sm">61 pages + 26 boutiques Amazon</p>
              </div>
            </div>
            <button onClick={function() { setIsOpen(false); }} className="hover:bg-white/20 p-2 rounded-lg text-xl">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map(function(msg, idx) {
              const isUser = msg.role === 'user';
              return (
                <div key={idx} className={isUser ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={isUser ? 'max-w-[85%] p-4 rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'max-w-[85%] p-4 rounded-2xl shadow-lg bg-white text-gray-800 border-2 border-purple-200'}>
                    <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline font-bold">$1</a>') }} />
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl shadow-lg">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t bg-purple-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={function(e) { setInput(e.target.value); }}
                placeholder="Posez votre question..."
                className="flex-1 border-2 border-purple-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-4 focus:ring-purple-400 text-lg"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50"
              >
                🚀
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

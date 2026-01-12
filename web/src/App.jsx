const { useState, useEffect } = React;

const ReussitessDashboard = () => {
  const OWNER = "0x69f42aa645a43a84e1143d416a4c81a88df01549";
  const SUPPLY = "2,000,000,000";
  
  const [tokens, setTokens] = useState([
    { id: 1, name: "Reussitess© Alpha", symbol: "REUSS-A", price: 0.00000321, color: "from-blue-600 to-cyan-500" },
    { id: 2, name: "Reussitess© Beta", symbol: "REUSS-B", price: 0.00000318, color: "from-purple-600 to-indigo-500" }
  ]);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    const itv = setInterval(() => {
      setTokens(prev => prev.map(t => ({
        ...t, price: Math.max(0.000001, t.price + (Math.random() - 0.5) * 0.00000005)
      })));
    }, 3000);
    return () => clearInterval(itv);
  }, []);

  useEffect(() => {
    const p = ((Math.max(...tokens.map(t=>t.price)) - Math.min(...tokens.map(t=>t.price))) / Math.min(...tokens.map(t=>t.price)) * 100).toFixed(2);
    setProfit(p);
  }, [tokens]);

  return (
    <div className="min-h-screen text-white p-4 md:p-10 font-sans bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-white/10 pb-8">
          <h1 className="text-5xl font-black tracking-tighter italic text-white">REUSSITESS©</h1>
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Infrastructure Owner</div>
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 font-mono text-xs text-blue-400">{OWNER}</div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {tokens.map(t => (
            <div key={t.id} className={`bg-gradient-to-br ${t.color} p-10 rounded-[3rem] shadow-2xl`}>
              <div className="flex justify-between items-center mb-6">
                <span className="text-3xl font-bold uppercase tracking-tighter">{t.name}</span>
                <span className="bg-black/30 px-4 py-1 rounded-full text-[10px] font-bold uppercase">{t.symbol}</span>
              </div>
              <div className="text-5xl font-mono font-black mb-2">${t.price.toFixed(8)}</div>
            </div>
          ))}
        </div>

        <div className="bg-blue-600 p-1 rounded-[3rem] mb-12 shadow-2xl">
            <div className="bg-black p-8 rounded-[2.8rem] flex flex-col md:flex-row items-center justify-between">
                <div>
                    <div className="text-3xl font-black italic uppercase text-white">Arbitrage Global</div>
                    <div className="text-blue-500 font-bold tracking-widest uppercase text-sm">Spread Profit: {profit}%</div>
                </div>
                <button className="mt-6 md:mt-0 bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-blue-500 transition-all">EXECUTE ENGINE</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                <div className="text-gray-500 text-[10px] mb-1 uppercase tracking-widest">Total Fixed Supply</div>
                <div className="text-3xl font-black font-mono tracking-tighter">{SUPPLY}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ReussitessDashboard />);

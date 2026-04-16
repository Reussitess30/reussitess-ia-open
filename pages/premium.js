export default function Premium() {
  return (
    <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
      <h1 style={{color: '#FF6B35', fontSize: '3rem'}}>👑 Reussitess Premium</h1>
      <h2 style={{color: '#00A676'}}>4.99€/mois - Créole Illimité 🇬🇵</h2>
      <p>Rony Porinus - 1er Testeur | DSO2026012614</p>
      
      <div id="paypal-button-container" 
           style={{margin: '3rem 0', padding: '2rem', background: '#f8f9fa', 
                   borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
        <p>🔄 Chargement PayPal...</p>
      </div>

      <script src="https://www.paypal.com/sdk/js?client-id=P-9HS41937PC944162RNHPZWMY&currency=EUR" 
              async></script>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.paypalLoaded = () => {
            paypal.Buttons({
              createOrder: (data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    description: 'Reussitess Premium Créole Guadeloupéen',
                    amount: { currency_code: 'EUR', value: '4.99' }
                  }]
                });
              },
              onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                alert('✅ Premium activé ! Transaction: ' + order.id);
              }
            }).render('#paypal-button-container');
          };
        `
      }} />
    </div>
  );
}

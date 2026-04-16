export default function Premium() {
  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center'}}>
      <h1 style={{color: '#FF6B35', fontSize: '3rem'}}>👑 Reussitess Premium</h1>
      <h2>4.99€/mois - Illimité Créole 🇬🇵</h2>
      <p>1er Testeur : Rony Porinus | e-Soleau DSO2026012614</p>
      
      <div id="paypal-button-container" style={{margin: '3rem 0', padding: '2rem', background: '#f8f9fa', borderRadius: '15px'}}></div>
      
      <script src="https://www.paypal.com/sdk/js?client-id=P-9HS41937PC944162RNHPZWMY&currency=EUR"></script>
      <script>
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
            await fetch('/api/premium/confirm', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({orderID: order.id, userId: 'buyer'})
            });
            alert('✅ Premium activé ! Merci !');
            window.location.reload();
          }
        }).render('#paypal-button-container');
      </script>
    </div>
  );
}

<!DOCTYPE html>
<html>
<head>
  <title>Reussitess Premium 4.99€ 🇬🇵</title>
  <meta name="viewport" content="width=device-width">
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 2rem; text-align: center; background: #f8f9fa; }
    .hero { background: linear-gradient(45deg, #FF6B35, #F7931E, #00A676); color: white; padding: 3rem; border-radius: 25px; margin: 2rem 0; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    h1 { font-size: 3rem; margin: 0; }
    .paypal-container { background: white; padding: 2rem; border-radius: 15px; margin: 3rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="hero">
    <h1>👑 Reussitess Premium</h1>
    <h2>4.99€/mois - Créole Illimité 🇬🇵</h2>
    <p>Rony Porinus - 1er Testeur | DSO2026012614</p>
  </div>
  
  <div class="paypal-container" id="paypal-button-container"></div>
  
  <script src="https://www.paypal.com/sdk/js?client-id=P-9HS41937PC944162RNHPZWMY&currency=EUR"></script>
  <script>
    paypal.Buttons({
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{ amount: { value: '4.99', currency_code: 'EUR' } }]
      }),
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        alert('✅ Premium activé ! Transaction: ' + order.id);
        // Log vers API
        fetch('/api/premium/confirm', { method: 'POST', body: JSON.stringify({orderID: order.id}) });
      }
    }).render('#paypal-button-container');
  </script>
</body>
</html>

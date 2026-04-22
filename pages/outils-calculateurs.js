/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export default function OutilsCalculateurs() {
  return (
    <div className="container">
      <h1>🛠 Outils & Calculateurs</h1>
      <div className="grid">
        <div className="card">
          <h3>Calculateur Amazon</h3>
          <p>Calculez vos marges et profits</p>
          <a href="/calculateur-amazon" className="btn">
            Utiliser
          </a>
        </div>
        <div className="card">
          <h3>Calculateur TVA</h3>
          <p>Calculs de taxes automatiques</p>
          <a href="/calculateur-amazon" className="btn" style={{textDecoration:"none"}}>✅ Accéder</a>
        </div>
        <div className="card">
          <h3>Analyse de Rentabilité</h3>
          <p>Optimisez vos performances</p>
          <a href="/calculateur-amazon" className="btn" style={{textDecoration:"none"}}>✅ Accéder</a>
        </div>
      </div>
      <a href="/" className="back-link">
        ← Retour à l'accueil
      </a>
    </div>
  );
}

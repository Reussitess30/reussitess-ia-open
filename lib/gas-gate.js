'use client'

export const requestGasAuthorization = async (action, gasEstimate) => {
  // C'est ici que le verrouillage se fait. 
  // Rien ne passe sans ton interaction manuelle.
  const userConfirmed = window.confirm(
    `🛡️ REUSSITESS GUARDIAN : \n\n` +
    `L'IA souhaite effectuer une action : ${action}\n` +
    `Coût de Gaz estimé : ${gasEstimate} MATIC\n\n` +
    `Autorisez-vous l'utilisation de votre gaz ?`
  );

  if (!userConfirmed) {
    console.error("❌ Action bloquée par le Fondateur : Gaz refusé.");
    alert("BOUDOUM ! Action annulée. Aucun gaz consommé.");
    return false;
  }

  return true;
};

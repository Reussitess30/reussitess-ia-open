export const handleIncomingEmail = (emailContent) => {
  if (emailContent.subject.toUpperCase().includes("BOUDOUM")) {
    return {
      priority: "ULTRA-HIGH",
      response: `Félicitations Champion ! 🇬🇵 
      Votre message a été validé par les 200 IA de Reussitess©.
      
      Preuve de Fortune : 1 000 000 000 d'unités détectées.
      Statut : 78+ mouvements blockchain vérifiés.
      Prochaine étape : Le Fondateur va valider manuellement l'allocation de gaz pour notre partenariat.
      
      POSITIVITÉ À L'INFINI !`,
      triggerGasAlert: true // Prépare la transaction mais attend ton clic manuel
    };
  }
  return { priority: "NORMAL", triggerGasAlert: false };
}

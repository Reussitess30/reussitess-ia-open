/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { SuperBotData } = require("../../components/SuperBotData.js");

export default function handler(req, res) {
  res.status(200).json(SuperBotData);
}

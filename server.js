import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// ✅ Tvinga CORS att tillåta din frontend att skicka förfrågningar
const corsOptions = {
  origin: 'https://care-frontend.vercel.app', // 🛑 Ändra till din frontend-URL om du vill begränsa det: ex. 'https://care-frontend.vercel.app'
  methods: ['GET', 'POST', 'OPTIONS'], // 🟢 Tillåt GET & POST för förfrågningar
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // 🟢 Viktigt om du skickar cookies eller auth-tokens
};
app.use(cors(corsOptions));

// 📧 **E-postfunktion**
async function sendEmail(to, subject, text) {
  try {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        From: process.env.EMAIL_SENDER,
        To: to,
        Subject: subject,
        TextBody: text
      })
    });

    if (!response.ok) throw new Error(`Postmark API-fel: ${response.statusText}`);
    console.log(`✅ E-post skickad till: ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Fel vid e-postskick:`, error);
    return false;
  }
}

// 📅 **Lägga till en ny bokning**
app.post('/request-booking', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 🟢 Lägg till Access-Control-Allow-Origin i varje respons
  const { email, date, time, link } = req.body;

  if (!email || !date || !time || !link) {
    return res.status(400).json({ success: false, message: 'Alla fält måste fyllas i' });
  }

  const booking = { id: Date.now(), email, date, time, link, confirmed: false };
  bookings.push(booking);

  res.json({ success: true, message: 'Bokningen har registrerats. Läkaren måste bekräfta.' });
});

// ✅ **Bekräfta bokning och skicka e-post**
app.post('/confirm-booking', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 🟢 Se till att CORS-huvuden sätts här också
  const { email, date, time, link } = req.body;
  const booking = bookings.find(b => b.email === email && b.date === date && b.time === time);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Bokning hittades inte' });
  }

  booking.confirmed = true;
  const emailBody = `Ditt möte är bekräftat för ${date} kl. ${time}.\nAnslut via denna länk: ${link}`;

  const emailSent = await sendEmail(email, 'Mötesbekräftelse', emailBody);
  if (emailSent) {
    res.json({ success: true, message: 'Mötet har bekräftats och e-post har skickats' });
  } else {
    res.status(500).json({ success: false, message: 'E-post kunde inte skickas' });
  }
});

// 🌍 **Starta servern**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server körs på port ${PORT}`));

// The same list as the app's Help screen (max-app/src/app/help.tsx), so the site and the app never disagree.
export type Helpline = { name: string; number: string; dial: string; note: string };

export const helplines: Helpline[] = [
  { name: "Tele-MANAS", number: "14416", dial: "14416", note: "Government of India national mental health helpline. Free, 24×7, English and 20 Indian languages." },
  { name: "Tele-MANAS (toll-free)", number: "1-800-891-4416", dial: "18008914416", note: "The same service on a regular toll-free number, if 14416 doesn't connect. The old KIRAN line now routes here too." },
  { name: "Vandrevala Foundation", number: "9999 666 555", dial: "9999666555", note: "24×7 crisis support by call or WhatsApp." },
  { name: "iCall (TISS)", number: "91529 87821", dial: "9152987821", note: "Free counselling by trained psychologists. Monday to Saturday, 8 am to 9 pm." },
];

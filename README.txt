VEYRO FULL SHOP PROJECT
=======================

WHAT IS INCLUDED
- public/index.html: complete responsive VEYRO storefront with product listing, size selector, shopping bag and demo checkout.
- server.js: Node.js/Express backend. It reads Printify products server-side so the API token is not exposed to visitors.
- .env.example: template for your private settings.

IMPORTANT LIMITATION
The checkout is DEMO ONLY. It does not charge anyone and does not create Printify orders.
A real shop needs a payment provider checkout and a server-side payment confirmation/webhook.
Only after confirmed payment should the backend create a Printify order.
Have a parent/guardian handle payment-provider accounts, legal requirements and business setup.
Do not take customer payments until this has been properly configured and tested.

RUN ON WINDOWS
1. Extract this ZIP.
2. Open the extracted veyro-full-shop folder.
3. Copy .env.example and rename the copy to .env.
4. Put your Printify API token in .env, and confirm PRINTIFY_SHOP_ID=29649658.
5. Open Command Prompt in this folder.
6. Run: npm install
7. Run: npm start
8. Visit: http://localhost:3000

CLOUDFLARE PAGES
This project serves the frontend and API from the same Node server during local testing.
Cloudflare Pages static hosting cannot run server.js. For deployment, host the Node backend on a server host, then configure the frontend API URL to that backend and deploy public/ as the Pages assets. Do not upload .env or your backend secrets to Pages.

PRINTIFY TOKEN SAFETY
- Never put the token in public/index.html or browser JavaScript.
- Never send the token in screenshots or chat.
- If exposed, revoke it in Printify and create a replacement.

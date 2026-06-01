import { NextResponse } from "next/server";

/** Route handler — retourne du HTML brut, zéro React, zéro framework. */
export function GET() {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Test Splash Aliva</title>
</head>
<body style="margin:0;padding:0;background:#ff0000;">

  <div id="sp" style="position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:9999;background-color:#1e5c3a;display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <p style="color:white;font-family:Georgia,serif;font-size:2rem;font-weight:300;margin:0;">Aliva</p>
    <p style="color:rgba(255,255,255,0.6);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;margin-top:12px;">TEST — 8 secondes</p>
  </div>

  <div style="padding:60px 40px;color:white;">
    <h1>Page chargée ✓</h1>
    <p>Si tu vois ce texte sur fond ROUGE sans avoir vu le vert, position:fixed est bloqué.</p>
    <p>Si tu as vu le vert d'abord, le mécanisme fonctionne.</p>
  </div>

  <script>
    var el = document.getElementById('sp');
    setTimeout(function() {
      el.style.transition = 'opacity 0.8s';
      el.style.opacity = '0';
      setTimeout(function() { el.style.display = 'none'; }, 900);
    }, 8000);
  </script>

</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

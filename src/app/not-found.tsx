export default function NotFound() {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#F3EBDD",
          color: "#111",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "3rem", margin: 0 }}>LOULA VIA</p>
          <p>Cette page est introuvable.</p>
          <a href="/fr">Retour à l&apos;accueil</a>
        </div>
      </body>
    </html>
  );
}

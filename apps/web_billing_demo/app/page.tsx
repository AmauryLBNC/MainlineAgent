"use client";
import { useState } from "react";

const PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
    });

    if (!res.ok) throw new Error("Erreur lors de la création de la session");
    const { url } = await res.json();
    if (!url) throw new Error("URL de redirection introuvable.");

    window.location.assign(url);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Une erreur est survenue";
    setError(message);
    setLoading(false);
  }
};





  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-300 mb-3">Plan conseillé</p>
        <h1 className="text-2xl font-semibold mb-2">Plan Pro</h1>
        <p className="text-slate-300 mb-6">
          Accès complet à la plateforme, support prioritaire et mises à jour automatiques.
        </p>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-bold">19€</span>
          <span className="text-slate-400">/ mois</span>
        </div>

        <ul className="space-y-2 text-sm text-slate-200 mb-8">
          <li>• Projets illimités</li>
          <li>• Collaboration en équipe</li>
          <li>• Statistiques avancées</li>
          <li>• Support prioritaire</li>
        </ul>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full rounded-lg bg-amber-400 text-slate-950 font-semibold py-3 transition  hover:shadow-lg disabled:opacity-60"
        >
          {loading ? "Redirection..." : "S’abonner"}
        </button>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}

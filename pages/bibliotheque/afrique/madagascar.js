import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Page = () => {
  return (
    <>
      <Head>
        <title>Pays | Bibliothèque REUSSITESS®</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6">
              <Link href="/" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg">
                🏠 Accueil
              </Link>
              <Link href="/bibliotheque" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg">
                ← Bibliothèque
              </Link>
            </div>
            <h1 className="text-6xl font-bold">Page en construction</h1>
            <p className="text-2xl mt-4">Contenu bientôt disponible</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;

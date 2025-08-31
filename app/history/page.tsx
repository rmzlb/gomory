'use client'

import { motion } from 'motion/react'

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-neutral max-w-none"
        >
          <h1 className="mb-8 text-4xl font-light">Histoire de l&apos;algorithme de Gomory</h1>

          <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-light">Ralph E. Gomory</h2>
            <p className="leading-relaxed text-neutral-600">
              Ralph Edward Gomory (né en 1929) est un mathématicien américain qui a révolutionné
              l&apos;optimisation linéaire dans les années 1960. Après avoir obtenu son doctorat à
              Princeton en 1954, il a rejoint IBM Research où il a développé les célèbres "coupes de
              Gomory".
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="my-12 grid gap-6 md:grid-cols-2"
          >
            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-3 text-lg font-medium">📊 Les coupes de Gomory</h3>
              <p className="text-sm text-neutral-600">
                Les coupes de Gomory sont une méthode pour résoudre des problèmes de programmation
                linéaire en nombres entiers. Elles permettent d&apos;éliminer les solutions
                fractionnaires non admissibles tout en conservant toutes les solutions entières.
              </p>
            </div>

            <div className="rounded-lg bg-neutral-50 p-6">
              <h3 className="mb-3 text-lg font-medium">🏭 Applications industrielles</h3>
              <p className="text-sm text-neutral-600">
                Initialement développées pour l&apos;optimisation théorique, les coupes de Gomory
                ont trouvé des applications dans la découpe de matériaux, la planification de
                production et la logistique.
              </p>
            </div>
          </motion.div>

          <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-8">
            <h2 className="mb-4 text-2xl font-light">Le problème de découpe guillotine</h2>
            <p className="mb-4 leading-relaxed text-neutral-600">
              Le problème de découpe guillotine est un cas particulier du problème de découpe
              bidimensionnelle où toutes les coupes doivent traverser entièrement la pièce, comme le
              ferait une guillotine. Cette contrainte reflète les limitations des machines de
              découpe industrielles.
            </p>

            <div className="my-6 rounded-lg bg-neutral-50 p-4">
              <h4 className="mb-2 font-medium">Two-Stage Guillotine</h4>
              <p className="text-sm text-neutral-600">
                L&apos;approche "two-stage" divise le processus en deux étapes orthogonales:
              </p>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-neutral-600">
                <li>Première étape: coupes verticales créant des colonnes</li>
                <li>Deuxième étape: coupes horizontales dans chaque colonne</li>
              </ol>
            </div>

            <p className="leading-relaxed text-neutral-600">
              Cette méthode, bien que sous-optimale par rapport à des approches plus complexes,
              offre un excellent compromis entre qualité de solution et simplicité de mise en œuvre.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-neutral-900 p-8 text-white"
          >
            <h2 className="mb-4 text-2xl font-light">Impact moderne</h2>
            <p className="mb-4 leading-relaxed text-neutral-300">
              Les travaux de Gomory continuent d&apos;influencer la recherche opérationnelle
              moderne. Les algorithmes de coupe sont utilisés dans:
            </p>
            <ul className="space-y-2 text-neutral-300">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>L&apos;industrie du bois et des matériaux composites</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>La découpe de verre et de métal</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>L&apos;optimisation de l&apos;emballage et du transport</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>La planification de production en usine</span>
              </li>
            </ul>
          </motion.div>

          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-500">
              Ralph E. Gomory a également été président de la Fondation Alfred P. Sloan et a reçu de
              nombreux prix pour ses contributions aux mathématiques appliquées.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

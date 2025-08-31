'use client'

import { motion } from 'motion/react'
import Image from 'next/image'

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-neutral max-w-none"
        >
          <h1 className="text-4xl font-light mb-8">Histoire de l&apos;algorithme de Gomory</h1>
          
          <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-8">
            <h2 className="text-2xl font-light mb-4">Ralph E. Gomory</h2>
            <p className="text-neutral-600 leading-relaxed">
              Ralph Edward Gomory (né en 1929) est un mathématicien américain qui a révolutionné 
              l&apos;optimisation linéaire dans les années 1960. Après avoir obtenu son doctorat à Princeton 
              en 1954, il a rejoint IBM Research où il a développé les célèbres "coupes de Gomory".
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6 my-12"
          >
            <div className="bg-neutral-50 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3">📊 Les coupes de Gomory</h3>
              <p className="text-sm text-neutral-600">
                Les coupes de Gomory sont une méthode pour résoudre des problèmes de programmation 
                linéaire en nombres entiers. Elles permettent d&apos;éliminer les solutions fractionnaires 
                non admissibles tout en conservant toutes les solutions entières.
              </p>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3">🏭 Applications industrielles</h3>
              <p className="text-sm text-neutral-600">
                Initialement développées pour l&apos;optimisation théorique, les coupes de Gomory 
                ont trouvé des applications dans la découpe de matériaux, la planification 
                de production et la logistique.
              </p>
            </div>
          </motion.div>

          <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-8">
            <h2 className="text-2xl font-light mb-4">Le problème de découpe guillotine</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Le problème de découpe guillotine est un cas particulier du problème de découpe 
              bidimensionnelle où toutes les coupes doivent traverser entièrement la pièce, 
              comme le ferait une guillotine. Cette contrainte reflète les limitations des 
              machines de découpe industrielles.
            </p>
            
            <div className="bg-neutral-50 rounded-lg p-4 my-6">
              <h4 className="font-medium mb-2">Two-Stage Guillotine</h4>
              <p className="text-sm text-neutral-600">
                L&apos;approche "two-stage" divise le processus en deux étapes orthogonales:
              </p>
              <ol className="list-decimal list-inside text-sm text-neutral-600 mt-2 space-y-1">
                <li>Première étape: coupes verticales créant des colonnes</li>
                <li>Deuxième étape: coupes horizontales dans chaque colonne</li>
              </ol>
            </div>
            
            <p className="text-neutral-600 leading-relaxed">
              Cette méthode, bien que sous-optimale par rapport à des approches plus complexes, 
              offre un excellent compromis entre qualité de solution et simplicité de mise en œuvre.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900 text-white rounded-xl p-8"
          >
            <h2 className="text-2xl font-light mb-4">Impact moderne</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              Les travaux de Gomory continuent d&apos;influencer la recherche opérationnelle moderne. 
              Les algorithmes de coupe sont utilisés dans:
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
              Ralph E. Gomory a également été président de la Fondation Alfred P. Sloan 
              et a reçu de nombreux prix pour ses contributions aux mathématiques appliquées.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
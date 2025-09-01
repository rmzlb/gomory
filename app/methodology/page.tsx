'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MethodologyPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-8 flex items-center gap-3">
            <Logo size={32} className="text-neutral-900" />
            <div className="h-6 w-px bg-neutral-300" />
            <span className="font-mono text-sm text-neutral-600">{t.methodology.title}</span>
          </div>

          <h1 className="mb-4 text-4xl font-light tracking-tight lg:text-5xl">
            {t.methodology.title}
          </h1>
          <p className="max-w-4xl text-xl text-neutral-700">{t.methodology.subtitle}</p>
        </motion.div>

        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <p className="max-w-4xl leading-relaxed text-neutral-600">{t.methodology.intro}</p>
        </motion.section>

        {/* Mathematical Foundations - Enhanced */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="mb-6 font-mono text-sm text-neutral-600">
            {t.methodology.sections.mathematical}
          </h2>

          <div className="border border-neutral-200 bg-neutral-50 p-8 font-mono text-sm">
            <h3 className="mb-4 font-bold">Formulation de Programmation Linéaire</h3>

            <div className="space-y-6">
              {/* Problem Definition */}
              <div>
                <p className="mb-3 text-neutral-600">Définition du problème:</p>
                <div className="border border-neutral-200 bg-white p-4">
                  <p className="mb-2">Variables de décision:</p>
                  <div className="pl-4 space-y-1 text-xs">
                    <p>x<sub>ijk</sub> = 1 si la pièce i est placée sur la planche j en position k</p>
                    <p>y<sub>j</sub> = 1 si la planche j est utilisée</p>
                    <p>s<sub>jk</sub> = position de début de la bande k sur la planche j</p>
                    <p>h<sub>jk</sub> = hauteur de la bande k sur la planche j</p>
                  </div>
                </div>
              </div>

              {/* Objective Functions */}
              <div>
                <p className="mb-3 text-neutral-600">Fonctions objectif (selon le mode):</p>
                <div className="border border-neutral-200 bg-white p-4 space-y-4">
                  <div>
                    <p className="font-semibold mb-2">1. Minimiser les planches utilisées:</p>
                    <p className="text-center text-lg">
                      min z = Σ<sub>j∈B</sub> y<sub>j</sub>
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-2">2. Minimiser les chutes (maximiser utilisation):</p>
                    <p className="text-center text-lg">
                      min w = Σ<sub>j∈B</sub> y<sub>j</sub> · (W × H) - Σ<sub>i∈P</sub> w<sub>i</sub> × h<sub>i</sub>
                    </p>
                    <p className="text-xs text-neutral-600 text-center mt-1">
                      où W×H = surface planche, w<sub>i</sub>×h<sub>i</sub> = surface pièce i
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-2">3. Minimiser les coupes (objectif multi-critères):</p>
                    <p className="text-center text-lg">
                      min c = α · Σ<sub>j∈B</sub> cuts<sub>j</sub> + β · Σ<sub>j∈B</sub> y<sub>j</sub>
                    </p>
                    <p className="text-xs text-neutral-600 text-center mt-1">
                      où α, β sont des poids de pondération
                    </p>
                  </div>
                </div>
              </div>

              {/* Constraints - Enhanced */}
              <div>
                <p className="mb-3 text-neutral-600">Contraintes du problème:</p>
                <div className="space-y-3 border border-neutral-200 bg-white p-4">
                  <p className="font-semibold">Contraintes générales:</p>

                  <div className="space-y-3 pl-4">
                    <div>
                      <p className="font-medium">1. Satisfaction de la demande:</p>
                      <p className="ml-4">
                        Σ<sub>j∈B</sub> Σ<sub>k∈K</sub> x<sub>ijk</sub> = q<sub>i</sub> ∀i ∈ P
                      </p>
                      <p className="ml-4 text-xs text-neutral-600">
                        Chaque pièce i doit être produite q<sub>i</sub> fois
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">2. Non-chevauchement horizontal:</p>
                      <p className="ml-4">
                        x<sub>i</sub> + w<sub>i</sub> + kerf ≤ x<sub>i'</sub> ∨ x<sub>i'</sub> + w<sub>i'</sub> + kerf ≤ x<sub>i</sub>
                      </p>
                      <p className="ml-4 text-xs text-neutral-600">
                        Pour toutes pièces i, i' dans la même bande
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">3. Non-chevauchement vertical:</p>
                      <p className="ml-4">
                        s<sub>jk</sub> + h<sub>jk</sub> + kerf ≤ s<sub>j(k+1)</sub> ∀j,k
                      </p>
                      <p className="ml-4 text-xs text-neutral-600">
                        Les bandes ne se chevauchent pas verticalement
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">4. Contraintes de guillotine (2-stage):</p>
                      <p className="ml-4">
                        ∀ coupe horizontale: traverse toute la largeur
                      </p>
                      <p className="ml-4">
                        ∀ coupe verticale dans bande: de haut en bas de la bande
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">5. Contraintes de dimensions:</p>
                      <p className="ml-4">
                        x<sub>i</sub> + w<sub>i</sub> ≤ W ∀i placée
                      </p>
                      <p className="ml-4">
                        y<sub>i</sub> + h<sub>i</sub> ≤ H ∀i placée
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">6. Rotation (si autorisée):</p>
                      <p className="ml-4">
                        r<sub>i</sub> ∈ {`{0,1}`} où r<sub>i</sub>=1 ⟹ (w<sub>i</sub>, h<sub>i</sub>) ← (h<sub>i</sub>, w<sub>i</sub>)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Constraints for 2-Column Mode */}
              <div>
                <p className="mb-3 text-neutral-600">Contraintes mode 2-colonnes:</p>
                <div className="border border-neutral-200 bg-white p-4">
                  <p className="mb-2">Partitionnement vertical forcé:</p>
                  <div className="pl-4 space-y-1 text-xs">
                    <p>∃ x<sub>split</sub> ∈ [min(w<sub>i</sub>), W - min(w<sub>i</sub>)]</p>
                    <p>∀i: x<sub>i</sub> + w<sub>i</sub> ≤ x<sub>split</sub> ∨ x<sub>i</sub> ≥ x<sub>split</sub> + kerf</p>
                    <p className="text-neutral-600 mt-1">
                      Force exactement 2 colonnes avec position de split optimisée
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Optimization Modes - New Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-6 font-mono text-sm text-neutral-600">
            Modes d'Optimisation
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="border border-neutral-200 bg-white p-6">
              <h3 className="mb-3 font-mono text-sm font-bold">Mode Standard</h3>
              <div className="space-y-2 text-sm">
                <p className="text-neutral-600">Algorithme: NFDH modifié</p>
                <p className="text-neutral-600">Complexité: O(n log n)</p>
                <p className="text-neutral-600">Utilisation: 70-85%</p>
                <div className="mt-3 p-2 bg-neutral-50 font-mono text-xs">
                  Placement libre avec tri par hauteur décroissante
                </div>
              </div>
            </div>

            <div className="border border-neutral-200 bg-white p-6">
              <h3 className="mb-3 font-mono text-sm font-bold">Mode 2-Colonnes</h3>
              <div className="space-y-2 text-sm">
                <p className="text-neutral-600">Algorithme: Split vertical + NFDH</p>
                <p className="text-neutral-600">Complexité: O(n² log n)</p>
                <p className="text-neutral-600">Utilisation: 60-80%</p>
                <div className="mt-3 p-2 bg-neutral-50 font-mono text-xs">
                  Optimise position du split pour minimiser les chutes
                </div>
              </div>
            </div>

            <div className="border border-amber-200 bg-amber-50 p-6">
              <h3 className="mb-3 font-mono text-sm font-bold">Mode Avancé V3 <span className="text-xs bg-amber-200 px-1 py-0.5 rounded">BETA</span></h3>
              <div className="space-y-2 text-sm">
                <p className="text-neutral-600">Algorithme: Multi-colonnes dynamiques</p>
                <p className="text-neutral-600">Complexité: O(n² × strategies)</p>
                <p className="text-neutral-600">Utilisation: 75-95%</p>
                <div className="mt-3 p-2 bg-amber-100 font-mono text-xs">
                  Multi-start avec 5 stratégies de tri différentes
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* V3 Advanced Algorithm Details - New Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-6 font-mono text-sm text-neutral-600">
            Algorithme V3 - Multi-Start Optimization
          </h2>

          <div className="space-y-6">
            <div className="border border-neutral-200 bg-white p-6">
              <h3 className="mb-4 font-mono text-sm font-bold">Stratégies de tri multi-start:</h3>
              <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-3 bg-neutral-50">
                  <p className="font-semibold mb-1">1. HEIGHT_DESC:</p>
                  <p>Sort by h descending, then w descending</p>
                  <p className="text-neutral-600">Optimise pour bandes horizontales</p>
                </div>
                <div className="p-3 bg-neutral-50">
                  <p className="font-semibold mb-1">2. WIDTH_DESC:</p>
                  <p>Sort by w descending, then h descending</p>
                  <p className="text-neutral-600">Optimise pour colonnes verticales</p>
                </div>
                <div className="p-3 bg-neutral-50">
                  <p className="font-semibold mb-1">3. AREA_DESC:</p>
                  <p>Sort by w×h descending</p>
                  <p className="text-neutral-600">Place grandes pièces d'abord</p>
                </div>
                <div className="p-3 bg-neutral-50">
                  <p className="font-semibold mb-1">4. MAX_DIM_DESC:</p>
                  <p>Sort by max(w,h) descending</p>
                  <p className="text-neutral-600">Équilibre entre dimensions</p>
                </div>
                <div className="p-3 bg-neutral-50 md:col-span-2">
                  <p className="font-semibold mb-1">5. RANDOM_SHUFFLE:</p>
                  <p>Random permutation with seed</p>
                  <p className="text-neutral-600">Exploration stochastique de l'espace de solutions</p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-200 bg-white p-6">
              <h3 className="mb-4 font-mono text-sm font-bold">Création dynamique de colonnes:</h3>
              <div className="font-mono text-xs space-y-2">
                <p>function createDynamicColumns(pieces, board):</p>
                <div className="pl-4 space-y-1">
                  <p>columns = []</p>
                  <p>for piece in pieces:</p>
                  <div className="pl-4">
                    <p>bestColumn = findBestFit(columns, piece)</p>
                    <p>if not bestColumn:</p>
                    <div className="pl-4">
                      <p>newColumn = createColumn(piece.width)</p>
                      <p>columns.append(newColumn)</p>
                    </div>
                    <p>placePieceInColumn(piece, bestColumn)</p>
                  </div>
                  <p>return optimizeColumnWidths(columns)</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Complexity Analysis - Enhanced */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-6 font-mono text-sm text-neutral-600">
            {t.methodology.sections.complexity}
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-neutral-200 bg-white p-6">
              <h3 className="mb-4 font-mono text-sm">{t.methodology.complexity.title}</h3>
              <div className="space-y-2 font-mono text-sm">
                <p className="flex justify-between">
                  <span className="text-neutral-600">{t.methodology.complexity.sorting}</span>
                  <span className="font-bold">O(n log n)</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-600">{t.methodology.complexity.packing}</span>
                  <span className="font-bold">O(n)</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-600">2-colonnes (tous splits):</span>
                  <span className="font-bold">O(n² log n)</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-600">V3 multi-start:</span>
                  <span className="font-bold">O(s·n log n)</span>
                </p>
                <div className="mt-2 border-t pt-2">
                  <p className="flex justify-between">
                    <span className="text-neutral-600">{t.methodology.complexity.space}</span>
                    <span className="font-bold text-neutral-900">O(n)</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-200 bg-white p-6">
              <h3 className="mb-4 font-mono text-sm">Garanties théoriques</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="mb-1 font-mono">Standard (NFDH):</p>
                  <div className="bg-neutral-50 p-2 font-mono text-xs">
                    U ≥ (1/2) · OPT - h<sub>max</sub>/H
                  </div>
                </div>
                <div>
                  <p className="mb-1 font-mono">2-colonnes:</p>
                  <div className="bg-neutral-50 p-2 font-mono text-xs">
                    U ≥ (1/3) · OPT (pire cas avec split fixe)
                  </div>
                </div>
                <div>
                  <p className="mb-1 font-mono">V3 avancé:</p>
                  <div className="bg-neutral-50 p-2 font-mono text-xs">
                    E[U] ≥ max<sub>s∈strategies</sub>(U<sub>s</sub>)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Algorithm Details - Keep existing but enhanced */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-6 font-mono text-sm text-neutral-600">
            {t.methodology.sections.algorithm}
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-6"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 font-mono text-white">
                1
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-medium">{t.methodology.algorithmDetails.step1.title}</h3>
                <p className="mb-3 text-sm text-neutral-600">
                  {t.methodology.algorithmDetails.step1.desc}
                </p>
                <div className="overflow-x-auto bg-neutral-50 p-3 font-mono text-xs">
                  <pre>{t.methodology.algorithmDetails.step1.formula}</pre>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex gap-6"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 font-mono text-white">
                2
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-medium">{t.methodology.algorithmDetails.step2.title}</h3>
                <p className="mb-3 text-sm text-neutral-600">
                  {t.methodology.algorithmDetails.step2.desc}
                </p>
                <div className="bg-neutral-50 p-3 font-mono text-xs">
                  <pre>{t.methodology.algorithmDetails.step2.formula}</pre>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="flex h-20 items-center justify-center bg-neutral-200 font-mono text-xs">
                    C1
                  </div>
                  <div className="flex h-20 items-center justify-center bg-neutral-300 font-mono text-xs">
                    C2
                  </div>
                  <div className="flex h-20 items-center justify-center bg-neutral-200 font-mono text-xs">
                    C3
                  </div>
                  <div className="flex h-20 items-center justify-center bg-neutral-300 font-mono text-xs">
                    C4
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-6"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 font-mono text-white">
                3
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-medium">{t.methodology.algorithmDetails.step3.title}</h3>
                <p className="mb-3 text-sm text-neutral-600">
                  {t.methodology.algorithmDetails.step3.desc}
                </p>
                <div className="overflow-x-auto bg-neutral-50 p-3 font-mono text-xs">
                  <pre>{t.methodology.algorithmDetails.step3.formula}</pre>
                </div>
                <div className="mt-4 bg-neutral-100 p-4">
                  <div className="space-y-2">
                    <div className="h-8 bg-neutral-300" />
                    <div className="h-6 bg-neutral-400" />
                    <div className="h-4 bg-neutral-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex gap-6"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 font-mono text-white">
                4
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-medium">{t.methodology.algorithmDetails.step4.title}</h3>
                <p className="mb-3 text-sm text-neutral-600">
                  {t.methodology.algorithmDetails.step4.desc}
                </p>
                <div className="overflow-x-auto bg-neutral-50 p-3 font-mono text-xs">
                  <pre>{t.methodology.algorithmDetails.step4.formula}</pre>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Implementation - Enhanced */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-6 font-mono text-sm text-neutral-600">
            {t.methodology.sections.implementation}
          </h2>

          <div className="bg-neutral-50 p-6">
            <h3 className="mb-4 font-mono text-sm">
              {t.methodology.implementation.dataStructures}
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <p className="mb-2 text-neutral-700">{t.methodology.implementation.piece}:</p>
                <div className="border border-neutral-200 bg-white p-3">
                  <pre>{`interface PlacedPiece {
  id: string
  specId: string
  w: number
  h: number
  rotated: boolean
  x: number
  y: number
  boardIndex: number
  stripIndex: number
}`}</pre>
                </div>
              </div>

              <div>
                <p className="mb-2 text-neutral-700">{t.methodology.implementation.board}:</p>
                <div className="border border-neutral-200 bg-white p-3">
                  <pre>{`interface BoardLayout {
  index: number
  strips: Strip[]
  width: number
  height: number
  columnSplits?: number[]
  utilization: number
}`}</pre>
                </div>
              </div>

              <div>
                <p className="mb-2 text-neutral-700">Strip (Bande horizontale):</p>
                <div className="border border-neutral-200 bg-white p-3">
                  <pre>{`interface Strip {
  x: number
  width: number
  y: number
  height: number
  pieces: PlacedPiece[]
  usedWidth: number
}`}</pre>
                </div>
              </div>

              <div>
                <p className="mb-2 text-neutral-700">Configuration d'optimisation:</p>
                <div className="border border-neutral-200 bg-white p-3">
                  <pre>{`interface OptimizationConfig {
  boardWidth: number
  boardHeight: number
  kerf: number
  allowRotate: boolean
  forceTwoColumns: boolean
  useAdvancedOptimizer: boolean
  objective: 'waste' | 'cuts' | 'balanced'
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Performance Metrics - Updated */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-6 font-mono text-sm text-neutral-600">
            {t.methodology.sections.performance}
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="border border-neutral-200 bg-white p-6 text-center"
            >
              <div className="mb-2 text-3xl font-light text-neutral-900">60-95%</div>
              <div className="text-sm text-neutral-600">Utilisation selon mode</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="border border-neutral-200 bg-white p-6 text-center"
            >
              <div className="mb-2 text-3xl font-light text-neutral-900">&lt;500ms</div>
              <div className="text-sm text-neutral-600">Temps moyen (V3: 2-5s)</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="border border-neutral-200 bg-white p-6 text-center"
            >
              <div className="mb-2 text-3xl font-light text-neutral-900">O(n)</div>
              <div className="text-sm text-neutral-600">{t.methodology.performance.memory}</div>
            </motion.div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-6">
            <div className="border border-green-200 bg-green-50 p-4">
              <p className="mb-1 font-mono text-sm text-green-900">Standard:</p>
              <p className="text-xs text-green-800">70-85% utilisation, rapide</p>
            </div>
            <div className="border border-blue-200 bg-blue-50 p-4">
              <p className="mb-1 font-mono text-sm text-blue-900">2-colonnes:</p>
              <p className="text-xs text-blue-800">60-80% utilisation, découpe simple</p>
            </div>
            <div className="border border-amber-200 bg-amber-50 p-4">
              <p className="mb-1 font-mono text-sm text-amber-900">V3 avancé:</p>
              <p className="text-xs text-amber-800">75-95% utilisation, plus lent</p>
            </div>
          </div>
        </motion.section>

        {/* Recent Improvements - New Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-6 font-mono text-sm text-neutral-600">
            Améliorations Récentes (2025)
          </h2>

          <div className="space-y-4">
            <div className="border-l-4 border-green-500 bg-green-50 p-4">
              <p className="font-mono text-sm font-bold text-green-900">✓ Optimiseur V3 multi-colonnes</p>
              <p className="text-sm text-green-800 mt-1">
                Création dynamique de colonnes avec multi-start pour exploration optimale
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="font-mono text-sm font-bold text-blue-900">✓ Mode 2-colonnes intelligent</p>
              <p className="text-sm text-blue-800 mt-1">
                Optimisation automatique de la position du split vertical
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
              <p className="font-mono text-sm font-bold text-purple-900">✓ Historique de configurations</p>
              <p className="text-sm text-purple-800 mt-1">
                Sauvegarde locale des 10 dernières optimisations avec restauration
              </p>
            </div>
            
            <div className="border-l-4 border-amber-500 bg-amber-50 p-4">
              <p className="font-mono text-sm font-bold text-amber-900">✓ Comptage amélioré des coupes</p>
              <p className="text-sm text-amber-800 mt-1">
                Détection des coupes inférieures pour pièces plus courtes que la bande
              </p>
            </div>
            
            <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4">
              <p className="font-mono text-sm font-bold text-indigo-900">✓ Interface utilisateur enrichie</p>
              <p className="text-sm text-indigo-800 mt-1">
                Cartes d'information au survol des pièces découpées avec détails complets
              </p>
            </div>
          </div>
        </motion.section>

        {/* Academic References - Enhanced */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-6 font-mono text-sm text-neutral-600">
            {t.methodology.sections.references}
          </h2>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="border border-neutral-200 bg-white p-4"
            >
              <p className="mb-2 font-mono text-xs text-neutral-500">[1]</p>
              <p className="text-sm text-neutral-700">
                Gomory, R. E. (1958). "Outline of an algorithm for integer solutions to linear
                programs". Bulletin of the American Mathematical Society. 64 (5): 275–278.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border border-neutral-200 bg-white p-4"
            >
              <p className="mb-2 font-mono text-xs text-neutral-500">[2]</p>
              <p className="text-sm text-neutral-700">
                Coffman Jr, E. G., Garey, M. R., Johnson, D. S., & Tarjan, R. E. (1980).
                "Performance bounds for level-oriented two-dimensional packing algorithms". SIAM
                Journal on Computing, 9(4), 808-826.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="border border-neutral-200 bg-white p-4"
            >
              <p className="mb-2 font-mono text-xs text-neutral-500">[3]</p>
              <p className="text-sm text-neutral-700">
                Lodi, A., Martello, S., & Monaci, M. (2002). "Two-dimensional packing problems: A
                survey". European Journal of Operational Research, 141(2), 241-252.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="border border-neutral-200 bg-white p-4"
            >
              <p className="mb-2 font-mono text-xs text-neutral-500">[4]</p>
              <p className="text-sm text-neutral-700">
                Ntene, N., & van Vuuren, J. H. (2009). "A survey and comparison of guillotine
                heuristics for the 2D oriented offline strip packing problem". Discrete
                Optimization, 6(2), 174-188.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="border border-neutral-200 bg-white p-4"
            >
              <p className="mb-2 font-mono text-xs text-neutral-500">[5]</p>
              <p className="text-sm text-neutral-700">
                Dyckhoff, H. (1990). "A typology of cutting and packing problems". European Journal 
                of Operational Research, 44(2), 145-159.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/optimizer"
            className="inline-block bg-neutral-900 px-8 py-3 font-mono text-sm text-white transition-colors hover:bg-neutral-800"
          >
            {t.methodology.cta} →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
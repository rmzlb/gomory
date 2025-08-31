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

        {/* Mathematical Foundations */}
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
            <h3 className="mb-4 font-bold">{t.methodology.math.title}</h3>

            <div className="space-y-6">
              {/* Objective Function */}
              <div>
                <p className="mb-3 text-neutral-600">{t.methodology.math.objective}</p>
                <div className="border border-neutral-200 bg-white p-4">
                  <p className="mb-2">{t.methodology.math.formulas.minimize}</p>
                  <p className="my-4 text-center text-lg">
                    <span className="text-2xl">z = Σ</span>
                    <sub>i=1</sub>
                    <sup>n</sup>
                    <span className="text-2xl"> y</span>
                    <sub>i</sub>
                  </p>
                  <p className="text-center text-xs text-neutral-600">
                    where y<sub>i</sub> = 1 if board i is used, 0 otherwise
                  </p>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <p className="mb-3 text-neutral-600">{t.methodology.math.constraints}</p>
                <div className="space-y-3 border border-neutral-200 bg-white p-4">
                  <p>{t.methodology.math.formulas.subject}</p>

                  <div className="space-y-2 pl-4">
                    <p>
                      1. <span className="text-lg">Σ</span>
                      <sub>j</sub> x<sub>ij</sub> ≥ d<sub>i</sub> ∀i ∈ P
                    </p>
                    <p className="ml-4 text-xs text-neutral-600">(demand satisfaction)</p>

                    <p>
                      2. x<sub>ij</sub> ∈ {`{0,1}`} ∀i,j
                    </p>
                    <p className="ml-4 text-xs text-neutral-600">(binary placement)</p>

                    <p>3. {t.methodology.math.formulas.guillotine}</p>
                    <p>4. {t.methodology.math.formulas.noOverlap}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Complexity Analysis */}
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
                <div className="mt-2 border-t pt-2">
                  <p className="flex justify-between">
                    <span className="text-neutral-600">{t.methodology.complexity.total}</span>
                    <span className="font-bold text-neutral-900">O(n log n)</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neutral-600">{t.methodology.complexity.space}</span>
                    <span className="font-bold text-neutral-900">O(n)</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-200 bg-white p-6">
              <h3 className="mb-4 font-mono text-sm">{t.methodology.complexity.comparison}</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="mb-1 font-mono">{t.methodology.complexity.nfdh}</p>
                  <div className="bg-neutral-50 p-2 font-mono text-xs">
                    NFDH(I) ≤ 2 · OPT(I) + h<sub>max</sub>
                  </div>
                </div>
                <div>
                  <p className="mb-1 font-mono">{t.methodology.complexity.twoStage}</p>
                  <div className="bg-neutral-50 p-2 font-mono text-xs">TSG(I) ≤ 2.5 · OPT(I)</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Algorithm Details */}
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

        {/* Implementation */}
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
                  <pre>{`interface Piece {
  id: string
  width: number
  height: number
  rotated?: boolean
  specId: string
}`}</pre>
                </div>
              </div>

              <div>
                <p className="mb-2 text-neutral-700">{t.methodology.implementation.board}:</p>
                <div className="border border-neutral-200 bg-white p-3">
                  <pre>{`interface BoardLayout {
  pieces: PlacedPiece[]
  columns: Column[]
  utilization: number
  columnSplits?: number[]
}`}</pre>
                </div>
              </div>

              <div>
                <p className="mb-2 text-neutral-700">{t.methodology.implementation.shelf}:</p>
                <div className="border border-neutral-200 bg-white p-3">
                  <pre>{`interface Shelf {
  y: number
  height: number
  pieces: PlacedPiece[]
  remainingWidth: number
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Performance Metrics */}
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
              <div className="mb-2 text-3xl font-light text-neutral-900">70-85%</div>
              <div className="text-sm text-neutral-600">{t.methodology.performance.average}</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="border border-neutral-200 bg-white p-6 text-center"
            >
              <div className="mb-2 text-3xl font-light text-neutral-900">&lt;100ms</div>
              <div className="text-sm text-neutral-600">{t.methodology.performance.time}</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="border border-neutral-200 bg-white p-6 text-center"
            >
              <div className="mb-2 text-3xl font-light text-neutral-900">O(n)</div>
              <div className="text-sm text-neutral-600">{t.methodology.performance.memory}</div>
            </motion.div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="border border-amber-200 bg-amber-50 p-4">
              <p className="mb-1 font-mono text-sm text-amber-900">Worst case:</p>
              <p className="text-xs text-amber-800">{t.methodology.performance.worst}</p>
            </div>
            <div className="border border-green-200 bg-green-50 p-4">
              <p className="mb-1 font-mono text-sm text-green-900">Best case:</p>
              <p className="text-xs text-green-800">{t.methodology.performance.best}</p>
            </div>
          </div>
        </motion.section>

        {/* Academic References */}
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

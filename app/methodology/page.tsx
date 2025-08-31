'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MethodologyPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <Logo size={32} className="text-neutral-900" />
            <div className="h-6 w-px bg-neutral-300" />
            <span className="text-sm font-mono text-neutral-600">{t.methodology.title}</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight mb-4">
            {t.methodology.title}
          </h1>
          <p className="text-xl text-neutral-700 max-w-4xl">
            {t.methodology.subtitle}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <p className="text-neutral-600 leading-relaxed max-w-4xl">
            {t.methodology.intro}
          </p>
        </motion.section>

        {/* Mathematical Foundations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-sm font-mono text-neutral-600 mb-6">
            {t.methodology.sections.mathematical}
          </h2>
          
          <div className="bg-neutral-50 border border-neutral-200 p-8 font-mono text-sm">
            <h3 className="font-bold mb-4">{t.methodology.math.title}</h3>
            
            <div className="space-y-6">
              {/* Objective Function */}
              <div>
                <p className="text-neutral-600 mb-3">{t.methodology.math.objective}</p>
                <div className="bg-white p-4 border border-neutral-200">
                  <p className="mb-2">{t.methodology.math.formulas.minimize}</p>
                  <p className="text-lg text-center my-4">
                    <span className="text-2xl">z = Σ</span>
                    <sub>i=1</sub>
                    <sup>n</sup>
                    <span className="text-2xl"> y</span>
                    <sub>i</sub>
                  </p>
                  <p className="text-xs text-neutral-600 text-center">
                    where y<sub>i</sub> = 1 if board i is used, 0 otherwise
                  </p>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <p className="text-neutral-600 mb-3">{t.methodology.math.constraints}</p>
                <div className="bg-white p-4 border border-neutral-200 space-y-3">
                  <p>{t.methodology.math.formulas.subject}</p>
                  
                  <div className="pl-4 space-y-2">
                    <p>1. <span className="text-lg">Σ</span><sub>j</sub> x<sub>ij</sub> ≥ d<sub>i</sub> ∀i ∈ P</p>
                    <p className="text-xs text-neutral-600 ml-4">(demand satisfaction)</p>
                    
                    <p>2. x<sub>ij</sub> ∈ {`{0,1}`} ∀i,j</p>
                    <p className="text-xs text-neutral-600 ml-4">(binary placement)</p>
                    
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
          <h2 className="text-sm font-mono text-neutral-600 mb-6">
            {t.methodology.sections.complexity}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-neutral-200 p-6">
              <h3 className="font-mono text-sm mb-4">{t.methodology.complexity.title}</h3>
              <div className="space-y-2 font-mono text-sm">
                <p className="flex justify-between">
                  <span className="text-neutral-600">{t.methodology.complexity.sorting}</span>
                  <span className="font-bold">O(n log n)</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-600">{t.methodology.complexity.packing}</span>
                  <span className="font-bold">O(n)</span>
                </p>
                <div className="border-t pt-2 mt-2">
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
            
            <div className="bg-white border border-neutral-200 p-6">
              <h3 className="font-mono text-sm mb-4">{t.methodology.complexity.comparison}</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-mono mb-1">{t.methodology.complexity.nfdh}</p>
                  <div className="bg-neutral-50 p-2 font-mono text-xs">
                    NFDH(I) ≤ 2 · OPT(I) + h<sub>max</sub>
                  </div>
                </div>
                <div>
                  <p className="font-mono mb-1">{t.methodology.complexity.twoStage}</p>
                  <div className="bg-neutral-50 p-2 font-mono text-xs">
                    TSG(I) ≤ 2.5 · OPT(I)
                  </div>
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
          <h2 className="text-sm font-mono text-neutral-600 mb-6">
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
              <div className="flex-shrink-0 w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center font-mono">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">{t.methodology.algorithmDetails.step1.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">
                  {t.methodology.algorithmDetails.step1.desc}
                </p>
                <div className="bg-neutral-50 p-3 font-mono text-xs overflow-x-auto">
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
              <div className="flex-shrink-0 w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center font-mono">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">{t.methodology.algorithmDetails.step2.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">
                  {t.methodology.algorithmDetails.step2.desc}
                </p>
                <div className="bg-neutral-50 p-3 font-mono text-xs">
                  <pre>{t.methodology.algorithmDetails.step2.formula}</pre>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="bg-neutral-200 h-20 flex items-center justify-center text-xs font-mono">C1</div>
                  <div className="bg-neutral-300 h-20 flex items-center justify-center text-xs font-mono">C2</div>
                  <div className="bg-neutral-200 h-20 flex items-center justify-center text-xs font-mono">C3</div>
                  <div className="bg-neutral-300 h-20 flex items-center justify-center text-xs font-mono">C4</div>
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
              <div className="flex-shrink-0 w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center font-mono">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">{t.methodology.algorithmDetails.step3.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">
                  {t.methodology.algorithmDetails.step3.desc}
                </p>
                <div className="bg-neutral-50 p-3 font-mono text-xs overflow-x-auto">
                  <pre>{t.methodology.algorithmDetails.step3.formula}</pre>
                </div>
                <div className="mt-4 bg-neutral-100 p-4">
                  <div className="space-y-2">
                    <div className="bg-neutral-300 h-8" />
                    <div className="bg-neutral-400 h-6" />
                    <div className="bg-neutral-500 h-4" />
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
              <div className="flex-shrink-0 w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center font-mono">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-2">{t.methodology.algorithmDetails.step4.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">
                  {t.methodology.algorithmDetails.step4.desc}
                </p>
                <div className="bg-neutral-50 p-3 font-mono text-xs overflow-x-auto">
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
          <h2 className="text-sm font-mono text-neutral-600 mb-6">
            {t.methodology.sections.implementation}
          </h2>
          
          <div className="bg-neutral-50 p-6">
            <h3 className="font-mono text-sm mb-4">{t.methodology.implementation.dataStructures}</h3>
            
            <div className="space-y-4 font-mono text-xs">
              <div>
                <p className="text-neutral-700 mb-2">{t.methodology.implementation.piece}:</p>
                <div className="bg-white p-3 border border-neutral-200">
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
                <p className="text-neutral-700 mb-2">{t.methodology.implementation.board}:</p>
                <div className="bg-white p-3 border border-neutral-200">
                  <pre>{`interface BoardLayout {
  pieces: PlacedPiece[]
  columns: Column[]
  utilization: number
  columnSplits?: number[]
}`}</pre>
                </div>
              </div>
              
              <div>
                <p className="text-neutral-700 mb-2">{t.methodology.implementation.shelf}:</p>
                <div className="bg-white p-3 border border-neutral-200">
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
          <h2 className="text-sm font-mono text-neutral-600 mb-6">
            {t.methodology.sections.performance}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-neutral-200 p-6 text-center"
            >
              <div className="text-3xl font-light text-neutral-900 mb-2">70-85%</div>
              <div className="text-sm text-neutral-600">{t.methodology.performance.average}</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-neutral-200 p-6 text-center"
            >
              <div className="text-3xl font-light text-neutral-900 mb-2">&lt;100ms</div>
              <div className="text-sm text-neutral-600">{t.methodology.performance.time}</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-neutral-200 p-6 text-center"
            >
              <div className="text-3xl font-light text-neutral-900 mb-2">O(n)</div>
              <div className="text-sm text-neutral-600">{t.methodology.performance.memory}</div>
            </motion.div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm font-mono text-amber-900 mb-1">Worst case:</p>
              <p className="text-xs text-amber-800">{t.methodology.performance.worst}</p>
            </div>
            <div className="bg-green-50 border border-green-200 p-4">
              <p className="text-sm font-mono text-green-900 mb-1">Best case:</p>
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
          <h2 className="text-sm font-mono text-neutral-600 mb-6">
            {t.methodology.sections.references}
          </h2>
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white border border-neutral-200 p-4"
            >
              <p className="font-mono text-xs text-neutral-500 mb-2">[1]</p>
              <p className="text-sm text-neutral-700">
                Gomory, R. E. (1958). "Outline of an algorithm for integer solutions to linear programs". 
                Bulletin of the American Mathematical Society. 64 (5): 275–278.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-neutral-200 p-4"
            >
              <p className="font-mono text-xs text-neutral-500 mb-2">[2]</p>
              <p className="text-sm text-neutral-700">
                Coffman Jr, E. G., Garey, M. R., Johnson, D. S., & Tarjan, R. E. (1980). 
                "Performance bounds for level-oriented two-dimensional packing algorithms". 
                SIAM Journal on Computing, 9(4), 808-826.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-neutral-200 p-4"
            >
              <p className="font-mono text-xs text-neutral-500 mb-2">[3]</p>
              <p className="text-sm text-neutral-700">
                Lodi, A., Martello, S., & Monaci, M. (2002). 
                "Two-dimensional packing problems: A survey". 
                European Journal of Operational Research, 141(2), 241-252.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-neutral-200 p-4"
            >
              <p className="font-mono text-xs text-neutral-500 mb-2">[4]</p>
              <p className="text-sm text-neutral-700">
                Ntene, N., & van Vuuren, J. H. (2009). 
                "A survey and comparison of guillotine heuristics for the 2D oriented offline strip packing problem". 
                Discrete Optimization, 6(2), 174-188.
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
            className="inline-block px-8 py-3 bg-neutral-900 text-white font-mono text-sm
                     hover:bg-neutral-800 transition-colors"
          >
            {t.methodology.cta} →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
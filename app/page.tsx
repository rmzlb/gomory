'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import Link from 'next/link'

import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const { scrollYProgress } = useScroll()

  // Subtle parallax for sections
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98])

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Minimal hero with subtle animations */}
      <motion.section
        style={{ opacity, scale }}
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-3"
        >
          <Logo size={40} className="text-neutral-900" />
          <div className="h-8 w-px bg-neutral-300" />
          <span className="font-mono text-sm text-neutral-600">{t.home.version}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-5xl font-light tracking-tight lg:text-6xl"
        >
          {t.home.title}
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="ml-4 inline-block text-neutral-400"
          >
            ⎯
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-2 max-w-3xl text-xl text-neutral-700"
        >
          {t.home.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 max-w-3xl font-mono text-base text-neutral-600"
        >
          {t.home.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            href="/optimizer"
            className="group relative overflow-hidden bg-neutral-900 px-6 py-2.5 font-mono text-sm text-white transition-colors hover:bg-neutral-800"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative">{t.home.cta.optimizer}</span>
          </Link>

          <a
            href="https://github.com/rmzlb/gomory"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-neutral-400 px-6 py-2.5 font-mono text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
          >
            {t.home.cta.github}
          </a>
        </motion.div>
      </motion.section>

      {/* Technical specs with stagger animation */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 font-mono text-sm text-neutral-600"
          >
            {t.home.sections.technical}
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: t.home.algorithm.title, content: t.home.algorithm.content },
              { title: t.home.performance.title, content: t.home.performance.content },
              { title: t.home.constraints.title, content: t.home.constraints.content },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="mb-3 font-mono text-sm text-neutral-900">{item.title}</h3>
                <pre className="font-mono text-xs leading-relaxed text-neutral-600">
                  {item.content}
                </pre>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core features with hover effects */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 font-mono text-sm text-neutral-600"
          >
            {t.home.sections.features}
          </motion.h2>

          <div className="space-y-6">
            {t.home.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="group flex gap-6"
              >
                <motion.div
                  className="w-20 pt-1 font-mono text-xs text-neutral-500"
                  whileHover={{ color: '#171717' }}
                >
                  0{index + 1}
                </motion.div>
                <div className="flex-1">
                  <h3 className="mb-2 font-medium">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack - ultra minimal with hover */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 font-mono text-sm text-neutral-600"
          >
            {t.home.sections.stack}
          </motion.h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-sm md:grid-cols-4">
            {[
              { label: 'runtime:', value: 'Node.js 20+' },
              { label: 'framework:', value: 'Next.js 15' },
              { label: 'language:', value: 'TypeScript 5' },
              { label: 'styling:', value: 'Tailwind CSS' },
              { label: 'animation:', value: 'Motion' },
              { label: 'pdf:', value: 'jsPDF' },
              { label: 'canvas:', value: 'html2canvas' },
              { label: 'bundler:', value: 'Turbopack' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 5 }}
                className="group"
              >
                <span className="text-neutral-500 transition-colors group-hover:text-neutral-700">
                  {item.label}
                </span>{' '}
                <span className="transition-colors group-hover:text-neutral-900">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research references */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 font-mono text-sm text-neutral-600"
          >
            {t.home.sections.references}
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                id: '[1]',
                text: 'Gomory, R. E. (1958). "Outline of an algorithm for integer solutions to linear programs". Bulletin of the American Mathematical Society. 64 (5): 275–278.',
              },
              {
                id: '[2]',
                text: 'Gilmore, P. C.; Gomory, R. E. (1961). "A Linear Programming Approach to the Cutting-Stock Problem". Operations Research. 9 (6): 849–859.',
              },
              {
                id: '[3]',
                text: 'Lodi, A.; Martello, S.; Monaci, M. (2002). "Two-dimensional packing problems: A survey". European Journal of Operational Research. 141 (2): 241–252.',
              },
            ].map((ref, i) => (
              <motion.div
                key={ref.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-sm"
              >
                <p className="mb-1 font-mono text-xs text-neutral-500">{ref.id}</p>
                <p className="text-neutral-700">{ref.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributing - hacker style */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 font-mono text-sm text-neutral-600"
          >
            {t.home.sections.contributing}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-neutral-50 p-6 font-mono text-sm"
          >
            <pre className="text-neutral-700">
              {`$ git clone https://github.com/rmzlb/gomory.git
$ cd gomory
$ npm install
$ npm run dev

# Create feature branch
$ git checkout -b feature/your-feature

# Run tests
$ npm test

# Submit PR
$ git push origin feature/your-feature`}
            </pre>
          </motion.div>

          <div className="mt-8 flex gap-6 text-sm">
            <a
              href="https://github.com/rmzlb/gomory/issues"
              className="font-mono text-neutral-600 transition-colors hover:text-neutral-900"
            >
              → Report bugs
            </a>
            <a
              href="https://github.com/rmzlb/gomory/pulls"
              className="font-mono text-neutral-600 transition-colors hover:text-neutral-900"
            >
              → Pull requests
            </a>
            <a
              href="https://github.com/rmzlb/gomory/discussions"
              className="font-mono text-neutral-600 transition-colors hover:text-neutral-900"
            >
              → Discussions
            </a>
          </div>
        </div>
      </section>

      {/* Support - minimal */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 font-mono text-sm text-neutral-600"
          >
            {t.home.sections.support}
          </motion.h2>

          <p className="mb-6 text-sm text-neutral-600">{t.home.supportText}</p>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/sponsors/rmzlb"
              className="font-mono text-sm text-neutral-600 transition-colors hover:text-neutral-900"
            >
              GitHub Sponsors →
            </a>
            <a
              href="https://buymeacoffee.com/rmzlb"
              className="font-mono text-sm text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Buy Me a Coffee →
            </a>
          </div>
        </div>
      </section>

      {/* Footer with signature */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3 font-mono text-xs text-neutral-500">
              <span>
                {t.home.footer.license} · {new Date().getFullYear()}
              </span>
            </div>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <span className="font-mono text-xs text-neutral-500">{t.home.footer.madeBy}</span>
              <a
                href="https://github.com/rmzlb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-xs text-neutral-900 transition-colors hover:text-neutral-600"
              >
                @rmzlb
                <Logo size={16} className="opacity-60" />
              </a>
            </motion.div>

            <div className="flex gap-6 font-mono text-xs">
              <Link
                href="/optimizer"
                className="text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Optimizer
              </Link>
              <Link
                href="/methodology"
                className="text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Methodology
              </Link>
              <Link
                href="/history"
                className="text-neutral-600 transition-colors hover:text-neutral-900"
              >
                History
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

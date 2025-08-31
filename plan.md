# Plan de Développement - Optimiseur de Découpe Minimaliste

## 🎯 Objectif
Créer une application Next.js 15 ultra-minimaliste pour l'optimisation de découpe de planches, avec une UX exceptionnelle inspirée de Koto Studio.

## 📐 Architecture Technique

### Stack Finale
- **Next.js 15** (App Router, SSG)
- **Tailwind CSS v4** (Alpha avec CSS Variables natives)
- **Motion** (Framer Motion v11 - animations subtiles)
- **TypeScript** (strict mode)
- **Aucune autre dépendance** (pas de stores, pas de workers)

### Structure de Fichiers
```
/
├── app/
│   ├── layout.tsx           # Layout minimal avec Inter font
│   ├── page.tsx             # Page unique de l'application
│   └── globals.css          # Tailwind v4 + variables CSS
│
├── components/
│   ├── CuttingOptimizer.tsx # Composant principal (état local)
│   ├── BoardVisualizer.tsx  # SVG animé avec Motion
│   ├── PieceInput.tsx       # Inputs minimalistes
│   └── StatsDisplay.tsx     # Statistiques flottantes
│
├── lib/
│   ├── optimizer.ts         # Algorithme pur (extrait du code existant)
│   └── types.ts            # Types TypeScript
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🔧 Décisions d'Architecture

### 1. État Local vs Store Global
**Décision : État local avec useState**
- ✅ Plus simple à débugger
- ✅ Pas de dépendance externe
- ✅ Props drilling minimal (2-3 niveaux max)
- ✅ Performance suffisante avec useMemo

### 2. Calculs : Web Workers vs Main Thread
**Décision : Main thread avec useMemo**
- ✅ Algorithme rapide (<100ms)
- ✅ Pas de complexité asynchrone
- ✅ Feedback instantané

### 3. Animations
**Décision : Motion pour micro-animations subtiles**
- ✅ Transitions spring naturelles
- ✅ Layout animations pour le drag
- ✅ AnimatePresence pour les entrées/sorties
- ❌ Pas d'animations excessives

## 📋 Fonctionnalités

### MVP (Parité avec code.tsx)
1. ✅ Entrée dimensions planche
2. ✅ Gestion liste de pièces (CRUD)
3. ✅ Algorithme two-stage guillotine
4. ✅ Visualisation SVG proportionnelle
5. ✅ Calcul des coupes
6. ✅ Statistiques d'utilisation
7. ✅ Support rotation 90°
8. ✅ Trait de scie (kerf)

### Améliorations UX
1. ✅ Animations d'entrée subtiles
2. ✅ Feedback visuel immédiat
3. ✅ Interface épurée Koto-style
4. ✅ Responsive mobile-first
5. ✅ Stats flottantes élégantes

### Non inclus (simplification)
- ❌ Export PDF/DXF
- ❌ Sauvegarde projets
- ❌ Mode sombre
- ❌ Drag & drop visuel
- ❌ 3D preview

## 🎨 Design System

### Couleurs (Tailwind v4 CSS Variables)
```css
--color-neutral-50: #fafafa;   /* Fond principal */
--color-neutral-100: #f5f5f5;  /* Pièces */
--color-neutral-200: #e5e5e5;  /* Bordures */
--color-neutral-400: #a3a3a3;  /* Texte secondaire */
--color-neutral-600: #525252;  /* Texte principal */
--color-red-400: #f87171;      /* Lignes de coupe */
```

### Typographie
- Font: Inter (system-ui fallback)
- Tailles: text-sm (base), text-xs (labels)
- Poids: font-light, font-normal

### Espacement
- Padding conteneurs: p-4 à p-8
- Gap grilles: gap-2 à gap-12
- Border radius: rounded-lg à rounded-2xl

### Animations Motion
```typescript
// Transition spring standard
transition: { 
  type: "spring", 
  stiffness: 300, 
  damping: 30 
}

// Délais cascadés
delay: index * 0.02

// Hover subtil
whileHover: { scale: 1.02 }
```

## 📊 Optimisations Performance

1. **useMemo sur calculs lourds**
   - Algorithme d'optimisation
   - Calcul des coupes
   - Statistiques

2. **React.memo sur composants purs**
   - BoardVisualizer
   - PieceInput rows

3. **CSS containment**
   - contain: layout sur les cards
   - will-change sur éléments animés

4. **Bundle minimal**
   - Tree shaking agressif
   - Pas de polyfills inutiles
   - Target ES2022

## 🚀 Étapes de Développement

### Phase 1 : Setup (15 min)
- [x] Créer plan.md
- [ ] npx create-next-app avec config minimale
- [ ] Installer motion et tailwind v4-alpha
- [ ] Config TypeScript strict

### Phase 2 : Core (45 min)
- [ ] Extraire algorithme dans lib/optimizer.ts
- [ ] Créer types.ts
- [ ] Implémenter CuttingOptimizer.tsx
- [ ] État local et calculs useMemo

### Phase 3 : UI (30 min)
- [ ] PieceInput minimaliste
- [ ] BoardVisualizer avec SVG
- [ ] StatsDisplay flottant
- [ ] Animations Motion subtiles

### Phase 4 : Polish (15 min)
- [ ] Responsive design
- [ ] Micro-interactions
- [ ] Performance tuning
- [ ] Tests manuels
- [ ] npm run build - vérifier que tout compile
- [ ] npm run dev - tester l'application complète

## 🎯 Critères de Succès

1. **Performance**
   - [ ] Calculs < 16ms (60 FPS)
   - [ ] Bundle < 150KB gzippé
   - [ ] LCP < 1s

2. **UX**
   - [ ] Feedback instantané
   - [ ] Animations fluides
   - [ ] Interface épurée
   - [ ] Mobile responsive

3. **Code**
   - [ ] TypeScript strict
   - [ ] Aucune dépendance inutile
   - [ ] Code lisible et maintenable

## 📝 Notes Techniques

### Algorithme existant à conserver
- `tryOneBoardTwoColumns()` : Stratégie two-stage
- `packGuillotine()` : Fallback bandes complètes
- `packColumnShelves()` : NFDH pour colonnes
- `computeCuts()` : Calcul des coupes sans doublon

### Simplifications du code original
- Retirer TestsCard (diagnostics)
- Simplifier PositioningReport
- Unifier les unités en mm uniquement
- Réduire les options (garder l'essentiel)

### Améliorations Motion
- AnimatePresence sur liste pièces
- layoutId pour transitions fluides
- Animations SVG path sur coupes
- Micro-feedback sur interactions

## ✅ Checklist Finale

- [ ] Code fonctionne parfaitement
- [ ] Parité fonctionnelle avec code.tsx
- [ ] Animations subtiles et naturelles
- [ ] Interface ultra-minimaliste
- [ ] Performance optimale
- [ ] Responsive mobile
- [ ] TypeScript sans erreurs
- [ ] Bundle minimal
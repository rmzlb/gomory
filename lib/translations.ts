export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'home',
      optimizer: 'optimizer',
      history: 'history',
      methodology: 'methodology',
    },

    // Homepage
    home: {
      version: 'v1.0.0',
      title: 'Gomory',
      subtitle: 'Two-stage guillotine cutting algorithm for material optimization.',
      description:
        "Open source implementation based on Ralph E. Gomory's work (1958). Complexity O(n log n). Average utilization: 70-85%.",
      cta: {
        optimizer: 'optimizer →',
        github: 'github ↗',
      },
      sections: {
        technical: 'TECHNICAL IMPLEMENTATION',
        features: 'CORE FEATURES',
        stack: 'STACK',
        references: 'REFERENCES',
        contributing: 'CONTRIBUTING',
        support: 'SUPPORT',
      },
      algorithm: {
        title: 'Algorithm',
        content: `tryOneBoardTwoColumns()
├─ Column splitting
├─ NFDH packing
└─ Rotation optimization`,
      },
      performance: {
        title: 'Performance',
        content: `Time:  <100ms (n<1000)
Space: O(n)
Cuts:  20-40 per board
Waste: 15-30%`,
      },
      constraints: {
        title: 'Constraints',
        content: `• Guillotine cuts only
• Two-stage process
• Kerf management
• 90° rotation support`,
      },
      features: [
        {
          title: 'Two-stage guillotine optimization',
          description:
            'Vertical column partitioning followed by horizontal strip packing within each column. Reduces computational complexity while maintaining acceptable waste ratios.',
        },
        {
          title: 'Next Fit Decreasing Height (NFDH)',
          description:
            'Heuristic packing algorithm with proven approximation ratio. Pieces sorted by decreasing height for optimal shelf utilization.',
        },
        {
          title: 'Kerf compensation',
          description:
            'Automatic spacing calculation for saw blade width. Configurable kerf values from 0-10mm with sub-millimeter precision.',
        },
        {
          title: 'Multi-format export',
          description:
            'PDF generation with jsPDF, PNG rasterization via html2canvas, native SVG export. Production-ready cutting plans with dimensional annotations.',
        },
      ],
      supportText:
        'If this project is useful in your work or production, you can support its development.',
      footer: {
        license: 'MIT License',
        madeBy: 'Made with precision by',
      },
    },

    // Methodology
    methodology: {
      title: 'Methodology',
      subtitle: 'Mathematical foundations and technical implementation',
      intro:
        'The Gomory cutting optimizer implements a two-stage guillotine cutting algorithm combined with the NFDH (Next Fit Decreasing Height) heuristic, providing a polynomial-time approximation for the NP-hard 2D bin packing problem.',
      sections: {
        mathematical: 'Mathematical Foundations',
        complexity: 'Complexity Analysis',
        algorithm: 'Algorithm Details',
        implementation: 'Implementation',
        performance: 'Performance Metrics',
        references: 'Academic References',
      },
      math: {
        title: 'Problem Formulation',
        binPacking: '2D Bin Packing Problem',
        objective: 'Objective Function',
        constraints: 'Constraints',
        formulas: {
          minimize: 'Minimize:',
          subject: 'Subject to:',
          guillotine: 'Guillotine constraint: Each cut must span the entire dimension',
          noOverlap: 'Non-overlapping constraint',
          binCapacity: 'Bin capacity constraint',
        },
      },
      complexity: {
        title: 'Computational Complexity',
        sorting: 'Initial sorting: O(n log n)',
        packing: 'NFDH packing per column: O(n)',
        total: 'Total complexity: O(n log n)',
        space: 'Space complexity: O(n)',
        comparison: 'Comparison with optimal solutions:',
        nfdh: 'NFDH approximation ratio: 2',
        twoStage: 'Two-stage guillotine: 2.5 approximation ratio',
      },
      algorithmDetails: {
        step1: {
          title: 'Step 1: Preprocessing',
          desc: 'Sort pieces by decreasing height (or width if rotation is enabled)',
          formula: 'pieces.sort((a,b) => max(b.h, b.w) - max(a.h, a.w))',
        },
        step2: {
          title: 'Step 2: Column Generation',
          desc: 'Generate vertical columns using a first-fit strategy',
          formula: 'Column width = max(piece.width) + kerf',
        },
        step3: {
          title: 'Step 3: Shelf Packing (NFDH)',
          desc: 'Pack pieces into horizontal shelves within each column',
          formula: 'If piece.height > remaining_shelf_height: create_new_shelf()',
        },
        step4: {
          title: 'Step 4: Optimization',
          desc: 'Apply local search improvements and rotation optimization',
          formula: 'utilization = Σ(piece_area) / (board_width × board_height)',
        },
      },
      implementation: {
        dataStructures: 'Data Structures',
        piece: 'Piece representation',
        board: 'Board layout',
        column: 'Column structure',
        shelf: 'Shelf organization',
      },
      performance: {
        average: 'Average utilization: 70-85%',
        worst: 'Worst case utilization: 50%',
        best: 'Best case utilization: 95%',
        time: 'Computation time: <100ms for n<1000',
        memory: 'Memory usage: O(n) where n = number of pieces',
      },
      cta: 'Try the optimizer',
    },

    // Optimizer
    optimizer: {
      title: 'Cutting Optimizer',
      subtitle: 'Guillotine algorithm with two-column optimization',
      boardConfig: 'Board Configuration',
      width: 'Width',
      height: 'Length',
      kerf: 'Saw kerf',
      objective: 'Optimization objective',
      objectives: {
        waste: 'Minimize waste',
        balanced: 'Balanced',
        cuts: 'Minimize cuts',
      },
      rotation: '90° Rotation',
      twoColumns: '2-column optimization',
      pieces: 'Pieces to cut',
      addPiece: '+ Add piece',
      quantity: 'Quantity',
      surface: 'Surface',
      visualZoom: 'Visual zoom',
      optimize: '🚀 Optimize cutting',
      recalculate: '🔄 Recalculate',
      optimizing: 'Optimizing...',
      reset: 'Reset example',
      showTests: 'Show tests',
      hideTests: 'Hide tests',
      readyToOptimize: 'Ready to optimize your cuts',
      addPiecesMessage: 'Add pieces to cut in the left panel to start',
      clickToOptimize: 'Click the button to launch optimization',
      pieceTypes: 'piece types',
      totalPieces: 'total pieces',
      board: 'Board',
      pieces2: 'pieces',
      cuts: 'cuts',
      utilization: 'Utilization',
      mode: 'Mode',
      columns: 'columns',
      strips: 'Strips',
      exportAll: 'Export all',
      exportPNG: 'Export PNG',
      exportSVG: 'SVG (Vector)',
      cuttingPlan: 'Complete cutting plan',
      boards: 'boards',
    },
  },

  fr: {
    // Navigation
    nav: {
      home: 'accueil',
      optimizer: 'optimiseur',
      history: 'histoire',
      methodology: 'méthodologie',
    },

    // Homepage
    home: {
      version: 'v1.0.0',
      title: 'Gomory',
      subtitle: "Algorithme de découpe guillotine two-stage pour l'optimisation de matériaux.",
      description:
        "Implémentation open source basée sur les travaux de Ralph E. Gomory (1958). Complexité O(n log n). Taux d'utilisation moyen: 70-85%.",
      cta: {
        optimizer: 'optimiseur →',
        github: 'github ↗',
      },
      sections: {
        technical: 'IMPLÉMENTATION TECHNIQUE',
        features: 'FONCTIONNALITÉS PRINCIPALES',
        stack: 'STACK',
        references: 'RÉFÉRENCES',
        contributing: 'CONTRIBUER',
        support: 'SUPPORT',
      },
      algorithm: {
        title: 'Algorithme',
        content: `tryOneBoardTwoColumns()
├─ Division en colonnes
├─ Empilement NFDH
└─ Optimisation rotation`,
      },
      performance: {
        title: 'Performance',
        content: `Temps: <100ms (n<1000)
Espace: O(n)
Coupes: 20-40 par planche
Perte:  15-30%`,
      },
      constraints: {
        title: 'Contraintes',
        content: `• Coupes guillotine uniquement
• Processus two-stage
• Gestion du trait de scie
• Support rotation 90°`,
      },
      features: [
        {
          title: 'Optimisation guillotine two-stage',
          description:
            "Partitionnement vertical en colonnes suivi d'un empilement horizontal dans chaque colonne. Réduit la complexité computationnelle tout en maintenant des ratios de perte acceptables.",
        },
        {
          title: 'Next Fit Decreasing Height (NFDH)',
          description:
            "Algorithme d'empilement heuristique avec ratio d'approximation prouvé. Pièces triées par hauteur décroissante pour une utilisation optimale des étagères.",
        },
        {
          title: 'Compensation du trait de scie',
          description:
            "Calcul automatique de l'espacement pour la largeur de lame. Valeurs de trait configurables de 0-10mm avec précision sub-millimétrique.",
        },
        {
          title: 'Export multi-format',
          description:
            'Génération PDF avec jsPDF, rastérisation PNG via html2canvas, export SVG natif. Plans de découpe prêts pour la production avec annotations dimensionnelles.',
        },
      ],
      supportText:
        'Si ce projet vous est utile dans vos travaux ou production, vous pouvez soutenir son développement.',
      footer: {
        license: 'Licence MIT',
        madeBy: 'Fait avec précision par',
      },
    },

    // Methodology
    methodology: {
      title: 'Méthodologie',
      subtitle: 'Fondements mathématiques et implémentation technique',
      intro:
        "L'optimiseur de découpe Gomory implémente un algorithme de découpe guillotine two-stage combiné avec l'heuristique NFDH (Next Fit Decreasing Height), fournissant une approximation en temps polynomial pour le problème NP-difficile du bin packing 2D.",
      sections: {
        mathematical: 'Fondements Mathématiques',
        complexity: 'Analyse de Complexité',
        algorithm: "Détails de l'Algorithme",
        implementation: 'Implémentation',
        performance: 'Métriques de Performance',
        references: 'Références Académiques',
      },
      math: {
        title: 'Formulation du Problème',
        binPacking: 'Problème de Bin Packing 2D',
        objective: 'Fonction Objectif',
        constraints: 'Contraintes',
        formulas: {
          minimize: 'Minimiser:',
          subject: 'Sous contraintes:',
          guillotine: 'Contrainte guillotine: Chaque coupe doit traverser toute la dimension',
          noOverlap: 'Contrainte de non-chevauchement',
          binCapacity: 'Contrainte de capacité du bin',
        },
      },
      complexity: {
        title: 'Complexité Computationnelle',
        sorting: 'Tri initial: O(n log n)',
        packing: 'Empilement NFDH par colonne: O(n)',
        total: 'Complexité totale: O(n log n)',
        space: 'Complexité spatiale: O(n)',
        comparison: 'Comparaison avec solutions optimales:',
        nfdh: "Ratio d'approximation NFDH: 2",
        twoStage: "Guillotine two-stage: ratio d'approximation 2.5",
      },
      algorithmDetails: {
        step1: {
          title: 'Étape 1: Prétraitement',
          desc: 'Tri des pièces par hauteur décroissante (ou largeur si rotation activée)',
          formula: 'pieces.sort((a,b) => max(b.h, b.w) - max(a.h, a.w))',
        },
        step2: {
          title: 'Étape 2: Génération de Colonnes',
          desc: 'Génération de colonnes verticales avec stratégie first-fit',
          formula: 'Largeur colonne = max(piece.largeur) + trait_scie',
        },
        step3: {
          title: 'Étape 3: Empilement en Étagères (NFDH)',
          desc: 'Empilement des pièces en étagères horizontales dans chaque colonne',
          formula: 'Si piece.hauteur > hauteur_restante_étagère: créer_nouvelle_étagère()',
        },
        step4: {
          title: 'Étape 4: Optimisation',
          desc: "Application d'améliorations par recherche locale et optimisation de rotation",
          formula: 'utilisation = Σ(surface_pièce) / (largeur_planche × hauteur_planche)',
        },
      },
      implementation: {
        dataStructures: 'Structures de Données',
        piece: 'Représentation des pièces',
        board: 'Disposition de la planche',
        column: 'Structure des colonnes',
        shelf: 'Organisation des étagères',
      },
      performance: {
        average: 'Utilisation moyenne: 70-85%',
        worst: 'Utilisation pire cas: 50%',
        best: 'Utilisation meilleur cas: 95%',
        time: 'Temps de calcul: <100ms pour n<1000',
        memory: 'Utilisation mémoire: O(n) où n = nombre de pièces',
      },
      cta: "Essayer l'optimiseur",
    },

    // Optimizer
    optimizer: {
      title: 'Optimiseur de découpe',
      subtitle: 'Algorithme guillotine avec optimisation deux colonnes',
      boardConfig: 'Configuration planche',
      width: 'Largeur',
      height: 'Longueur',
      kerf: 'Trait de scie',
      objective: "Objectif d'optimisation",
      objectives: {
        waste: 'Minimiser les chutes',
        balanced: 'Équilibré',
        cuts: 'Minimiser les coupes',
      },
      rotation: 'Rotation 90°',
      twoColumns: 'Optimisation 2 colonnes',
      pieces: 'Pièces à découper',
      addPiece: '+ Ajouter une pièce',
      quantity: 'Quantité',
      surface: 'Surface',
      visualZoom: 'Zoom visuel',
      optimize: '🚀 Optimiser la découpe',
      recalculate: '🔄 Recalculer',
      optimizing: 'Optimisation en cours...',
      reset: "Réinitialiser l'exemple",
      showTests: 'Afficher les tests',
      hideTests: 'Masquer les tests',
      readyToOptimize: 'Prêt à optimiser vos découpes',
      addPiecesMessage: 'Ajoutez des pièces à découper dans le panneau de gauche pour commencer',
      clickToOptimize: "Cliquez sur le bouton pour lancer l'optimisation",
      pieceTypes: 'types de pièces',
      totalPieces: 'pièces totales',
      board: 'Planche',
      pieces2: 'pièces',
      cuts: 'coupes',
      utilization: 'Utilisation',
      mode: 'Mode',
      columns: 'colonnes',
      strips: 'Bandes',
      exportAll: 'Exporter tout',
      exportPNG: 'Export PNG',
      exportSVG: 'SVG (Vectoriel)',
      cuttingPlan: 'Plan de découpe complet',
      boards: 'planches',
    },
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

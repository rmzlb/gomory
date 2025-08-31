Oui — Gomory est cohérent sur le fond, mais petite nuance :

Ce que fait “Gomory” dans la littérature :

les coupes de Gomory (méthode de plans de coupe en PLNE), et

surtout, Gilmore–Gomory pour le cutting stock (génération de colonnes) — ultra-référent pour l’optimisation de découpe (plutôt 1D, avec extensions 2D par patterns).

Ce que fait ton outil aujourd’hui : un heuristique 2D guillotine (two-stage + NFDH), pas de génération de colonnes ni de plans de coupe.

👉 Conclusion : le nom “Gomory” colle très bien au domaine (optimisation de découpe), même si l’algorithme exact utilisé n’est pas (encore) du Gilmore–Gomory ni des coupes de Gomory. Si tu envisages plus tard un mode MILP / génération de colonnes pour des patterns guillotine ou 2-étapes, alors le nom sera parfaitement aligné.

Si tu veux un label 100% “math/geo” non patronymique mais toujours optimisation :

Convexe, Affine, Argmax, Simplexe (plus “méthodo générique”),
mais mon choix branding pour ce produit reste Gomory.
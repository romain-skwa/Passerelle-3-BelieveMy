Dans le projet passerelle 3, les étudiants devaient créer un clone de twitter en utilisant React.
J'ai pris énormément de temps. J'ai du recommencer les cours react à un moment  où j'étais sur le point d'abandonner l'ensemble de la formation.
J'ai préféré continuer par petites touches plutôt que tout laisser tomber.
J'ai accepté l'idée d'utiliser une Intelligence Articficielle : BlackBox. Elle m'a permis de gagner des heures en m'évitant de rechercher les informations nécessaires dans les cours. Elle m'a également éviter d'attendre l'aide d'autres étudiants.
Mais les IA ne sont pas encore prêtes à remplacer les humains. Si BlackBox m'a fait gagner du temps, elle m'a parfois fait perdre plusieurs jours d'affilée. Et quand elle ne réussissait pas à m'expliquer le problème en quelques minutes, elle y arrivait rarement au bout de plusieurs heures. Il fallait que je reformule ma question différement, de manière plus précise etc... Quand elle n'arrivait pas à régler le problème rapidement, la solution venait de moi. Mais cela demandait du temps.

J'ai donc créé un site dans lequel il est obligatoire de s'inscrire pour pouvoir publier un tweet ou commenter des tweets. Le site n'est pas responsive, ce qui signifie qu'il n'est pas adapté à tous les formats d'écran.
Les tweets et leurs commentaires sont au centre de l'écran. Les menus sont à gauche. La droite de l'écran est réservée à une fenêtre de dialogue.
Quand l'utilisateur n'est pas connecté, seuls les liens "connexion" et "inscription" sont visibles. S'il tente de cliquer sur lien pour liker, commenter, écrire un message ou s'abonner, il ira sur la page "se connecter".

Pour créer un compte, il y a un formulaire dans lequel l'adresse mail servira d'idenfiant unique. Le pseudonyme pourra être changer. C'est pour cette raison que celui-ci ne sert pas d'identifiant. il faudra entrer un mot de passe qu'il faudra confirmer. Dans le cas où les mots de passe seraient différents, une alerte serait affichée demandant l'utilisateur fournisse deux mots de passe identique. Il y a également une sécurité pour s'assurer que l'adresse mail en est bien une.

Il est possible pour le nouvel utilisateur d'ajouter un avatar et une présentation de lui-même. Ceci est facultatif. J'ai envisagé l'ajout une bannière mais j'ai préféré oublier cette idée. La presentation et l'avatar sont modifiables à tous moments. Quand aucun avatar n'a été choisi, une image par défaut s'affiche.

Quand l'utilisateur est connecté, son pseudonyme est affiché à la suite de "bonjour".
Entre 18h et 6h, "Bonsoir" remplace "Bonjour" en haut à gauche.

Un bouton en bas à droite est toujours visible pour remonter tout en haut de la page en un clic.

Pour commencer, 5 tweets apparaissent pour éviter de se retrouver avec des centaines de textes et images affichés et à chaque chargement de page. Il en est de même pour les commentaires ou les tweets sur les pages "auteur que vous suivez". Ensuite, l'utilisateur clique sur un bouton pour en ajouter 5. Petit détail dispensable : lorsque que l'on arrive à la fin des tweets et qu'il en reste moins de cinq à découvrir, le bouton affiche "Quelques tweets supplémentaires" à la place de "5 tweets supplémentaires...". Et quand tous les tweets sont affichés, le bouton indique "Tous les tweets sont affichés".

L'encadré qui contient le formulaire de création de tweet est imposant. Afin qu'il ne soit affiché seulement quand l'utisateur le décide, il est remplacé par un encadré plus petit affichant "Ecrire un nouveau tweet".

Les tweets présentent l'avatar de l'utilisateur, le titre et le texte obligatoires. Une image facultative peut-être affichée entre le titre et le texte.
En dessous, une barre contient le cœur faisant office de "like", uen icone "texte" pour commenter, une icone "enveloppe" pour écrire à l'auteur du tweet et un bouton "s'abonner".
Une dernière ligne indqiue le pseudo de l'auteur, la date et l'heure de publication du tweet.

De manière générale, quand un pseudonyme est modifié par s'on utilisateur, il est changé partout sur le site. Il n'est jamais enregistré sous un tweet et sera mis à jour à chaque changement.

Chaque auteur d'un tweet a la possibilité de changer son tweet. S'il le fait, une mention "modifié" est ajoutée après l'heure de la publication. Durant la modification, il est possible de changer le texte et d'ajouter ou changer l'image. Le champ dans lequel l'utilisateur modifie son texte contient déjà le texte d'origine. Cela évite de devoir tout écrire une nouvelle fois.

L'auteur de chaque tweet est le seul a pouvoir supprimer son propre tweet.

L'utilisateur voit son avatar affiché en gros dans la page "mes propres tweets". Il y voit également sa description. 
Il peut voir l'avatar des autres et leur description en cliquant soit sur leur nom, soit sur leur avatar.

L'utilisateur peut en suivre d'autre en cliquant sur le bouton s'abonner. Le nom de la personne suivie s'affiche. immédiatement dans la liste à gauche "les auteurs qui vous suivez". Il n'y pas besoin d'actualiser la page manuellement.

Si j'ai correctement fait le travail, tous les changements sont pris en compte automatiquement.

Certaines parties m'ont demandé tellement de patience que je n'ai pas eu le cœur à les supprimer plus tard. Ce n'est pas du tout professionnel mais je vais rendre ce projet avec trois mois de retard de toute façon... Je me retrouve avec deux fenêtres de dialogue à la placé d'une seule. J'ai un mélange de facebook et de twitter complètement inutile qui m'a demandé environ 10 jours. Quelle perte de temps. La fenêtre de droite ne s'affiche que lorsque l'utilisateur clique dans la partie "nouveaux messages" et à condition que la fenêtre du centre ne soit pas déjà ouverte. Pendant une longue période, il pouvait y avoir deux fenêtres qui s'affichaient en même temps. Ce qui n'était pas très contraignant jusqu'à ce que je réalise que les deux fenêtres pouvaient afficher la même conversation.
Quand l'utilisateur découvre un nouveau message en cliquant sur le nom de la personne lui ayant écrit, le nom de l'auteur du message disparait de l'encadré "nouveaux messages" puisque les messages sont considérés comme étant lus, donc ils ne sont pas nouveaux.
J'ai fait en sorte que le nom dans l'encadré "nouveaux messages" disparaisse même si l'utilisateur clique sur ce nom dans l'encadré d'en dessous "Vos conversations avec :". C'est à dire que s'il y un nouveau message provenant de Nicolas. Son nom sera affiché dans l'encadré "nouveaux messages". Et si ce nom est déjà présent dans l'encadré de dessous et que l'utilsateur clique sur Nicolas dans l'encadré "Vos conversations avec :", le nom Nicolas s'effacera automatiquement de l'encadré "nouveaux messages". Bref, si c'était à refaire, je chercherais à créer un seul encadré avec une petite icone indiquant les conversations avec de nouveaux messages. Et j'oublierais cette idée de deux fenêtres complètement inutile.

Dans l'encadré tout en haut à gauche, certains liens ne sont visibles seulement quand l'utilisateur est connecté. "Mes abonnements" mène à la page où les tweets récents des auteurs suivis seront affichés. "Mes propres tweets" est un lien où l'utilisateur verra ses derniers tweets. Comme expliqué précédement, il peut ajouter 5 tweets à l'aide d'un bouton "afficher 5 tweets supplémentaires". Le dernier lien visible seulement quand l'utilisateur est connecté : "Modifier mon profil".

J'ai cherché à rendre l'interface de le plus sobre possible, pas forcément sombre, juste sobre. J'avais envisagé des animations amenant à l'affichage des menus. Il n'en reste plus grand chose. J'avais créé des sorte de lumières pour simuler des néons sur les cotés. Le résultat ne me convenait pas. J'ai opté pour une solution de facilité : le neumorphism. Si j'avais du temps à consacrer, j'essaierais de concevoir un menu complexe dont j'épargne les détails. Celui que j'ai laissé est on ne peut plus basique. Mais j'ai passé trop de temps sur ce projet.

Il reste des choses à faire pour optimiser les performances du site. Mais j'aurais rendre mes travaux il y a longtemps. Mes tentatives d'optimisation m'ont fait perdre du temps. Plusieurs jours quand je n'arrivais pas à mettre à jour automatiquement le nombre de commentaires. Et cette IA qui ne m'indiquait que la moitié du problème.
Ce fichier servant de contexte est trop grand. Et celui consacré à l'apparence est encore pire. J'aurais du utiliser le SASS.
J'ai passé trop de temps. Je m'arrête là.
# Sources du moteur d'émotions

## FEEL — French Expanded Emotion Lexicon

Le moteur utilise FEEL comme ressource principale lorsqu'elle est disponible.

- Source officielle : https://advanse.lirmm.fr/feel.php
- Article : Abdaoui, Azé, Bringay & Poncelet, *FEEL: French Expanded Emotion Lexicon*, Language Resources and Evaluation, 2017.
- Miroir public utilisé par le moteur : https://github.com/sborms/sentometrics/blob/master/data-raw/lexicons-raw/FEEL_raw.csv
- Chargement dans l'application : https://raw.githubusercontent.com/sborms/sentometrics/master/data-raw/lexicons-raw/FEEL_raw.csv

FEEL contient plus de 14 000 termes français distincts et associe les termes à une polarité positive/négative ainsi qu'à six émotions de base. Le fichier utilisé par le moteur contient aussi des formes fléchies issues de la ressource FEEL.

## NRC Emotion Lexicon

FEEL a été construit à partir du NRC Word-Emotion Association Lexicon.

- Source officielle : https://www.nrc.canada.ca/en/research-development/products-services/technical-advisory-services/sentiment-emotion-lexicons

Le NRC indique que son lexique d'émotions couvre plus de 14 000 unigrams et huit émotions, avec des traductions automatiques disponibles en français. Les conditions d'utilisation dépendent du contexte ; les usages commerciaux peuvent nécessiter une licence.

## Vocabulaire français complémentaire

Le moteur conserve également un noyau local de mots, expressions, négations, intensificateurs et atténuateurs français. Ce noyau sert de secours lorsque la ressource distante n'est pas disponible et améliore notamment les constructions comme :

- négation : « pas », « ne », « jamais », « rien », « aucun »
- intensité : « très », « vraiment », « extrêmement », « complètement »
- atténuation : « un peu », « assez », « plutôt », « légèrement »
- contraste : « mais », « cependant », « pourtant », « en revanche »

## Fonctionnement dans le portfolio

Le navigateur tente de charger FEEL au démarrage.

- FEEL chargé : analyse avec le lexique FEEL + règles locales de contexte.
- FEEL indisponible : analyse locale de secours, sans IA externe.
- Aucun modèle d'IA ou API de génération n'est utilisé pour cette analyse.

Dernière révision : 2026.

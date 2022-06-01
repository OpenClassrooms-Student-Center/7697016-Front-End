/* global Chart */

// Fonction qui enregistre des event listener sur les boutons de la page.
// Elle sera appelée après chaque génération ou mise à jour de la page
// car pour la mettre à jour, on supprime l'intégralité des éléments DOM avec innerHTML = "".
// Il faut donc ré-enregistrer les listener sur les nouveaux boutons.
export function ajoutListenersAvis() {
	const piecesElements = document.querySelectorAll(".fiches article button");

	for (let i = 0; i < piecesElements.length; i++) {
		piecesElements[i].addEventListener("click", async function (event) {
			// Récupération de la valeur de l'attribut data-id="XX".
			const id = event.target.dataset.id;
			// Attente de la réponse de l'API.
			const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");
			// Reconstruction des données en mémoire depuis la réponse au format JSON.
			const avis = await reponse.json();
			// Sauvegarde des avis dans le localStorage
			window.localStorage.setItem("avis-piece-" + id, JSON.stringify(avis));

			// Récupération de la balise article pour la pièce désirée.
			const pieceElement = event.target.parentElement;
			afficherAvis(pieceElement, avis);
		});
	}
}

export function afficherAvis(pieceElement, avis) {
	// Création d'une balise p pour regrouper tous les avis.
	const avisElement = document.createElement("p");

	for (let i = 0; i < avis.length; i++) {
		avisElement.innerHTML += avis[i].utilisateur + ": " + avis[i].commentaire + "<br>";
	}

	pieceElement.appendChild(avisElement);
}

const formulaireAvis = document.querySelector(".formulaire-avis");
formulaireAvis.addEventListener("submit", function (event) {
	// Désactivation du comportement par défaut du navigateur
	event.preventDefault();

	// Création de l’objet du nouvel avis.
	const avis = {
		pieceId: event.target.querySelector("[name=piece-id]").value,
		utilisateur: event.target.querySelector("[name=utilisateur").value,
		nbEtoiles: event.target.querySelector("[name=nb-etoiles").value,
		commentaire: event.target.querySelector("[name=commentaire]").value,
	};

	// Création de la charge utile au format JSON
	const chargeUtile = JSON.stringify(avis);

	// Appel de la fonction fetch avec toutes les informations nécessaires
	fetch("http://localhost:8081/avis", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: chargeUtile
	});
});

// Calcul du nombre total de commentaires par quantité d'étoiles attribuées
const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
const nb_commentaires = [0, 0, 0, 0, 0];

for (let commentaire of avis) {
	nb_commentaires[commentaire.nbEtoiles - 1]++;
}

// Légende qui s'affichera sur la gauche à côté de la barre horizontale
const labels = ["5", "4", "3", "2", "1"];

// Données et personnalisation du graphique
const data = {
	labels: labels,
	datasets: [{
		label: "Étoiles attribuées",
		data: nb_commentaires.reverse(),
		backgroundColor: "rgba(255, 230, 0, 1)", // jaune
	}],
};

// Objet de configuration final
const config = {
	type: "bar",
	data: data,
	options: {
		indexAxis: "y",
	},
};

// Rendu du graphique dans l'élément canvas
new Chart(
	document.querySelector("#graphique-avis"),
	config,
);

// Récupération des pièces depuis le localStorage
const piecesJSON = window.localStorage.getItem("pieces");
const pieces = JSON.parse(piecesJSON);

// Calcul du nombre de commentaires
let nbCommentairesDispo = 0;
let nbCommentairesNonDispo = 0;

for (let i = 0; i < avis.length; i++) {
	const piece = pieces.find(p => p.id === avis[i].pieceId);

	if (piece) {
		if (piece.disponibilite) {
			nbCommentairesDispo++;
		} else {
			nbCommentairesNonDispo++;
		}
	}
}

// Légende qui s'affichera sur la gauche à côté de la barre horizontale
const labelsDispo = ["Disponibles", "Non dispo."];

// Données et personnalisation du graphique
const dataDispo = {
	labels: labelsDispo,
	datasets: [{
		label: "Nombre de commentaires",
		data: [nbCommentairesDispo, nbCommentairesNonDispo],
		backgroundColor: "rgba(0, 230, 255, 1)", // turquoise
	}],
};

// Objet de configuration final
const configDispo = {
	type: "bar",
	data: dataDispo,
};

// Rendu du graphique dans l'élément canvas
new Chart(
	document.querySelector("#graphique-dispo"),
	configDispo,
);

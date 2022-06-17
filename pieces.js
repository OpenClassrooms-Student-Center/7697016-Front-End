// Récupération des pièces depuis le fichier JSON
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

// Création des éléments et remplissage du texte ou de la source de l'image
const ampoule = pieces[0];

const imageElement = document.createElement("img");
imageElement.src = ampoule.image;

const nomElement = document.createElement("h2");
nomElement.innerText = ampoule.nom;

const prixElement = document.createElement("p");
prixElement.innerText = "Prix : " + ampoule.prix + " €"
	+ " ("
	+ (ampoule.prix < 35 ? "€" : "€€€")
	+ ")";

const categorieElement = document.createElement("p");
categorieElement.innerText = ampoule.categorie ?? "(aucune catégorie)";

const descriptionElement = document.createElement("p");
descriptionElement.innerText = ampoule.description ?? "Pas de description pour le moment.";

const disponibiliteElement = document.createElement("p");
disponibiliteElement.innerText = ampoule.disponibilite ? "En stock" : "Rupture de stock";

// Récupération de l'élément du DOM qui accueillera les fiches
const sectionFiches = document.querySelector(".fiches");

// Ajout des éléments créés dans le DOM
sectionFiches.appendChild(imageElement);
sectionFiches.appendChild(nomElement);
sectionFiches.appendChild(prixElement);
sectionFiches.appendChild(categorieElement);
sectionFiches.appendChild(descriptionElement);
sectionFiches.appendChild(disponibiliteElement);

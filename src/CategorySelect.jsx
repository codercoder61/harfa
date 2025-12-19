import React, { useState } from "react";

const categories = [
  { id: 1, label: "Centre d'appels" },
  { id: 2, label: "Cadres" },
  { id: 3, label: "Métiers IT" },
  { id: 4, label: "Administratif" },
  { id: 5, label: "Commercial" },
  { id: 6, label: "Autres Emploi" },
  { id: 7, label: "Femmes de ménage, Nounous" },
  { id: 8, label: "Gardiennage et Sécurité" },
  { id: 9, label: "Rénovation, Bricolage, Travaux de maison et jardin" },
  { id: 10, label: "Chauffeur, Déménagement, Transport de marchandise" },
  { id: 11, label: "Cuisinières, Serveur, Barman" },
  { id: 12, label: "Coiffure et Esthétique" },
  { id: 13, label: "Infirmier et Kinésithérapeute" },
  { id: 14, label: "Services Informatique et réparation" },
  { id: 15, label: "Services Administratif, Financier, Juridique" },
  { id: 16, label: "Autres Services" },
  { id: 17, label: "Cours et Formations" },
  { id: 18, label: "Stages" },
  { id: 19, label: "Location de salle de formation" },
  { id: 20, label: "Business et affaire commerciale" },
  { id: 21, label: "Animation" },
  { id: 22, label: "Traiteur" },
  { id: 23, label: "Conférences" },
  { id: 24, label: "Autres évènements" },
  { id: 25, label: "Autre" },
];

export default function CategorySelect({ onCategoryChange }) {
  const [categoryId, setCategoryId] = useState(null);

  const handleChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setCategoryId(value);

    // 🔥 send value to parent
    onCategoryChange(value);
  };

  return (
    <div>
      <label>
        <span style={{ color: "red" }}>*</span> Catégorie :
      </label>
 
      <select value={categoryId ?? ""} onChange={handleChange}>
        <option value="">-- Choisir une catégorie --</option>

        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
}
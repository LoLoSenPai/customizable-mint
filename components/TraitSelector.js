"use client";

import { useState, useEffect } from 'react';
import CanvasComponent from './CanvasComponent';  // Import direct du composant

const categories = [
    'BGs',
    'Cosmos',
    'Skins',
    'Expressions',
    'Hairs',
    'Armors',
    'Helmets',
    'Energy FX',
];

export default function TraitSelector() {
    const [selectedTraits, setSelectedTraits] = useState({});
    const [traits, setTraits] = useState({});

    // Charger les noms des traits pour chaque catégorie
    useEffect(() => {
        const fetchTraits = async (category) => {
            const response = await fetch(`/api/layers/${category}`);
            const traitNames = await response.json();
            setTraits((prev) => ({ ...prev, [category]: traitNames }));
        };

        categories.forEach(fetchTraits);
    }, []);

    const handleSelectTrait = (category, trait) => {
        setSelectedTraits((prev) => ({
            ...prev,
            [category]: trait
        }));
    };

    return (
        <div className="flex justify-center space-x-20 items-center min-h-screen p-4">
            {/* Section des attributs (gauche) */}
            <div className="w-1/4 p-4">
                <h2 className="font-bold text-xl mb-4">Attributs</h2>
                {categories.map((category) => (
                    <div key={category} className="mb-4">
                        <label className="font-semibold">{category}</label>
                        <select
                            className="w-full mt-2 p-2 border rounded text-black"
                            onChange={(e) => handleSelectTrait(category, e.target.value)}
                            value={selectedTraits[category] || ''}
                        >
                            <option value="" disabled>Choose a trait</option>
                            {traits[category] && traits[category].map((trait) => (
                                <option key={trait} value={trait}>
                                    {trait}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {/* Canvas de rendu (droite) */}
            <div className="w-3/4">
                <CanvasComponent selectedTraits={selectedTraits} categories={categories} />
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from 'react';
import CanvasComponent from './CanvasComponent';
import NFTPopup from './NFTPopup';

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
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

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

    const allTraitsSelected = categories.every((category) => selectedTraits[category]);

    const handleGenerateImage = async () => {
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedTraits }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setCapturedImage(imageUrl);
                setIsPopupOpen(true); // Ouvrir la popup après avoir généré l'image
            } else {
                console.error('Error generating image');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
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
                {allTraitsSelected && (
                    <button onClick={handleGenerateImage} className="mt-4 p-2 bg-blue-500 text-white rounded">
                        Show NFT
                    </button>
                )}
            </div>

            {/* Canvas de rendu (droite) */}
            <div className="w-3/4">
                <CanvasComponent selectedTraits={selectedTraits} categories={categories} />
            </div>
            <NFTPopup
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                selectedTraits={selectedTraits}
                imageUrl={capturedImage}
            />
        </div>
    );
}

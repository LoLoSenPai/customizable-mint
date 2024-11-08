"use client";

export default function NFTPopup({ isOpen, onClose, selectedTraits, imageUrl }) {
    if (!isOpen) return null;

    const metadata = {
        name: "TEST SEIYA #1", // Utilise un nom dynamique si nécessaire
        description: "Test description",
        image: "REPLACE/1.png", // Remplace par l'URL de l'image si elle est disponible
        edition: 1, // Numéro d'édition, modifiable si besoin
        attributes: Object.entries(selectedTraits).map(([traitType, value]) => ({
            trait_type: traitType,
            value: value,
        }))
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
            <div className="bg-white p-4 rounded-md max-w-md w-full">
                <button onClick={onClose} className="float-right text-xl font-bold">×</button>
                <h2 className="text-lg font-bold mb-2">NFT Preview</h2>
                {imageUrl && <img src={imageUrl} alt="NFT Preview" className="w-full rounded mb-4" />}
                <h3 className="font-semibold">Metadata:</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(metadata, null, 2)}</pre>
            </div>
        </div>
    );
}

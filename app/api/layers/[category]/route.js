import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request, context) {
    // Attendre de façon asynchrone le paramètre `category`
    const { category } = await context.params;

    // Construire le chemin vers le dossier de la catégorie
    const directoryPath = path.join(process.cwd(), 'layers', category);

    try {
        // Lire les fichiers du dossier
        const files = await fs.readdir(directoryPath);

        // Filtrer pour obtenir seulement les fichiers .png et enlever l'extension
        const traitNames = files
            .filter((file) => file.endsWith('.png'))
            .map((file) => file.replace('.png', ''));

        return new Response(JSON.stringify(traitNames), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Error reading files', { status: 500 });
    }
}

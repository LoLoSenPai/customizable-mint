import sharp from 'sharp';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { selectedTraits } = await req.json();

        const layers = Object.entries(selectedTraits).map(([category, trait]) => ({
            input: path.resolve(`./public/layers/${category}/${trait}.png`)
        }));

        const buffer = await sharp(layers[0].input)
            .composite(layers.slice(1))
            .toBuffer();

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/png',
            },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse('Error generating image', { status: 500 });
    }
}

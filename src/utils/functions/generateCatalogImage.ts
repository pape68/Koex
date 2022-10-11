import { join } from 'node:path';

import Canvas, { GlobalFonts } from '@napi-rs/canvas';
import axios from 'axios';
import moment from 'moment';
import getCatalogInfo from './getCatalogInfo';

interface ImageItem {
    name: string;
    rarity: string;
    price: number;
    image: string;
}

const generateCatalogImage = async () => {
    const catalog = await getCatalogInfo();

    const entries = catalog.featured.entries.concat(catalog.daily.entries, catalog.specialFeatured.entries);

    let items: ImageItem[] = [];
    for (const entry of entries) {
        items.push({
            name: entry.bundle?.name ?? entry.items[0].name,
            rarity: entry.items[0].rarity.value.toLowerCase(),
            price: entry.regularPrice,
            image: entry.newDisplayAsset.materialInstances[0].images.Background
        });
    }

    items = [...new Set(items)];

    const canvas = Canvas.createCanvas(1100, 1200);

    GlobalFonts.registerFromPath(join(process.cwd(), 'assets', 'fonts', 'BurbankBigRegularBlack.otf'), 'Burbank Black');

    const ctx = canvas.getContext('2d');
    const gridSize = Math.ceil(Math.sqrt(items.length));
    const p = 4;

    const background = await Canvas.loadImage(join(process.cwd(), 'assets', 'images', 'background.png'));
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 50px "Burbank Black"';
    ctx.textAlign = 'left';
    ctx.fillText('Item Shop', 50, 67.5);

    ctx.font = 'italic 30px "Burbank Black"';
    ctx.textAlign = 'right';
    ctx.fillText(moment(new Date()).format('MM/DD/YYYY'), canvas.width - 50, 50);

    ctx.font = 'italic 25px "Burbank Black"';
    ctx.fillText('discord.gg/Koex', canvas.width - 50, 80);

    for (let i = 0; i < items.length; i++) {
        const x = i % gridSize;
        const y = Math.floor(i / gridSize) + 1;

        const item = items[i];

        const { data } = await axios.get(item.image, { responseType: 'arraybuffer' });
        const cosmetic = await Canvas.loadImage(data);

        const rarityTagUrl = new URL('file:///' + join(process.cwd(), 'assets', 'images', item.rarity + '.png'));
        const priceTagUrl = new URL('file:///' + join(process.cwd(), 'assets', 'images', 'tag.png'));
        const priceTag = await Canvas.loadImage(priceTagUrl);
        const rarityTag = await Canvas.loadImage(rarityTagUrl);
        const imageSize = canvas.width / gridSize;

        ctx.drawImage(cosmetic, x * imageSize + p, y * imageSize + p / 2, imageSize - p * 2, imageSize - p * 2);
        ctx.drawImage(priceTag, x * imageSize + p, y * imageSize + p / 2, imageSize - p * 2, imageSize - p * 2);
        ctx.drawImage(rarityTag, x * imageSize + p, y * imageSize + p / 2, imageSize - p * 2, imageSize - p * 2);

        ctx.font = `italic ${
            item.name.length > 16 ? imageSize / item.name.length + 2 : imageSize / 10
        }px "Burbank Black"`;
        ctx.textAlign = 'center';
        ctx.fillText(item.name, x * imageSize + 0.5 * imageSize, y * imageSize + 0.85 * imageSize);

        ctx.font = `italic ${imageSize / 10 / 1.4}px "Burbank Black"`;
        ctx.fillText(item.price.toLocaleString(), x * imageSize + 0.24 * imageSize, y * imageSize + 0.12 * imageSize);
    }

    return canvas.toBuffer('image/png');
};

export default generateCatalogImage;

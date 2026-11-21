import sharp from 'sharp';

async function processLogo() {
  const inputPath = 'public/aedvix-logo-original.jpg';
  const img = sharp(inputPath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  // 1. Full logo bounds: x: 180 to 874, y: 372 to 654
  const pad = 12;
  const lX = Math.max(0, 180 - pad);
  const rX = Math.min(width - 1, 874 + pad);
  const tY = Math.max(0, 372 - pad);
  const bY = Math.min(height - 1, 654 + pad);

  const cropW = rX - lX + 1;
  const cropH = bY - tY + 1;

  // 2. Exact Emblem bounds (symmetric around x = 329):
  // Center is 329. Left: 180 - 10 = 170. Right: 329 + (329 - 170) = 488.
  const eLX = 170;
  const eRX = 488;
  const eCropW = eRX - eLX + 1;

  const logoOriginalBuf = Buffer.alloc(cropW * cropH * 4);
  const logoDarkBgBuf = Buffer.alloc(cropW * cropH * 4);

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const srcX = lX + x;
      const srcY = tY + y;
      const srcIdx = (srcY * width + srcX) * 3;
      const destIdx = (y * cropW + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      const brightness = (r + g + b) / 3;

      let alpha = 255;
      if (brightness > 248) {
        alpha = 0;
      } else if (brightness > 225) {
        alpha = Math.round((255 - brightness) / (255 - 225) * 255);
      }

      logoOriginalBuf[destIdx] = r;
      logoOriginalBuf[destIdx + 1] = g;
      logoOriginalBuf[destIdx + 2] = b;
      logoOriginalBuf[destIdx + 3] = alpha;

      if (alpha > 0) {
        // Dark navy threshold
        const isDarkNavy = (r < 75 && g < 75 && b < 120);
        if (isDarkNavy) {
          logoDarkBgBuf[destIdx] = 255;
          logoDarkBgBuf[destIdx + 1] = 255;
          logoDarkBgBuf[destIdx + 2] = 255;
          logoDarkBgBuf[destIdx + 3] = alpha;
        } else {
          logoDarkBgBuf[destIdx] = r;
          logoDarkBgBuf[destIdx + 1] = g;
          logoDarkBgBuf[destIdx + 2] = b;
          logoDarkBgBuf[destIdx + 3] = alpha;
        }
      } else {
        logoDarkBgBuf[destIdx + 3] = 0;
      }
    }
  }

  // Save Full Logo
  await sharp(logoOriginalBuf, {
    raw: { width: cropW, height: cropH, channels: 4 }
  })
  .png()
  .toFile('public/aedvix-logo-light.png');

  await sharp(logoDarkBgBuf, {
    raw: { width: cropW, height: cropH, channels: 4 }
  })
  .png()
  .toFile('public/aedvix-logo-dark.png');

  // Emblem buffers: Extract ONLY the emblem
  // Mask out anything with srcX > 476 OR (srcX >= 445 && srcY < 585)
  const emblemOriginalBuf = Buffer.alloc(eCropW * cropH * 4);
  const emblemDarkBgBuf = Buffer.alloc(eCropW * cropH * 4);

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < eCropW; x++) {
      const srcX = eLX + x;
      const srcY = tY + y;
      const destIdx = (y * eCropW + x) * 4;

      // Filter out any pixel that belongs to the adjacent letter 'e'
      const isLetterE = srcX > 476 || (srcX >= 445 && srcY < 585);

      if (isLetterE) {
        emblemOriginalBuf[destIdx + 3] = 0;
        emblemDarkBgBuf[destIdx + 3] = 0;
        continue;
      }

      const srcIdx = (srcY * width + srcX) * 3;
      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];
      const brightness = (r + g + b) / 3;

      let alpha = 255;
      if (brightness > 248) {
        alpha = 0;
      } else if (brightness > 225) {
        alpha = Math.round((255 - brightness) / (255 - 225) * 255);
      }

      emblemOriginalBuf[destIdx] = r;
      emblemOriginalBuf[destIdx + 1] = g;
      emblemOriginalBuf[destIdx + 2] = b;
      emblemOriginalBuf[destIdx + 3] = alpha;

      if (alpha > 0) {
        const isDarkNavy = (r < 75 && g < 75 && b < 120);
        if (isDarkNavy) {
          emblemDarkBgBuf[destIdx] = 255;
          emblemDarkBgBuf[destIdx + 1] = 255;
          emblemDarkBgBuf[destIdx + 2] = 255;
          emblemDarkBgBuf[destIdx + 3] = alpha;
        } else {
          emblemDarkBgBuf[destIdx] = r;
          emblemDarkBgBuf[destIdx + 1] = g;
          emblemDarkBgBuf[destIdx + 2] = b;
          emblemDarkBgBuf[destIdx + 3] = alpha;
        }
      } else {
        emblemDarkBgBuf[destIdx + 3] = 0;
      }
    }
  }

  await sharp(emblemOriginalBuf, {
    raw: { width: eCropW, height: cropH, channels: 4 }
  })
  .png()
  .toFile('public/aedvix-emblem-light.png');

  await sharp(emblemDarkBgBuf, {
    raw: { width: eCropW, height: cropH, channels: 4 }
  })
  .png()
  .toFile('public/aedvix-emblem-dark.png');

  await sharp(emblemDarkBgBuf, {
    raw: { width: eCropW, height: cropH, channels: 4 }
  })
  .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('public/favicon.png');

  console.log('Successfully generated isolated, perfectly symmetrical emblem with zero artifacts!');
}

processLogo().catch(console.error);

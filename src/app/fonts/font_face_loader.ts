import { type FontFamily } from 'ui/font';

export class FontFaceLoader {
  async loadFontFamily({
    fontFamily,
    fontFiles,
  }: FontFamily): Promise<void> {
    const fontFaces = fontFiles.map(({ uri }) => new FontFace(fontFamily, `url(${uri})`));

    await Promise.all(fontFaces.map(fontFace => this.loadFontFace(fontFace)));
  }

  private async loadFontFace(fontFace: FontFace): Promise<void> {
    await fontFace.load();
    // // make sure it's actually loaded
    await fontFace.loaded;
    // // really make sure
    // while (fontFace.status === 'loading') {
    //await delay(100);
    // }
  }
}

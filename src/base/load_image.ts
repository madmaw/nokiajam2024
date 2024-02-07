export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>(function (resolve, reject) {
    const image = new Image();
    image.onload = function () {
      resolve(image);
    };
    image.onerror = reject;
    image.src = src;
  });
}

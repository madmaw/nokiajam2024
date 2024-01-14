export type FontFile = {
  readonly uri: string,
  readonly format: string,
};

export type FontFamily = {
  readonly fontFamily: string;
  readonly fontFiles: readonly FontFile[],
  readonly unscaledFontSize: number;
  readonly unscaledLineHeight: number;
}

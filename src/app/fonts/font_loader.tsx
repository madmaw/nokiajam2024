import {
  css,
  Global,
} from '@emotion/react';
import type { FontFile } from 'ui/font';

export function FontsLoader({
  fontFiles,
  fontFamily,
}: {
  readonly fontFiles: readonly FontFile[],
  readonly fontFamily: string,
}) {
  return (
    <>
      {fontFiles.map(function ({
        format, uri,
      }) {
        return (
          <Global
            key={uri}
            styles={css`
                @font-face {
                  font-family: ${fontFamily};
                  src: url(${uri}) format(${format});
                }
              `}
          />
        );
      })}
    </>
  );
}

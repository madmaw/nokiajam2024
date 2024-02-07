import styled from '@emotion/styled';
import { pxPerNpx } from 'base/metrics';
import {
  type SyntheticEvent,
  useCallback,
  useState,
} from 'react';

export type IconProps = {
  readonly src: string,
  readonly invert?: boolean,
  readonly dimensions?: readonly [number, number],
};

const IconImage = styled.img<{ invert: boolean }>`
  image-rendering: pixelated;
  filter: ${({ invert }) => invert ? 'invert(1)' : 'none'};
`;

export function Icon({
  src,
  invert,
  dimensions,
}: IconProps) {
  const [
    usedDimensions,
    setUsedDimensions,
  ] = useState<readonly [number, number] | undefined>(dimensions);
  const onLoad = useCallback(function (e: SyntheticEvent<HTMLImageElement>) {
    if (usedDimensions == null) {
      setUsedDimensions([
        e.currentTarget.naturalWidth * pxPerNpx,
        e.currentTarget.naturalHeight * pxPerNpx,
      ]);
    }
  }, [usedDimensions]);
  const [
    width,
    height,
  ] = usedDimensions ?? [
    undefined,
    undefined,
  ];
  return (
    <IconImage
      src={src}
      width={width}
      height={height}
      onLoad={onLoad}
      invert={!!invert}
    />
  );
}

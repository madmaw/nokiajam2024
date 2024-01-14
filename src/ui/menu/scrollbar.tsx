import styled from '@emotion/styled';
import { pxPerNpx } from 'base/metrics';
import {
  useEffect,
  useRef,
} from 'react';

const FillingCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

type ScrollbarProps = {
  scrollOffset: number,
  containerDimension: number,
  contentDimension: number,
};

export function VerticalScrollbar({

  containerDimension,
  contentDimension,
  scrollOffset,
}: ScrollbarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }

    const y = Math.round(canvas.height / pxPerNpx * scrollOffset / contentDimension) * pxPerNpx;
    const h = Math.round(canvas.height / pxPerNpx * containerDimension / contentDimension) * pxPerNpx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (y > 0) {
      ctx.fillRect(0, 0, pxPerNpx, y);
    }
    if (h > 0) {
      ctx.fillRect(0, y, canvas.width, pxPerNpx);
      ctx.fillRect(0, y + h - pxPerNpx, canvas.width, pxPerNpx);
    }
    ctx.fillRect(canvas.width - pxPerNpx, y, pxPerNpx, h);
    ctx.fillRect(0, y + h, pxPerNpx, canvas.height - y - h);

  }, [
    containerDimension,
    contentDimension,
    scrollOffset,
  ]);

  return (
    <FillingCanvas ref={canvasRef}/>
  );
}

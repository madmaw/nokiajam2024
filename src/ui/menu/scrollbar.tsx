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
  itemOffset: number,
  itemDimension: number,
  containerDimension: number,
  contentDimension: number,
};

export function VerticalScrollbar({
  itemOffset,
  itemDimension,
  containerDimension,
  contentDimension,
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (contentDimension > containerDimension) {
      const y = Math.round(canvas.height / pxPerNpx * itemOffset / contentDimension) * pxPerNpx;
      const h = Math.round(canvas.height / pxPerNpx * itemDimension / contentDimension) * pxPerNpx;

      if (y > 0) {
        ctx.fillRect(0, 0, pxPerNpx, y);
      }
      if (h > 0) {
        ctx.fillRect(0, y, canvas.width - pxPerNpx, pxPerNpx);
        ctx.fillRect(0, y + h - pxPerNpx, canvas.width - pxPerNpx, pxPerNpx);
        ctx.fillRect(canvas.width - pxPerNpx, y + pxPerNpx, pxPerNpx, h - 2 * pxPerNpx);
      }
      ctx.fillRect(0, y + h, pxPerNpx, canvas.height - y - h);
    }

  }, [
    itemOffset,
    itemDimension,
    contentDimension,
    containerDimension,
  ]);

  return (
    <FillingCanvas ref={canvasRef}/>
  );
}

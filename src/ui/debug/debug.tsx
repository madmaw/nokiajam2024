import styled from '@emotion/styled';
import { type Text } from 'app/ui/typography/types';

export type DebugProps = {
  updating: boolean,
  framesPerSecond: number,
  updatesPerSecond: number,
  Text: Text,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none;
`;

export function Debug({
  updating,
  framesPerSecond,
  updatesPerSecond,
  Text,
}: DebugProps) {
  return (
    <Container>
      {updating && (
        <>
          <Text>
        FPS:
            {' '}
            {framesPerSecond}
          </Text>
          <Text>
        UPS:
            {' '}
            {updatesPerSecond}
          </Text>
        </>
      )}
    </Container>
  );
}

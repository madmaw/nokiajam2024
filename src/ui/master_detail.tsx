import styled from '@emotion/styled';
import {
  type ComponentType,
  type PropsWithChildren,
} from 'react';

export type MasterDetailProps = PropsWithChildren<{
  Heading: ComponentType | undefined,
}>;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 0;
  height: 100%;
`;

const MasterContainer = styled.div`
  flex: 0;
`;

const DetailContainer = styled.div`
  flex: 1;
`;

export function MasterDetail({
  Heading,
  children,
}: MasterDetailProps) {
  return (
    <Container>
      {Heading && (
        <MasterContainer>
          <Heading />
        </MasterContainer>
      )}
      <DetailContainer>
        {children}
      </DetailContainer>
    </Container>
  );
}

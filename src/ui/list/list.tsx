import styled from '@emotion/styled';
import {
  type ComponentType,
  type Key,
} from 'react';

export type ListProps<T> = {
  Item: ComponentType<{ item: T }>,
  items: readonly T[],
  keyFactory: (item: T) => Key,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export function List<T>(props: ListProps<T>) {
  const {
    Item,
    items,
    keyFactory,
  } = props;
  return (
    <Container>
      {items.map(function (item) {
        return (
          <Item
            key={keyFactory(item)}
            item={item}
          />
        );
      })}
    </Container>
  );
}

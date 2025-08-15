import styled from 'styled-components';

interface Props {
  className?: string;
  $color?: string;
  $marginRight?: string;
  $fontSize?: string;
  $marginBottom?: string;
}

export const Icon = styled.i<{
  $marginRight?: string;
  $fontSize?: string;
  color?: string;
  $marginBottom?: string;
}>`
  margin-right: ${({ $marginRight }) => $marginRight ?? '0px'};
  margin-bottom: ${({ $marginBottom }) => $marginBottom ?? '0px'};
  font-size: ${({ $fontSize }) => $fontSize ?? '24px'};
  color: ${({ color }) => color ?? '#00FF9D'};
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
`;

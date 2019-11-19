import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
export const Group = styled.div`
  width: 250px;
  padding: 20px;
`;

export const ButtonList = styled.ul`
  padding-left: 0;
  list-style: none;
`;

export const MVSidebar = styled.div`
  height: 3000px;
  padding: 32px;

  h2 {
    color: white;
    margin-bottom: 16px;
  }

  tbody {
    border-bottom: none;
    vertical-align: top;
  }
`;

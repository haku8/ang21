import { gql } from 'apollo-angular';

export const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      text1
      text2
      createdAt
      updatedAt
    }
  }
`;

export const GET_ITEM = gql`
  query GetItem($id: ID!) {
    item(id: $id) {
      id
      name
      text1
      text2
    }
  }
`;

export const CREATE_ITEM = gql`
  mutation CreateItem($name: String!, $text1: String, $text2: String) {
    createItem(name: $name, text1: $text1, text2: $text2) {
      id
      name
      text1
      text2
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $name: String, $text1: String, $text2: String) {
    updateItem(id: $id, name: $name, text1: $text1, text2: $text2) {
      id
      name
      text1
      text2
      updatedAt
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

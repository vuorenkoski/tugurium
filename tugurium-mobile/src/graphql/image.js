import { gql } from '@apollo/client'

export const ALL_IMAGES = gql`
  query AllImages {
    allImages {
      id
      name
      description
      updatedAt
    }
  }
`

export const DELETE_IMAGE = gql`
  mutation Mutation($deleteImageId: Int!) {
    deleteImage(id: $deleteImageId) {
      name
    }
  }
`

export const UPDATE_IMAGE = gql`
  mutation UpdateImage(
    $name: String!
    $description: String!
    $updateImageId: Int!
  ) {
    updateImage(name: $name, description: $description, id: $updateImageId) {
      id
      name
      description
    }
  }
`

export const NEW_IMAGE = gql`
  mutation NewImage($name: String!, $description: String!) {
    newImage(name: $name, description: $description) {
      id
      name
      description
    }
  }
`

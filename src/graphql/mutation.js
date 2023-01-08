import { gql } from "@apollo/client";

// ====== 3DP ======
export const CREATE_MACHINE_MUTATION = gql`
  mutation createMachine($input: CreateMachineInfo!) {
    createMachine(info: $input) {
      name
      type
      duration
    }
  }
`;

export const CLEAR_MACHINE_MUTATION = gql`
  mutation clearMachine {
    clearMachine
  }
`;

export const DELETE_MACHINE_MUTATION = gql`
  mutation deleteMachine($input: DeleteMachineInfo!) {
    deleteMachine(info: $input)
  }
`;

export const USER_RESERVE_MACHINE_MUTATION = gql`
  mutation userReserveMachine($input: ReserveMachineInfo!) {
    userReserveMachine(info: $input)
  }
`;

export const USER_CANCEL_MACHINE_MUTATION = gql`
  mutation userCancelMachine($input: Int!) {
    userCancelMachine(info: $input)
  }
`;

export const ADMIN_UPDATE_USER_MUTATION = gql`
  mutation adminUpdateUser($input: UpdateUserInfo!) {
    adminUpdateUser(info: $input)
  }
`;

export const ADMIN_UPDATE_MACHINE = gql`
  mutation adminUpdateMachine($input: UpdateMachineInfo!) {
    adminUpdateMachine(info: $input)
  }
`;

export const UPDATE_ALL_MUTATION = gql`
  mutation updateAll {
    updateAll
  }
`;

export const CLEAR_USER_MUTATION = gql`
  mutation clearUser {
    adminClearUser
  }
`;

// ====== LEICHIE INFO ======

export const CREATE_LEICHIE_MUTATION = gql`
  mutation createLaserCutter($info: CreateLaserInfo!) {
    createLaserCutter(info: $info) {
      id
      status
      duration
      user
      completeTime
    }
  }
`;

export const UPDATE_LEICHIE_MUTATION = gql`
  mutation updateLaserCutter($info: UpdateLaserInfo!) {
    updateLaserCutter(info: $info) {
      id
      status
      duration
      user
      completeTime
    }
  }
`;

export const DEL_LEICHIE_MUTATION = gql`
  mutation deleteLaserCutter($id: ID!) {
    deleteLaserCutter(id: $id)
  }
`;

// ====== LEICHIE RESERVATION ======

export const CREATE_LEICHIE_RESERVE = gql`
  mutation createLaserReserve($info: ReserveLaserCutter!) {
    createLaserReserve(info: $info) {
      teamId
      material
      thickness
      reserveStatus
      updated_at
    }
  }
`;

export const CANCEL_LEICHIE_RESERVE = gql`
  mutation cancelLaserReserve($teamId: ID!) {
    cancelLaserReserve(teamId: $teamId) {
      teamId
      material
      thickness
      reserveStatus
      updated_at
    }
  }
`;

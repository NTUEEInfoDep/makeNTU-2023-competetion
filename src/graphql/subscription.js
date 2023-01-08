import { gql } from "@apollo/client";

export const MACHINE_UPDATE_SUBSCRIPTION = gql`
  subscription machineUpdate {
    machineUpdated {
      id
      name
      type
      status
      duration
      user
      completeTime
    }
  }
`;

export const USER_UPDATE_SUBSCRIPTION = gql`
  subscription userUpdate {
    userUpdated {
      teamId
      status
    }
  }
`;

export const LASERCUTTER_UPDATE_SUBSCRIPTION = gql`
  subscription LaserCutterInfo {
    LaserCutterInfo {
      id
      status
      duration
      user
      completeTime
    }
  }
`;

export const LASERCUTTER_RESERVE_SUBSCRIPTION = gql`
  subscription LaserCutterReservation {
    LaserCutterReservation {
      teamId
      material
      thickness
      reserveStatus
      updated_at
    }
  }
`;

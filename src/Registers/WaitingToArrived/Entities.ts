export interface IRefuseRequest {
  requestWaitingId: string;
  servantUserId: string;
  requestUserId: string;
  requestRegistrationId: string;
}

export interface IRequestWaiting {
  requestRegistrationId: string;
  requestConfirmId: string;
}

export interface IRenewRequestWaiting {
  requestConfirmId: string;
  requestWaitingId: string;
  userId: string;
  actionDate: string;
}

export interface IArrived {
  requestWaitingId: string;
  requestRegistrationId: string;
}

export interface IRefuseArrive {
  requestWaitingId: string;
  arriveRefuseUserId: string;
}

export interface IWorkDate {
  requestWaitingId: string;
  requestConfirmId: string;
}

export interface IUpdateLocation {
  requestRegistrationId: string;
  region: string[] | null;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    date: string;
  } | null;
  locationName: string;
}

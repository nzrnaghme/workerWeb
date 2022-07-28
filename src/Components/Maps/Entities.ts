export interface ILocation {
  latitude: number;
  longitude: number;
  name: string;
  date: string;
  selectRegion?: IRegion;
}

export interface IRegion {
  state: string;
  city: string;
  region: string; 
}

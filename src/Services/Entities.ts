
export interface IResult {
    Error: IErrorMessage | null;
    Data: any | null;
    Status: number | null;
  }

  export interface IErrorMessage {
    Status: number | null;
    Message: string | null;
  }
 

    
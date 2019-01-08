export class Response {
  private _status: string;
  private _message: string;

  constructor(status: string, message: string) {
    this._status = status;
    this._message = message;
  }


  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }
}

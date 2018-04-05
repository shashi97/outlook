export class Activity {
  title:string = "";
  data: Array<Data> = [];
}

export class Data {
  id:string = '';
  type:string = '';
  title:string = '';
  data:string  = '';
  status:string = '';
  time:string = '';
  subject:string = '';
  message:string = '';
}
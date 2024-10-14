export interface ILogin{
    userName : string,
    password : string
}



  
  export interface HID {
    requestDevice(options: HIDDeviceRequestOptions): Promise<HIDDevice[]>;
  }
  
 
  
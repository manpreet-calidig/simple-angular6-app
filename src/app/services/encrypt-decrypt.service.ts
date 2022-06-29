import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  public encryptInfo: any;
  public decryptedInfo: any;

  constructor() { }

  public encryptionHandler(data:any) {
    //Encrypt Info
    this.encryptInfo = encodeURIComponent(
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        'secret key 123'
      ).toString()
    );
    localStorage.setItem('permissions', this.encryptInfo);
  }

  //Decrypt Info
  public decryptionHandler(data: any) {
    var deData = CryptoJS.AES.decrypt(
      decodeURIComponent(data),
      'secret key 123'
    );
    this.decryptedInfo = JSON.parse(deData.toString(CryptoJS.enc.Utf8));
    return this.decryptedInfo;
  }

  public getPermissions() {
    return localStorage.getItem('permissions');
  }
}

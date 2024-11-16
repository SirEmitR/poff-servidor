import {database} from "../connections/firebase.js";
import { collection, addDoc } from 'firebase/firestore';
import emailsTemplates from '../constants/emails.js'

const emailCollName = 'tblMail';
const emailColl = collection(database, emailCollName);

export class EmailType {
  constructor(email,data){
    this.email = email;
    this.data = data; 
  }

  recoveryPassword(){
    this.type = 'recoveryPassword';
    return {
      subject: 'Recuperación de contraseña',
      html: this.getHtml('recoveryPassword'),
      email: this.email
    }
  }

  getHtml(){
    switch(this.type){
      case 'recoveryPassword':
        const html = emailsTemplates.recoveryPassword;
        return html.replace('%codigo%', this.data.code);
      default:
        return '';
    }
  }
}

export default async function sendEmail(email) {
  try{
    await addDoc(emailColl, {
      to: email.email,
      message: {
        subject: email.subject,
        html: email.html    
      }
    })
  }catch(err){
    console.error(err);
  }
}
import { Contacto } from './../../../models/contacto';
import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})

export class ContactListComponent implements OnInit {

  contactos: any;    // array de contactos
  remoteContacts = [];
  favs = [];
  myContacts = [];
  selectedContact: Contacto = new Contacto();
  selectedContactBoss: Contacto = new Contacto();
  searchText: string = "";


  constructor(private apiService: ApiService) {
   }

  ngOnInit(): void {
    this.showContacts("mancevich");
    this.myContacts = this.contactos;
  }

  showContacts (searchText: string): void {
    this.apiService.getContacts(searchText).subscribe( data => {
      this.contactos = data.Agentes});

      this.remoteContacts = this.contactos;

      // console.log('--- showContacts ---');
      // console.log(this.remoteContacts);

    }

  showContactInfo (contact: Contacto): void {

    console.log('--- showContactInfo: ' + contact.cuil.toString() + ' ---');

    this.selectedContact = contact;
    this.selectedContactBoss = new Contacto();

    this.apiService.getContact(contact.cuil.toString()).subscribe( data => {
        this.selectedContact = data});

    console.log(this.selectedContact);

  }

  inputSearchChanged (): void {

    // console.log(event.target.value);

    if (this.searchText.trim() == '') {
        this.remoteContacts = this.myContacts;
    } else {
      this.showContacts(this.searchText);
    }
};

// trackByContact: (index: number, contact: Contacto): number => contact.cuil;


lastName (contacto: Contacto) {
  // console.log('--- lastName ---' || contacto.nombre);
  if (contacto == undefined || contacto.nombre == undefined) return '';
  var i = contacto.nombre.indexOf(',');
  if (i < 0) return contacto.nombre;
  return contacto.nombre.substring(0, i);
};

firstName (contacto: Contacto) {
  if (contacto == undefined || contacto.nombre == undefined) return '';
  var i = contacto.nombre.indexOf(',');
  if (i < 0) return '';
  return contacto.nombre.substring(i + 1);
};

funcion (contacto: Contacto) {
  if (contacto.funcion == undefined || contacto.funcion == undefined) return '';
  return contacto.funcion;
};

formatArea (contacto: Contacto) {
  if (contacto == undefined || contacto.area == undefined) return '';
  if (contacto.area.descripcion == undefined) return '';
  var s = this.capitalize(contacto.area.descripcion);
  var i = s.indexOf('(');
  var j = s.indexOf(')', i);
  while (i >= 0 && j >= 0) {
      s = s.substring(0, i) + s.substring(i, j).toUpperCase() + s.substring(j);
      j = j + 1;
      i = s.indexOf('(', j);
      if (i >= 0) {
          j = s.indexOf(')', i);
      }
  }
  return s.replace("-->", "»");
};

formatCodArea (contacto: Contacto) {
  if (contacto == undefined || contacto.area == undefined) return '';
  if (contacto.area.codigo == undefined) return '';
  return contacto.area.codigo;
};

phoneFor (contacto: Contacto) {
  if (contacto == undefined) return 'No existe un interno registrado para este Agente';
  if (contacto.Telefonos == undefined) return 'No existe un interno registrado para este Agente';
  if (contacto.Telefonos.length == 0) return 'No existe un interno registrado para este Agente';

  var rpv = '';
  var tel = '';
  for (var i = 0; i < contacto.Telefonos.length; i++) {
      var t = contacto.Telefonos[i];
      if (rpv.length == 0 && t.RPV != undefined && t.RPV.length > 2) {
          rpv = 'RPV: ' + t.RPV;
      }
      if (tel.length == 0 && t.Línea != undefined && t.Línea.length > 2) {
          tel = 'Tel.: ' + t.Línea;
      }
  }
  if (rpv.length > 0) return rpv;
  if (tel.length > 0) return tel;
  return 'No existe un interno registrado para este Agente';
};

phoneType (phone: any) {
  if (phone == undefined) return '';

  for (var property in phone) {
      if (property.startsWith('$')) continue;
      if ("Línea" == property) {
          return "Línea";
      } else if ("WIN" == property || "Disp. WIN" == property) {
          return "Móvil";
      }
  }
  return 'Telefono';
};

phoneNumber (phone: any) {

  if (phone == undefined) return '';

  var primario = '';
  var secundario = '';

  for (var property in phone) {
      if (property.startsWith('$')) continue;
      if ("Línea" == property || "Disp. WIN" == property) {
          if (phone[property] == undefined) continue;
          if (phone[property].length <= 3) continue;
          primario = phone[property];
      } else if ("WIN" == property || "RPV") {
          if (phone[property] == undefined) continue;
          if (phone[property].length <= 3) continue;
          secundario = phone[property];
      }
  }

  if (primario.length == 0 && secundario.length == 0) return '';
  if (secundario.length == 0) return primario;
  if (primario.length == 0) {
      if (secundario.indexOf('#') >= 0) {
          return 'WIN: ' + secundario;
      }
      return 'Int.: ' + secundario;
  }
  if (secundario.indexOf('#') >= 0) {
      return primario + ' (' + secundario + ')';
  }
  return primario + ' (Int.: ' + secundario + ')';
};

capitalize (str: string) {
  return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};


}

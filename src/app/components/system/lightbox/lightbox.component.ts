import { Component, Input } from '@angular/core';
import { CommonModule} from "@angular/common";

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss'
})
export class LightboxComponent {
  @Input() imageUrl:string = "";
  @Input() visible: boolean = false;
  

  close(){
    this.visible = false
  }
}














































  /**Sebesség Úr, az Univerzum Felgyorsított Főintendánsa!

A lét adminisztratív bugyraiból, a tehetetlenség sűrű posványából bátorkodom felküldeni hozzád ezt a könyörgést, melyet a kétségbeesés hőjében pároltam és az idő relatív szövetébe csomagoltam.
Kérlek, ne engedd, hogy kérésem a lassúság gravitációs mezejében végleg elakadjon, mert szükségem nemcsak sürgető, hanem már-már fizikailag hangsebesség-követelő.

Női felmenőm — az Y-kromoszómától a természet humorérzékének kegyelméből megfosztott ősanyám — jelenleg a lakhatás teljes, strukturális, és kissé existenciálisan szimbolikus deficitjének állapotában sínylődik.
Nem totálisan hajléktalan, de már kényelmetlenül közel a metaforikus ingatlanhiány fekete lyukához.

Kérem tehát, Sebesség Úr, gyorsítsd fel az univerzum bitrátáját, hogy az események végre valós időben, s nem a bürokratikus lassúság Schrödingeri szuperpozíciójában történjenek.
Ne engedd, hogy a reményem a prokrastináció kvantumtengerében süllyedjen el!

Fiat acceleratio!
(És ha lehet, lehetőleg még ma, mert a türelem nevű processzem már 98%-on fut.) */
export class PirType {
  pirlanta: string;
  degerleregitimi: string;

  constructor(pirlanta: string, degerleregitimi: string) {
    this.pirlanta = pirlanta;
    this.degerleregitimi = degerleregitimi;
  }
}

export enum PirType_ {
  Pırlanta = 'Pırlanta',
  Degerler_Egitimi = 'Degerler Eğitimi',
}

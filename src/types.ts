export interface ProtocolPosition {
  /** Benzersiz mevki anahtarı */
  id: string;
  /** Ekranda gösterilen mevki/unvan adı */
  title: string;
  /**
   * Devlet protokol önem derecesi. Sayı küçüldükçe kişi daha önemlidir
   * (1 = en önemli). Bu değer otomatik sıralamada kullanılır.
   */
  rank: number;
}

export interface Person {
  id: string;
  /** Kişinin adı soyadı */
  name: string;
  /** Atanan mevkinin anahtarı (ProtocolPosition.id) */
  positionId: string;
  /** tavsanli.gov.tr protokol listesinden gelen tam unvan (varsa) */
  titleLabel?: string;
}

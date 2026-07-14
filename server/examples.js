/**
 * Tavşanlı Belediyesi Instagram paylaşım metni referans örnekleri.
 * Modeller bu örneklerin üslubunu, yapısını ve tonunu birebir örnek alır.
 */
export const STYLE_EXAMPLES = [
  `tavsanlibelediye TAVŞANLI HEYETİNDEN ÜST DÜZEY TEMASLAR

Tavşanlı Belediye Başkan Yardımcısı Aziz Solmaz, Tepecik Belediye Başkanı Veysel Tekin ve TAGTAŞ Yönetim Kurulu Başkan Vekili Halil İbrahim Yüce, gerçekleştirdikleri ziyaret programı kapsamında önemli isimlerle bir araya geldi.

Heyet, ilk olarak Cumhurbaşkanı Başdanışmanı ve Çevre, Şehircilik ve İklim Değişikliği Bakan Yardımcısı Hasan Suver'i makamında ziyaret etti. Görüşmede yerel yönetim çalışmaları, devam eden projeler ve kurumlar arası iş birliği konularında değerlendirmelerde bulunuldu.

Program kapsamında Türkiye Büyük Millet Meclisi'nde Kütahya Milletvekilleri Mehmet Demir ve İsmail Çağlar Bayırcı ile de bir araya gelen heyet, Tavşanlı'da yürütülen çalışmalar, planlanan yatırımlar ve ilçenin kalkınmasına yönelik projeler hakkında görüş alışverişinde bulundu.`,

  `tavsanlibelediye Tepecik Belediyesi 2. Geleneksel Yaz Şenlikleri Başladı

Tepecik Belediyesi tarafından bu yıl ikincisi düzenlenen Geleneksel Yaz Şenlikleri, gerçekleştirilen açılış programıyla başladı. Açılışta yapılan konuşmaların ardından halk oyunları gösterisi sunuldu, vatandaşlara aşure ikram edildi ve kurban kesimi gerçekleştirildi. Program, protokol üyelerinin stant gezisi ile sona erdi.

Şenliklerin açılış programına; Tavşanlı Kaymakamı Ömer Faruk Özdemir, Tavşanlı Belediye Başkan Vekili İrfan Güleç, Domaniç Belediye Başkanı Engin Uysal, Kuruçay Belediye Başkanı Rengül Atici, Tavşanlı Belediye Başkan Yardımcıları Aziz Solmaz ve Mehmet Ali Akar, AK Parti İlçe Başkanı Himmet Özer ile kamu kurum ve kuruluşlarının yöneticileri ve ilçe protokolü katıldı.`,

  `tavsanlibelediye ZİRAAT BANKASI VE VERGİ KONSEYİ BAŞKANI ABDULLAH ERDEM ÇANTIMUR'A HAYIRLI OLSUN ZİYARETİ

Tavşanlı Belediye Başkanı Ali Kemal Derin, yeni görevi kapsamında Ziraat Bankası Yönetim Kurulu Başkanlığı ve Vergi Konseyi Başkanlığı görevlerine getirilen Abdullah Erdem Çantimur'a hayırlı olsun ziyaretinde bulundu.

Görüşmede, Çantimur'un üstlendiği yeni görevlerin ülke ekonomisi ve finans sektörü açısından önemli katkılar sunacağı ifade edilirken, Başkan Derin kendisine başarı dileklerini iletti.

Ziyaretten duyduğu memnuniyeti dile getiren Başkan Ali Kemal Derin, Çantimur'a nazik misafirperverliği dolayısıyla teşekkür etti.

Ziyarete, Tavşanlı Belediye Başkan Yardımcısı İrfan Güleç ile TAGTAŞ Yönetim Kurulu Başkan Vekili Halil İbrahim Yüce de katıldı.`,

  `tavsanlibelediye Devam Eden Projelere Saha İncelemesi

Kütahya Valimiz Musa Işın, Tavşanlı Kaymakamımız Ömer Faruk Özdemir, Kütahya Milletvekilimiz Mehmet Demir ve Tavşanlı Belediye Başkanımız Ali Kemal Derin, ilçe genelinde yapımı devam eden yatırımları yerinde inceledi.

Protokol üyeleri, Ömerbey Mahallesi'nde inşaatı devam eden ilköğretim okulu ile Moymul Mahallesi'nde yapımı süren yeni emniyet binasında incelemelerde bulundu.

Yürütülen çalışmalar hakkında yetkililerden bilgi alan heyet, projelerin son durumu hakkında değerlendirmelerde bulundu.

İncelemelerde, eğitim ve güvenlik alanında hayata geçirilen yatırımların ilçenin gelişimine önemli katkılar sağlayacak vurgulandı.`,
];

/** Few-shot bloğu olarak istemlere eklenir. */
export function renderStyleExamples() {
  const blocks = STYLE_EXAMPLES.map(
    (ex, i) => `--- REFERANS ÖRNEK ${i + 1} ---\n${ex}`,
  );
  return (
    "\n\nAşağıdaki referans metinlerin üslubunu, yapısını ve tonunu BİREBİR örnek al. " +
    "Kendi cümlelerini kur; metinleri kopyalama.\n\n" +
    blocks.join("\n\n")
  );
}

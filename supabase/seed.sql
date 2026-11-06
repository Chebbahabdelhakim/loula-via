-- LOULA VIA — produits de démonstration
-- À exécuter une seule fois, après supabase/schema.sql.
-- Les photos sont vides : elles s'ajoutent depuis le panel admin.
-- Relancer ce fichier crée des doublons.

insert into public.products (
  name_fr,
  name_ar,
  price,
  description_fr,
  description_ar,
  image_url,
  active
) values
  (
    'Sac cabas Éclat',
    'حقيبة كابا إيكلات',
    8900,
    'Cabas souple, porté à l''épaule ou à la main. Intérieur doublé, poche zippée.',
    'حقيبة كتف ناعمة، تُحمل على الكتف أو باليد. بطانة داخلية وجيب بسحاب.',
    null,
    true
  ),
  (
    'Pochette soirée Nour',
    'محفظة سهرة نور',
    6500,
    'Pochette de soirée à chaîne dorée, format compact.',
    'محفظة سهرة بسلسلة ذهبية، مقاس صغير.',
    null,
    true
  ),
  (
    'Sac bandoulière Lina',
    'حقيبة كتف لينا',
    7200,
    'Bandoulière réglable, fermeture aimantée, idéale au quotidien.',
    'حزام كتف قابل للتعديل وإغلاق مغناطيسي، مناسبة لكل يوم.',
    null,
    true
  ),
  (
    'Portefeuille Ambre',
    'محفظة عنبر',
    4500,
    'Portefeuille compact, plusieurs emplacements cartes.',
    'محفظة صغيرة بعدة أماكن للبطاقات.',
    null,
    true
  );

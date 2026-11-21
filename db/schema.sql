-- Esquema de Sculptures para Neon Postgres + Data API.
-- Ejecuta este archivo completo en el SQL Editor de Neon.
-- Es idempotente: se puede repetir sin duplicar la tabla ni los datos.

CREATE TABLE IF NOT EXISTS public.sculptures (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  artist text NOT NULL,
  description text NOT NULL DEFAULT '',
  year integer,
  location text,
  url text NOT NULL,
  alt text NOT NULL DEFAULT '',
  material text,
  dimensions text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Compatibilidad con la tabla mínima de la guía (sin material ni medidas).
ALTER TABLE public.sculptures ADD COLUMN IF NOT EXISTS material text;
ALTER TABLE public.sculptures ADD COLUMN IF NOT EXISTS dimensions text;
ALTER TABLE public.sculptures
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.sculptures
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
-- La ficha admite obras sin fecha documentada, por eso year es opcional.
ALTER TABLE public.sculptures ALTER COLUMN year DROP NOT NULL;
ALTER TABLE public.sculptures ALTER COLUMN description SET DEFAULT '';
ALTER TABLE public.sculptures ALTER COLUMN alt SET DEFAULT '';

-- El rol anonymous lo crea Neon Auth al habilitar el acceso anónimo.
GRANT USAGE ON SCHEMA public TO anonymous;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sculptures TO anonymous;
GRANT USAGE, SELECT ON SEQUENCE public.sculptures_id_seq TO anonymous;

-- RLS: el catálogo es público y editable por el rol anónimo.
-- Para un despliegue real, restringe INSERT/UPDATE/DELETE al rol authenticated.
ALTER TABLE public.sculptures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon read sculptures" ON public.sculptures;
CREATE POLICY "anon read sculptures" ON public.sculptures
  FOR SELECT TO anonymous USING (true);

DROP POLICY IF EXISTS "anon insert sculptures" ON public.sculptures;
CREATE POLICY "anon insert sculptures" ON public.sculptures
  FOR INSERT TO anonymous WITH CHECK (true);

DROP POLICY IF EXISTS "anon update sculptures" ON public.sculptures;
CREATE POLICY "anon update sculptures" ON public.sculptures
  FOR UPDATE TO anonymous USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon delete sculptures" ON public.sculptures;
CREATE POLICY "anon delete sculptures" ON public.sculptures
  FOR DELETE TO anonymous USING (true);

-- Datos iniciales. Solo se insertan si la tabla está vacía.
INSERT INTO public.sculptures
  (name, artist, description, year, location, url, alt, material, dimensions)
SELECT * FROM (VALUES
  ('Homenaje a la Neurocirugía', 'Marta Colvin Andrade', 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.', 2023, 'Oxford Street, 32, London', 'https://i.imgur.com/Mx7dA2Y.jpg', 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.', 'Bronze, unique cast', '420 × 310 × 280 cm'),
  ('Floralis Genérica', 'Eduardo Catalano', 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.', 2023, NULL, 'https://i.imgur.com/ZF6s192m.jpg', 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.', 'Stainless steel and aluminium', '2,300 × 3,200 × 3,200 cm'),
  ('Eternal Presence', 'John Woodrow Wilson', 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."', 2025, NULL, 'https://i.imgur.com/aTtVpES.jpg', 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.', 'Bronze', '213 × 120 × 110 cm'),
  ('Moai', 'Unknown Artist', 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.', 2025, NULL, 'https://i.imgur.com/RCwLEoQm.jpg', 'Three monumental stone busts with the heads that are disproportionately large with somber faces.', 'Basalt', '420 × 160 × 180 cm'),
  ('Blue Nana', 'Niki de Saint Phalle', 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.', 2024, NULL, 'https://i.imgur.com/Sd1AgUOm.jpg', 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.', 'Polyester, mosaic and paint', '450 × 220 × 180 cm'),
  ('Ultimate Form', 'Barbara Hepworth', 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.', 2023, NULL, 'https://i.imgur.com/2heNQDcm.jpg', 'A tall sculpture made of three elements stacked on each other reminding of a human figure.', 'Bronze', '290 × 110 × 90 cm'),
  ('Cavaliere', 'Lamidi Olonade Fakeye', 'Descended from four generations of woodcarvers, Fakeye''s work blended traditional and contemporary Yoruba themes.', 2025, NULL, 'https://i.imgur.com/wIdGuZwm.png', 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.', 'Carved iroko wood', '185 × 70 × 55 cm'),
  ('Big Bellies', 'Alina Szapocznikow', 'Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.', 2025, NULL, 'https://i.imgur.com/AlHTAdDm.jpg', 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.', 'Polyester and pigment', '300 × 150 × 120 cm'),
  ('Terracotta Army', 'Unknown Artist', 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.', 2025, NULL, 'https://i.imgur.com/HMFmH6m.jpg', '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.', 'Terracotta', '180 × 70 × 60 cm (each figure)'),
  ('Lunar Landscape', 'Louise Nevelson', 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.', 2024, NULL, 'https://i.imgur.com/rN7hY6om.jpg', 'A black matte sculpture where the individual elements are initially indistinguishable.', 'Painted wood assemblage', '240 × 180 × 50 cm'),
  ('Aureole', 'Ranjani Shettar', 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."', 2024, NULL, 'https://i.imgur.com/okTpbHhm.jpg', 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.', 'Wood, wire and wax', '320 × 400 × 250 cm'),
  ('Hippos', 'Taipei Zoo', 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.', 2024, NULL, 'https://i.imgur.com/6o5Vuyu.jpg', 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.', 'Bronze', '140 × 80 × 60 cm (each)')
) AS seed(name, artist, description, year, location, url, alt, material, dimensions)
WHERE NOT EXISTS (SELECT 1 FROM public.sculptures);

-- Refresca la caché de esquema de PostgREST para que el Data API vea la tabla.
NOTIFY pgrst, 'reload schema';

-- Massa de dados de desenvolvimento do Astromaniaka.
-- Roda automaticamente na primeira subida do container (volume vazio).
-- Senha de todos os usuários: 123456

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===================== USERS =====================
INSERT INTO "User" ("id", "name", "email", "description", "password", "picture", "access_level", "createdAt") VALUES
  ('11111111-0000-0000-0000-000000000001', 'Admin Astro',     'admin@astromaniaka.com', 'Administrador da plataforma.',                      crypt('123456', gen_salt('bf', 10)), NULL, 'ADMIN', NOW() - INTERVAL '60 days'),
  ('11111111-0000-0000-0000-000000000002', 'Karoline Rezende', 'karol@astromaniaka.com', 'Apaixonada por nebulosas e café.',                 crypt('123456', gen_salt('bf', 10)), NULL, 'USER',  NOW() - INTERVAL '45 days'),
  ('11111111-0000-0000-0000-000000000003', 'Lucas Andrade',    'lucas@astromaniaka.com', 'Astrofotógrafo amador, telescópio Dobsoniano 8".', crypt('123456', gen_salt('bf', 10)), NULL, 'USER',  NOW() - INTERVAL '40 days'),
  ('11111111-0000-0000-0000-000000000004', 'Marina Costa',     'marina@astromaniaka.com','Estudante de física, curiosa sobre buracos negros.',crypt('123456', gen_salt('bf', 10)), NULL, 'USER',  NOW() - INTERVAL '30 days'),
  ('11111111-0000-0000-0000-000000000005', 'Pedro Lima',       'pedro@astromaniaka.com', 'Caçador de meteoros nas madrugadas.',              crypt('123456', gen_salt('bf', 10)), NULL, 'USER',  NOW() - INTERVAL '20 days'),
  ('11111111-0000-0000-0000-000000000006', 'Julia Martins',    'julia@astromaniaka.com', 'Professora de ciências e divulgadora científica.',  crypt('123456', gen_salt('bf', 10)), NULL, 'USER',  NOW() - INTERVAL '10 days');

-- ===================== ASTRONOMERS =====================
INSERT INTO "Astronomer" ("id", "name", "picture", "description", "birthday") VALUES
  ('22222222-0000-0000-0000-000000000001', 'Galileu Galilei',   NULL, 'Pai da astronomia observacional; descobriu as luas galileanas de Júpiter.',          '1564-02-15'),
  ('22222222-0000-0000-0000-000000000002', 'Johannes Kepler',   NULL, 'Formulou as três leis do movimento planetário.',                                       '1571-12-27'),
  ('22222222-0000-0000-0000-000000000003', 'Nicolau Copérnico', NULL, 'Propôs o modelo heliocêntrico do Sistema Solar.',                                      '1473-02-19'),
  ('22222222-0000-0000-0000-000000000004', 'Edwin Hubble',      NULL, 'Demonstrou a existência de outras galáxias e a expansão do universo.',                 '1889-11-20'),
  ('22222222-0000-0000-0000-000000000005', 'Carl Sagan',        NULL, 'Astrônomo e divulgador científico, autor de "Cosmos".',                                '1934-11-09'),
  ('22222222-0000-0000-0000-000000000006', 'Vera Rubin',        NULL, 'Forneceu evidências observacionais da matéria escura.',                                '1928-07-23'),
  ('22222222-0000-0000-0000-000000000007', 'Henrietta Leavitt', NULL, 'Descobriu a relação período-luminosidade das estrelas Cefeidas.',                       '1868-07-04'),
  ('22222222-0000-0000-0000-000000000008', 'Stephen Hawking',   NULL, 'Físico teórico conhecido pelos estudos sobre buracos negros e a radiação Hawking.',    '1942-01-08');

-- ===================== USER x ASTRONOMERS =====================
INSERT INTO "User_astronomers" ("userId", "astronomerId") VALUES
  ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000005'),
  ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000006'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000004'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000008'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000006'),
  ('11111111-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000005'),
  ('11111111-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000007');

-- ===================== POSTS =====================
INSERT INTO "Post" ("id", "title", "description", "is_accepted", "picture", "post_type", "userId", "createdAt") VALUES
  ('33333333-0000-0000-0000-000000000001', 'James Webb revela novas galáxias primordiais', 'O telescópio identificou galáxias formadas apenas 300 milhões de anos após o Big Bang.', true,  NULL, 'NOTICIA',    '11111111-0000-0000-0000-000000000002', NOW() - INTERVAL '9 days'),
  ('33333333-0000-0000-0000-000000000002', 'Minha primeira foto de Saturno',              'Capturei os anéis de Saturno ontem à noite com o Dobsoniano. Céu limpo em SP!',         true,  NULL, 'FOTOGRAFIA', '11111111-0000-0000-0000-000000000003', NOW() - INTERVAL '8 days'),
  ('33333333-0000-0000-0000-000000000003', 'Você sabia?',                                 'Um dia em Vênus dura mais que um ano em Vênus: 243 dias terrestres contra 225.',         true,  NULL, 'CURIOSITY',  '11111111-0000-0000-0000-000000000004', NOW() - INTERVAL '7 days'),
  ('33333333-0000-0000-0000-000000000004', 'Chuva de meteoros Gemínidas',                 'Pico previsto para 13 e 14 de dezembro. Melhor horário: depois da meia-noite.',          true,  NULL, 'EVENTO',     '11111111-0000-0000-0000-000000000005', NOW() - INTERVAL '6 days'),
  ('33333333-0000-0000-0000-000000000005', 'Dicas para observar sem telescópio',          'Use um app de carta celeste, fuja da poluição luminosa e deixe os olhos adaptarem por 20 minutos.', true, NULL, 'DICAS', '11111111-0000-0000-0000-000000000006', NOW() - INTERVAL '5 days'),
  ('33333333-0000-0000-0000-000000000006', 'Qual telescópio para iniciante?',             'Estou pensando entre um refrator 70mm e um Dobsoniano 6". O que vocês recomendam?',      true,  NULL, 'PERGUNTA',   '11111111-0000-0000-0000-000000000002', NOW() - INTERVAL '4 days'),
  ('33333333-0000-0000-0000-000000000007', 'Clube de astronomia no bairro',              'Começamos encontros mensais no parque para observação coletiva. Todos são bem-vindos!', true,  NULL, 'POST',       '11111111-0000-0000-0000-000000000003', NOW() - INTERVAL '3 days'),
  ('33333333-0000-0000-0000-000000000008', 'Eclipse lunar total',                         'Próximo eclipse lunar total visível no Brasil — preparem as câmeras!',                    true,  NULL, 'EVENTO',     '11111111-0000-0000-0000-000000000004', NOW() - INTERVAL '2 days'),
  -- Posts pendentes de aprovação (aparecem na tela de admin)
  ('33333333-0000-0000-0000-000000000009', 'Nebulosa de Órion no quintal',               'Consegui fotografar M42 com uma DSLR e tripé, 30 exposições empilhadas.',               false, NULL, 'FOTOGRAFIA', '11111111-0000-0000-0000-000000000005', NOW() - INTERVAL '1 day'),
  ('33333333-0000-0000-0000-000000000010', 'Plutão deveria voltar a ser planeta?',        'Vamos debater: os critérios da IAU de 2006 ainda fazem sentido?',                        false, NULL, 'OUTRO',      '11111111-0000-0000-0000-000000000006', NOW() - INTERVAL '12 hours'),
  ('33333333-0000-0000-0000-000000000011', 'Starlink atrapalhando a astrofotografia',     'Cada vez mais rastros de satélites nas minhas fotos de longa exposição.',                false, NULL, 'NOTICIA',    '11111111-0000-0000-0000-000000000003', NOW() - INTERVAL '2 hours');

-- ===================== POST HISTORY =====================
INSERT INTO "PostHistory" ("id", "title", "description", "picture", "userId", "createdAt") VALUES
  ('44444444-0000-0000-0000-000000000001', 'Apollo 11 pousa na Lua',          'Em 20 de julho de 1969, Neil Armstrong e Buzz Aldrin se tornaram os primeiros humanos a pisar na Lua.', NULL, '11111111-0000-0000-0000-000000000001', NOW() - INTERVAL '50 days'),
  ('44444444-0000-0000-0000-000000000002', 'Lançamento do Sputnik 1',         'Em 4 de outubro de 1957, a URSS colocou em órbita o primeiro satélite artificial da história.',          NULL, '11111111-0000-0000-0000-000000000001', NOW() - INTERVAL '49 days'),
  ('44444444-0000-0000-0000-000000000003', 'Yuri Gagarin no espaço',          'Em 12 de abril de 1961, Gagarin se tornou o primeiro ser humano a orbitar a Terra.',                     NULL, '11111111-0000-0000-0000-000000000001', NOW() - INTERVAL '48 days'),
  ('44444444-0000-0000-0000-000000000004', 'Telescópio Hubble é lançado',     'Em 24 de abril de 1990, o Hubble foi levado ao espaço pelo ônibus espacial Discovery.',                  NULL, '11111111-0000-0000-0000-000000000001', NOW() - INTERVAL '47 days'),
  ('44444444-0000-0000-0000-000000000005', 'Primeira imagem de um buraco negro', 'Em 2019, o Event Horizon Telescope revelou a imagem do buraco negro supermassivo de M87.',             NULL, '11111111-0000-0000-0000-000000000001', NOW() - INTERVAL '46 days');

-- ===================== COMMENTS =====================
INSERT INTO "Comment" ("id", "description", "userId", "postId", "postHistoryId", "createdAt") VALUES
  ('55555555-0000-0000-0000-000000000001', 'Que incrível! O Webb não para de surpreender.',            '11111111-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000001', NULL, NOW() - INTERVAL '8 days 20 hours'),
  ('55555555-0000-0000-0000-000000000002', 'Será que vão achar galáxias ainda mais antigas?',         '11111111-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000001', NULL, NOW() - INTERVAL '8 days 10 hours'),
  ('55555555-0000-0000-0000-000000000003', 'Ficou linda! Qual ocular você usou?',                      '11111111-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '7 days 22 hours'),
  ('55555555-0000-0000-0000-000000000004', 'Uma de 10mm com barlow 2x.',                               '11111111-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '7 days 20 hours'),
  ('55555555-0000-0000-0000-000000000005', 'Não fazia ideia disso! Vênus é muito estranho.',           '11111111-0000-0000-0000-000000000006', '33333333-0000-0000-0000-000000000003', NULL, NOW() - INTERVAL '6 days 12 hours'),
  ('55555555-0000-0000-0000-000000000006', 'Vou acampar na serra pra ver!',                            '11111111-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000004', NULL, NOW() - INTERVAL '5 days 18 hours'),
  ('55555555-0000-0000-0000-000000000007', 'Dobsoniano 6" sem dúvida, melhor custo-benefício.',        '11111111-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000006', NULL, NOW() - INTERVAL '3 days 20 hours'),
  ('55555555-0000-0000-0000-000000000008', 'Concordo com o Lucas, abertura é tudo.',                   '11111111-0000-0000-0000-000000000005', '33333333-0000-0000-0000-000000000006', NULL, NOW() - INTERVAL '3 days 15 hours'),
  ('55555555-0000-0000-0000-000000000009', 'Qual parque? Quero participar!',                           '11111111-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000007', NULL, NOW() - INTERVAL '2 days 10 hours'),
  ('55555555-0000-0000-0000-000000000010', 'Já separei o tripé.',                                      '11111111-0000-0000-0000-000000000006', '33333333-0000-0000-0000-000000000008', NULL, NOW() - INTERVAL '1 day 5 hours');

-- ===================== POST RECUSADO (com motivo) =====================
INSERT INTO "Post" ("id", "title", "description", "is_accepted", "picture", "post_type", "userId", "rejection_reason", "rejectedAt", "createdAt") VALUES
  ('33333333-0000-0000-0000-000000000012', 'Vendo telescópio barato', 'Interessados chamem no privado.', false, NULL, 'OUTRO', '11111111-0000-0000-0000-000000000002', 'Anúncios de venda não são permitidos no feed. Que tal compartilhar uma dica de observação?', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '1 day 4 hours');

-- ===================== LIKES =====================
INSERT INTO "Like" ("userId", "postId", "createdAt") VALUES
  ('11111111-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000001', NOW() - INTERVAL '8 days'),
  ('11111111-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000001', NOW() - INTERVAL '8 days'),
  ('11111111-0000-0000-0000-000000000005', '33333333-0000-0000-0000-000000000001', NOW() - INTERVAL '7 days'),
  ('11111111-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000002', NOW() - INTERVAL '7 days'),
  ('11111111-0000-0000-0000-000000000006', '33333333-0000-0000-0000-000000000002', NOW() - INTERVAL '7 days'),
  ('11111111-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000003', NOW() - INTERVAL '6 days'),
  ('11111111-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000004', NOW() - INTERVAL '5 days'),
  ('11111111-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000005', NOW() - INTERVAL '4 days'),
  ('11111111-0000-0000-0000-000000000005', '33333333-0000-0000-0000-000000000005', NOW() - INTERVAL '4 days'),
  ('11111111-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000006', NOW() - INTERVAL '3 days'),
  ('11111111-0000-0000-0000-000000000006', '33333333-0000-0000-0000-000000000008', NOW() - INTERVAL '1 day');

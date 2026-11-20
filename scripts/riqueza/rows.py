# Escenas de «La riqueza de otros» (guion v2).
# R(frase con la que empieza, visual, descripción, rec=[recursos], txt=[(texto, 'sin'|'con' fondo, 'grande'|'mediano'|'chico')], mark)
# Recursos: ('video', qué es, palabras clave[, apodo]) · ('foto', …) · ('icono:NOMBRE', …) · '=archivo' o '=@apodo' para reutilizar uno ya pedido.
SIN, CON = 'sin', 'con'
G, M, C = 'grande', 'mediano', 'chico'

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 0 · Gancho: "El ladrillo de cuatro mil dólares"')
R('Ahora mismo tienes en la mano', 'VIDEO', 'Una mano saca un smartphone del bolsillo del pantalón. Toma cerrada, sin rostro.',
  [('video', 'Mano sacando un smartphone del bolsillo del pantalón, de cerca, sin rostro', 'hand taking smartphone out of pocket close up')], mark='⚡')
R('algo que hace cuarenta años solo podía tener', '2D', '«Tú» mira su celular con la boca abierta; arriba aparece tu ícono de sombrero de copa (millonario).',
  [('icono:sombrero_copa', 'Sombrero de copa con monóculo o bastón (símbolo de millonario)', 'top hat monocle rich icon flat')],
  [('SOLO MILLONARIOS', SIN, M)])
R('En 1983 salió a la venta el primer celular', 'FOTO', 'El celular «ladrillo» de los ochenta, solo, sobre fondo liso oscuro. Zoom lento.',
  [('foto', 'Celular antiguo tipo «ladrillo» de los años 80 con antena, sobre fondo liso (sin logo visible)', 'vintage 1980s brick mobile phone isolated', 'ladrillo')],
  [('1983', CON, C)], '⚡')
R('Pesaba casi un kilo', 'ÍCONOS', 'El ladrillo se pone en una báscula; la aguja se va hasta el fondo.',
  ['=@ladrillo', ('icono:bascula', 'Báscula de cocina o pesa', 'weight scale icon flat')], [('CASI 1 KG', SIN, M)])
R('La batería aguantaba media hora', 'ÍCONOS', 'Ícono de batería que se vacía rápido y se pone roja.',
  [('icono:bateria_baja', 'Batería casi vacía, en rojo', 'low battery icon flat red')], [('30 MIN', SIN, M)])
R('y tardaba diez horas en cargarse', '2D', '«Tú» espera junto al enchufe mirando un reloj… y se queda dormido.',
  [('icono:reloj', 'Reloj de pared o de alarma', 'clock icon flat')], [('10 HORAS', SIN, M)])
R('Y el precio', '2D', '«Tú» se acerca a la cámara, intrigado.', mark='🪝')
R('Casi cuatro mil dólares de aquella época', 'FOTO', 'El ladrillo otra vez, ahora con una etiqueta de precio colgando que se balancea.',
  ['=@ladrillo', ('icono:etiqueta_precio', 'Etiqueta de precio', 'price tag icon flat')], [('$3,995', CON, G)], '⚡')
R('más de diez mil de hoy', 'ÍCONOS', 'Un fajo de billetes que crece de tamaño.',
  [('icono:fajo', 'Fajo de billetes', 'stack of money bills icon flat')], [('+$10,000 DE HOY', SIN, M)])
R('Hoy por mucho menos tienes en la mano', 'VIDEO', 'Manos usando un smartphone moderno, deslizando la pantalla.',
  [('video', 'Manos usando un smartphone moderno (pantalla sin marcas), de cerca', 'hands scrolling smartphone close up', 'celular')])
R('una cámara un mapa un banco', 'ÍCONOS', 'Cinco íconos salen del celular uno por uno, al ritmo de la voz: cámara, mapa, banco, tele y libro.',
  [('icono:camara', 'Cámara de fotos', 'camera icon flat'), ('icono:mapa', 'Mapa con pin de ubicación', 'map pin icon flat'),
   ('icono:banco', 'Edificio de banco con columnas', 'bank building icon flat'), ('icono:tele', 'Televisión', 'television icon flat'),
   ('icono:libro', 'Libro abierto (enciclopedia)', 'open book icon flat')], mark='⚡')
R('Y no eres millonario', '2D', '«Tú» se encoge de hombros, sonriendo.')
R('O sea alguien se hizo muy muy rico', 'VIDEO', 'Billetes cayendo en cámara lenta sobre fondo oscuro.',
  [('video', 'Billetes (sin país reconocible) cayendo en cámara lenta sobre fondo oscuro, sin personas', 'money bills falling slow motion dark background', 'billetes')])
R('Y aun así tú saliste ganando', '2D', '«Tú» levanta el puño, feliz.', txt=[('TÚ GANASTE', SIN, G)], mark='⚡')
R('Cómo puede ser', '2D', '«Tú» se rasca la cabeza, confundido.')
R('No que si alguien se hace rico', 'ÍCONOS', 'Una mano le quita una moneda a otra mano.',
  [('icono:quitar', 'Mano que le quita una moneda a otra mano', 'hand taking coin from another hand icon')], [('¿SE LO QUITÓ A OTRO?', SIN, M)])
R('Mira en cualquier economía hay dos tipos de ricos', 'FOTO', 'Pantalla dividida: dos fotos entran desde los lados.',
  [('foto', 'Mitad izquierda: mansión de lujo de noche, iluminada, sin personas', 'luxury mansion night lights', 'mansion'),
   ('foto', 'Mitad derecha: fábrica moderna o planta industrial de día, sin personas en primer plano', 'modern factory building exterior', 'fabrica')],
  [('2 TIPOS DE RICOS', CON, M)])
R('Los que se aprovechan de la sociedad', 'VIDEO', 'Manos con saco contando fajos de billetes en un escritorio oscuro.',
  [('video', 'Manos (con saco y reloj) contando billetes en un escritorio oscuro, sin rostro', 'hands counting money desk dark businessman', 'contar')],
  [('SE APROVECHAN', SIN, G)])
R('y los que la hacen avanzar', 'VIDEO', 'Toma aérea de una obra en construcción con grúas.',
  [('video', 'Toma aérea (dron) de una obra en construcción con grúas, gente muy lejos', 'aerial construction site cranes drone', 'obra')],
  [('LA HACEN AVANZAR', SIN, G)])
R('Y desde lejos se ven idénticos', 'VIDEO', 'Silueta de un hombre de traje, de espaldas, frente a un ventanal con la ciudad.',
  [('video', 'Silueta de hombre de traje de espaldas frente a un ventanal con vista a la ciudad', 'businessman silhouette window city back view', 'ejecutivo')],
  [('IDÉNTICOS', SIN, M)])
R('mismo coche misma casa', 'FOTO', 'Auto de lujo estacionado frente a la mansión.',
  [('foto', 'Auto de lujo negro estacionado, sin placas ni logos, sin personas', 'luxury black car parked')])
R('Al final de este video te voy a dar una prueba', '2D', '«Tú» con una lupa gigante.',
  [('icono:lupa', 'Lupa', 'magnifying glass icon flat')], [('LA PRUEBA', CON, M)], '🪝')
R('para saber de cualquier rico', '2D', '«Tú» examina con la lupa tu sombrero de copa.', ['=icono_lupa.png', '=icono_sombrero_copa.png'], [('¿DE QUÉ TIPO ES?', SIN, M)])
R('Y te adelanto algo', '2D', '«Tú» sonríe con picardía; tu balanza se tambalea a un lado y al otro.',
  [('icono:balanza', 'Balanza de dos platos (estilo justicia), dorada o plana', 'balance scale icon flat gold')],
  [('INCOMODA A LOS DOS BANDOS', CON, M)], '🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 1 · "Más rico sin un peso más"')
R('Vamos a empezar con un experimento', '2D', '«Tú» con lentes de laboratorio, sosteniendo un matraz.',
  [('icono:matraz', 'Matraz de laboratorio con líquido', 'lab flask icon flat')], [('EXPERIMENTO', CON, C)])
R('Piensa en cuánto ganas', 'FOTO', 'Manos sosteniendo unos billetes de sueldo.',
  [('foto', 'Manos sosteniendo unos billetes (sueldo), sin rostro', 'hands holding money salary close up')])
R('Ahora imagina que ganas exactamente lo mismo pero en 1990', 'FOTO', 'Calle de ciudad de los noventa, foto antigua a color.',
  [('foto', 'Calle de ciudad latinoamericana de los años 90, foto antigua a color, gente solo de lejos', 'vintage 1990s city street photo')],
  [('1990', CON, G)], '⚡')
R('Quieres hablarle a tu tía', 'FOTO', 'Teléfono antiguo de disco sobre una mesa.',
  [('foto', 'Teléfono antiguo de disco sobre una mesa de madera, sin personas', 'vintage rotary phone table', 'disco')])
R('Larga distancia', 'VIDEO', 'Dedo marcando en un teléfono de disco.',
  [('video', 'Dedo marcando un número en un teléfono de disco, de cerca', 'finger dialing rotary phone close up')], [('LARGA DISTANCIA', SIN, M)])
R('Cada minuto cuesta', 'ÍCONOS', 'Tu reloj y unas monedas que van cayendo con cada segundo.',
  ['=icono_reloj.png', ('icono:moneda', 'Moneda dorada', 'gold coin icon flat')], [('$$$ POR MINUTO', SIN, M)])
R('así que hablas rapidito', '2D', '«Tú» habla rapidísimo con un auricular antiguo, sudando y viendo el reloj.', ['=icono_reloj.png'])
R('Y eso si tienes teléfono', 'VIDEO', 'Mano metiendo monedas en un teléfono público.',
  [('video', 'Mano metiendo monedas en un teléfono público antiguo', 'hand inserting coins payphone', 'publico')])
R('en varios países de Latinoamérica pedías una línea', 'ÍCONOS', 'Mapa de Latinoamérica que se ilumina.',
  [('icono:mapa_latam', 'Mapa de Latinoamérica (silueta)', 'latin america map silhouette')])
R('y te tenían esperando meses', '2D', '«Tú» esperando sentado; las hojas del calendario vuelan.',
  [('icono:calendario', 'Calendario de hojas', 'calendar icon flat')], [('MESES… O AÑOS', SIN, M)], '⚡')
R('Había casas que valían más', 'FOTO', 'Casa sencilla de barrio con cables de teléfono.',
  [('foto', 'Casa sencilla de barrio con cables de teléfono en la fachada, sin personas', 'simple house telephone wires street')])
R('Y si quieres ir al aeropuerto de noche', 'VIDEO', 'Calle de ciudad de noche, con luces reflejadas en el piso mojado.',
  [('video', 'Calle de ciudad de noche con piso mojado y luces, sin rostros', 'city street night wet lights')])
R('Sales a la calle levantas la mano y rezas', 'VIDEO', 'Persona de espaldas levantando la mano para parar un taxi de noche.',
  [('video', 'Persona de espaldas levantando la mano para parar un taxi de noche', 'person hailing taxi night back view')])
R('No sabes cuánto te van a cobrar', 'ÍCONOS', 'Signos de interrogación que aparecen alrededor de la pantalla.',
  [('icono:interrogacion', 'Signo de interrogación', 'question mark icon flat')], [('¿CUÁNTO? ¿QUIÉN?', SIN, M)])
R('y si te cobra de más ni a quién quejarte', '2D', '«Tú» en el asiento de atrás, enojado; tu etiqueta de precio sube y sube.', ['=icono_etiqueta_precio.png'])
R('Ahora regresa al presente', 'VIDEO', 'Timelapse de una ciudad moderna de noche.',
  [('video', 'Timelapse de una ciudad moderna de noche con tráfico y luces', 'modern city night timelapse traffic', 'ciudad')], [('HOY', CON, C)])
R('Con lo mismo que antes gastabas', 'VIDEO', 'Otra vez las manos con el celular moderno.', ['=@celular'])
R('hoy tienes un plan con internet', 'ÍCONOS', 'Tres íconos salen del celular: internet, mensajes y videollamada.',
  [('icono:internet', 'Wifi o globo de internet', 'wifi internet icon flat'), ('icono:mensajes', 'Burbuja de mensajes', 'chat message bubble icon flat'),
   ('icono:videollamada', 'Cámara de videollamada', 'video call icon flat')], mark='⚡')
R('Y con tu celular pides un auto', 'VIDEO', 'Mano pidiendo un auto en una app del celular.',
  [('video', 'Mano pidiendo un auto en una app de transporte en el celular (pantalla sin marcas)', 'hand ride hailing app smartphone')])
R('ves cuánto vas a pagar', 'ÍCONOS', 'Tu etiqueta de precio con una palomita verde.',
  ['=icono_etiqueta_precio.png', ('icono:palomita', 'Palomita verde (check)', 'green check mark icon flat')])
R('sabes quién te lleva', 'VIDEO', 'Un auto llega a la banqueta de noche.',
  [('video', 'Auto llegando y deteniéndose junto a la banqueta de noche, sin placas legibles', 'car pulling up curb night')])
R('y hasta le pones estrellitas al chofer', 'ÍCONOS', 'Cinco estrellas que se llenan una por una.',
  [('icono:estrellas', 'Cinco estrellas de calificación', 'five stars rating icon flat')], mark='⚡')
R('Tu sueldo es el mismo', 'TEXTO', 'Dos tarjetas, una al lado de la otra; la segunda entra con un golpe.', txt=[('MISMO SUELDO', CON, M), ('OTRA VIDA', CON, M)])
R('Y aquí está la trampa', '2D', '«Tú» se frena en seco, con cara de alerta.', txt=[('LA TRAMPA', SIN, G)], mark='🪝')
R('solemos medir la riqueza en dinero', 'VIDEO', 'Máquina contadora de billetes funcionando.',
  [('video', 'Máquina contadora de billetes funcionando, de cerca', 'money counting machine close up', 'contadora')])
R('Pero el dinero es solo un papel', 'FOTO', 'Un billete muy de cerca (macro).',
  [('foto', 'Billete visto muy de cerca, macro, sin país reconocible', 'banknote macro close up')], [('SOLO UN PAPEL', SIN, M)])
R('Si con el mismo papel hoy obtienes', 'VIDEO', 'Carrito de supermercado lleno avanzando por un pasillo.',
  [('video', 'Carrito de supermercado lleno avanzando por el pasillo, sin rostros', 'full shopping cart supermarket aisle')])
R('entonces eres más rico', '2D', '«Tú» se pone una corona dorada.',
  [('icono:corona', 'Corona dorada', 'gold crown icon flat')], [('MÁS RICO', SIN, G)], '⚡')
R('Y qué pasó', '2D', '«Tú» pensativo, con la mano en la barbilla.')
R('Las empresas se volvieron buenas personas', 'ÍCONOS', 'Un edificio de empresa con una aureola de angelito.',
  [('icono:empresa', 'Edificio de empresa (genérico, sin logo)', 'company building icon flat'),
   ('icono:aureola', 'Aureola de angelito', 'angel halo icon')])
R('No Para nada', 'ÍCONOS', 'La aureola se cae del edificio.', ['=icono_empresa.png', '=icono_aureola.png'])
R('Lo que pasó tiene nombre competencia', 'VIDEO', 'Corredores en una pista de atletismo, vistos desde atrás.',
  [('video', 'Corredores en pista de atletismo vistos de espaldas o desde lejos', 'runners race track from behind', 'corredores')],
  [('COMPETENCIA', SIN, G)], '⚡')
R('Cuando una compañía cobra de más', 'ÍCONOS', 'Tu edificio de empresa con la etiqueta de precio que se pone roja.',
  ['=icono_empresa.png', '=icono_etiqueta_precio.png'], [('COBRA DE MÁS', SIN, M)])
R('llega otra con un plan más barato', 'ÍCONOS', 'Entra un segundo edificio desde el otro lado y empuja al primero.',
  ['=icono_empresa.png', ('icono:empresa_2', 'Otro edificio de empresa, distinto al primero (otro color o forma)', 'office building icon flat')],
  [('MÁS BARATO Y MEJOR', SIN, M)])
R('Nadie te regaló nada', '2D', '«Tú» abre una caja de regalo… vacía.',
  [('icono:regalo', 'Caja de regalo', 'gift box icon flat')])
R('Te estaban peleando', 'VIDEO', 'Dos guantes de box chocando, de cerca.',
  [('video', 'Guantes de box chocando de cerca, sin rostros', 'boxing gloves punch close up')], [('POR TI', SIN, G)], '⚡')
R('Pero espera porque esa historia tiene un villano', '2D', '«Tú» se asusta; aparece una silueta con sombrero de copa y bigote.',
  [('icono:villano', 'Silueta de villano clásico con sombrero de copa y bigote', 'villain silhouette top hat mustache')],
  [('EL VILLANO', SIN, G)], '🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 2 · "El villano: el rico que no quiere competir"')
R('Por qué crees que en los noventa', 'FOTO', 'El teléfono de disco otra vez, ahora con luz más fría.', ['=@disco'])
R('No era porque la tecnología no existiera', 'VIDEO', 'Antena de telecomunicaciones contra el cielo.',
  [('video', 'Antena de telecomunicaciones contra el cielo', 'telecommunication tower antenna sky')])
R('En muchos de nuestros países había una sola compañía', 'ÍCONOS', 'Tu edificio de empresa solito al centro, con la corona encima.',
  ['=icono_empresa.png', '=icono_corona.png'], [('UNA SOLA COMPAÑÍA', CON, M)])
R('Una Y cuando eres el único', 'TEXTO', 'Un número uno enorme que llena la pantalla.', txt=[('1', SIN, G)], mark='⚡')
R('Para qué bajar precios', 'VIDEO', 'Fila larga de gente esperando, vista de espaldas.',
  [('video', 'Fila larga de personas esperando, vistas de espaldas', 'long queue people waiting back view')])
R('Si no te gusta pues no tengas teléfono', '2D', '«Tú» con el cable del teléfono cortado en la mano.',
  [('icono:sin_senal', 'Señal de teléfono cortada o barras de señal vacías con una X', 'no signal icon flat')])
R('Ese es el primer tipo de rico', 'FOTO', 'La mansión de noche otra vez.', ['=@mansion'], [('TIPO 1', CON, M)])
R('El que no gana porque sea el mejor', 'VIDEO', 'Mano cerrando un candado en una reja.',
  [('video', 'Mano cerrando un candado con cadena en una reja', 'hand locking padlock gate chain', 'candado')], [('NADIE MÁS PUEDE JUGAR', SIN, M)])
R('Consigue un permiso exclusivo', 'ÍCONOS', 'Tres íconos, uno por cada cosa: permiso, amigo en el gobierno y ley a la medida.',
  [('icono:permiso', 'Documento con sello oficial', 'official document stamp icon flat'),
   ('icono:apreton', 'Apretón de manos', 'handshake icon flat'),
   ('icono:mazo', 'Mazo de juez', 'judge gavel icon flat')])
R('Y desde ahí te cobra lo que quiere', 'ÍCONOS', 'Tu etiqueta de precio sube sin parar y se pone roja.', ['=icono_etiqueta_precio.png'], [('LO QUE QUIERE', SIN, M)])
R('El segundo tipo hace exactamente lo contrario', 'FOTO', 'La fábrica moderna de día.', ['=@fabrica'], [('TIPO 2', CON, M)])
R('Baja precios mejora el producto', 'ÍCONOS', 'Tres íconos al ritmo de la voz: flecha de precio hacia abajo, estrellas e imán.',
  [('icono:flecha_abajo', 'Flecha hacia abajo (verde)', 'down arrow icon flat green'), '=icono_estrellas.png',
   ('icono:iman', 'Imán atrayendo', 'magnet icon flat')])
R('Y en el camino se hace rico', 'VIDEO', 'Billetes cayendo en cámara lenta.', ['=@billetes'], [('MUY RICO', SIN, G)], '⚡')
R('Y aquí va la idea más incómoda', '2D', '«Tú» incómodo, jalándose el cuello de la sudadera.', mark='🪝')
R('La pregunta los ricos son buenos o malos', 'ÍCONOS', 'Tu balanza al centro, quieta.', ['=icono_balanza.png'], [('¿BUENOS O MALOS?', SIN, M)])
R('está mal hecha', 'ÍCONOS', 'Una X roja enorme tacha la balanza.',
  ['=icono_balanza.png', ('icono:x_roja', 'X roja grande', 'red x cross icon')], [('PREGUNTA EQUIVOCADA', CON, M)], '⚡')
R('Es como preguntar si los cuchillos', 'VIDEO', 'Manos cortando verduras con un cuchillo en una tabla.',
  [('video', 'Manos cortando verduras con cuchillo en tabla de cocina', 'hands cutting vegetables knife board')])
R('Depende de para qué se usen', '2D', '«Tú» asiente despacio.')
R('Lo que importa no es cuánto dinero', 'VIDEO', 'La máquina contadora de billetes otra vez.', ['=@contadora'])
R('Es cómo lo consiguió', 'TEXTO', 'Texto grande sobre fondo azul marino.', txt=[('¿CÓMO LO CONSIGUIÓ?', CON, G)], mark='⚡')
R('Y para que veas lo difícil que es separarlos', '2D', '«Tú» abre un libro viejo y polvoriento.',
  [('icono:libro_viejo', 'Libro antiguo de pasta gruesa', 'old book icon')])
R('te voy a contar la historia de un hombre', 'ÍCONOS', 'Las páginas del libro viejo pasan solas, rapidísimo.', ['=icono_libro_viejo.png'], mark='🪝')
R('al mismo tiempo', 'ÍCONOS', 'Silueta de un hombre de 1900 con sombrero de copa; se parte en dos colores (dorado y rojo).',
  [('icono:silueta_1900', 'Silueta de hombre de época (1900) con sombrero de copa y barba, sin rostro', 'victorian gentleman silhouette top hat beard')],
  [('LOS DOS A LA VEZ', SIN, M)])

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 3 · "El hombre que fue los dos"')
R('Escocia 1848', 'FOTO', 'Paisaje de Escocia nublado; zoom lento.',
  [('foto', 'Paisaje de Escocia nublado (colinas o puerto antiguo), sin personas', 'scotland landscape cloudy moody', 'escocia')], [('ESCOCIA, 1848', CON, M)])
R('Una familia pobre se sube a un barco', 'VIDEO', 'Barco de vela antiguo en el mar.',
  [('video', 'Barco de vela antiguo navegando en el mar', 'old sailing ship at sea')])
R('En esa familia viene un niño de doce años', 'ÍCONOS', 'Silueta de un niño de época, con gorra.',
  [('icono:silueta_nino', 'Silueta de niño de época (1850) con gorra, sin rostro', 'victorian boy silhouette cap')], [('ANDREW CARNEGIE', CON, M)])
R('A los trece ya trabaja en una fábrica de algodón', 'FOTO', 'Foto antigua en blanco y negro de una fábrica textil con máquinas.',
  [('foto', 'Foto antigua en blanco y negro de una fábrica textil del siglo XIX con máquinas (sin rostros reconocibles)', 'vintage textile mill black and white 19th century')])
R('doce horas diarias', 'ÍCONOS', 'Tu reloj gira rapidísimo.', ['=icono_reloj.png'], [('12 HORAS DIARIAS', SIN, M)])
R('por poco más de un dólar a la semana', 'ÍCONOS', 'Una sola moneda, solita al centro.', ['=icono_moneda.png'], [('$1.20 A LA SEMANA', SIN, M)], '⚡')
R('Luego reparte telegramas', 'FOTO', 'Telégrafo antiguo de cerca.',
  [('foto', 'Telégrafo antiguo (aparato de código morse) de cerca', 'vintage telegraph key close up')])
R('Aprende rápido Ahorra Invierte', 'ÍCONOS', 'Tres íconos, uno por palabra: cerebro, alcancía y planta con monedas.',
  [('icono:cerebro', 'Cerebro (aprender)', 'brain icon flat'), ('icono:alcancia', 'Alcancía de cerdito', 'piggy bank icon flat'),
   ('icono:inversion', 'Planta creciendo de unas monedas', 'investment plant coins icon flat')])
R('Y cuarenta años después', 'VIDEO', 'Acero fundido vertiéndose en una fundición, con chispas.',
  [('video', 'Acero fundido vertiéndose en una fundición con chispas', 'molten steel pouring foundry sparks', 'acero')], [('40 AÑOS DESPUÉS', SIN, C)], '⚡')
R('Con ese acero se construyen puentes', 'VIDEO', 'Gran puente de acero visto desde un dron.',
  [('video', 'Puente de acero visto desde dron', 'steel bridge aerial drone')])
R('vías de tren rascacielos', 'VIDEO', 'Tren de carga sobre vías y luego rascacielos vistos desde abajo.',
  [('video', 'Tren de carga avanzando sobre las vías', 'freight train tracks'),
   ('video', 'Rascacielos vistos desde abajo hacia el cielo', 'skyscrapers looking up')])
R('Miles y miles de personas tienen trabajo', 'VIDEO', 'Obreros con casco caminando de espaldas hacia una fábrica.',
  [('video', 'Obreros con casco caminando de espaldas en una fábrica o planta', 'workers hard hats walking factory back view', 'obreros')])
R('Esto es lo primero que hace un rico de los que suman', 'ÍCONOS', 'Ícono de empleo grande al centro, con brillo dorado.',
  [('icono:empleo', 'Empleo: maletín o casco de trabajo', 'job briefcase hard hat icon flat')], [('BENEFICIO DIRECTO: EMPLEO', CON, M)], '⚡')
R('Cada empresa desde la tiendita de la esquina', 'FOTO', 'Tiendita de barrio con productos en la entrada.',
  [('foto', 'Tiendita de barrio (abarrotes) con productos en la entrada, sin personas', 'small corner grocery store latin america')])
R('hasta la fábrica más grande necesita gente', 'FOTO', 'La fábrica moderna otra vez.', ['=@fabrica'])
R('Y cuando alguien invierte y abre un negocio', 'VIDEO', 'Mano volteando el letrero de «abierto» en la puerta de un local.',
  [('video', 'Mano volteando el letrero de abierto en la puerta de un negocio', 'hand flipping open sign shop door')])
R('hay familias que por fin pueden pagar la renta', 'VIDEO', 'Familia caminando de espaldas al atardecer.',
  [('video', 'Familia caminando de espaldas al atardecer (sin rostros)', 'family walking sunset back view', 'familia')])
R('la escuela de los hijos el doctor', 'ÍCONOS', 'Tres íconos: casa, escuela y estetoscopio.',
  [('icono:casa', 'Casa', 'house icon flat'), ('icono:escuela', 'Escuela', 'school building icon flat'),
   ('icono:doctor', 'Estetoscopio', 'stethoscope icon flat')])
R('Pero Carnegie no se detiene ahí', 'ÍCONOS', 'La silueta de 1900 vuelve, ahora toda dorada.', ['=icono_silueta_1900.png'])
R('Cuando vende su empresa decide regalar', 'ÍCONOS', 'Tu caja de regalo se abre y salen billetes.', ['=icono_regalo.png', '=icono_fajo.png'])
R('Casi el noventa por ciento', 'TEXTO', 'Porcentaje enorme que se va llenando como una gráfica de pastel.', txt=[('90 %', SIN, G)], mark='⚡')
R('Construye más de dos mil quinientas bibliotecas', 'VIDEO', 'Interior de una biblioteca antigua, con estantes altos.',
  [('video', 'Interior de biblioteca antigua con estantes altos, sin rostros', 'old library interior bookshelves', 'biblioteca')],
  [('+2,500 BIBLIOTECAS', SIN, M)], '⚡')
R('Financia universidades investigación científica', 'ÍCONOS', 'Tres íconos: birrete, microscopio y paloma de la paz.',
  [('icono:birrete', 'Birrete de graduación', 'graduation cap icon flat'), ('icono:microscopio', 'Microscopio', 'microscope icon flat'),
   ('icono:paloma', 'Paloma de la paz', 'peace dove icon flat')])
R('Y no es el único', '2D', '«Tú» levanta un dedo: «espera, hay más».')
R('Hoy hay empresarios que financian becas', 'ÍCONOS', 'Tres íconos: birrete, hospital y mano con corazón.',
  ['=icono_birrete.png', ('icono:hospital', 'Hospital', 'hospital icon flat'), ('icono:mano_corazon', 'Mano sosteniendo un corazón', 'hand heart charity icon flat')])
R('Muchos ni lo anuncian', '2D', '«Tú» con el dedo en la boca: «shhh».')
R('Pero ahí están una escuela aquí', 'VIDEO', 'Salón de clases luminoso, niños de espaldas.',
  [('video', 'Salón de clases luminoso, niños de espaldas o sin rostros', 'classroom children back view')])
R('Hasta aquí el rico perfecto no', 'ÍCONOS', 'La silueta dorada con tu aureola encima.',
  ['=icono_silueta_1900.png', '=icono_aureola.png'], [('¿EL RICO PERFECTO?', SIN, M)], '🪝')
R('Pues aguanta', '2D', '«Tú» levanta la mano en señal de alto; la pantalla se oscurece.')
R('En 1892 en una de sus fábricas', 'FOTO', 'Foto antigua de una acería con chimeneas humeando.',
  [('foto', 'Foto antigua en blanco y negro de una acería con chimeneas humeando, sin personas', 'vintage steel mill smokestacks black and white')], [('1892', CON, C)])
R('los trabajadores se niegan a aceptar un recorte', 'ÍCONOS', 'Unas tijeras cortan un billete por la mitad.',
  [('icono:tijeras', 'Tijeras', 'scissors icon flat')], [('RECORTE DE SUELDO', SIN, M)])
R('La empresa los deja afuera', 'VIDEO', 'Mano cerrando el candado de la reja.', ['=@candado'])
R('y contrata guardias armados', 'ÍCONOS', 'Siluetas de guardias armados en fila.',
  [('icono:guardias', 'Siluetas de guardias armados de época (1890), sin rostros', 'armed guards silhouettes 19th century')])
R('Hay un enfrentamiento a balazos junto al río', 'VIDEO', 'Río con niebla al amanecer, tonos oscuros.',
  [('video', 'Río con niebla al amanecer, ambiente oscuro', 'misty river dawn dark moody', 'rio')])
R('Mueren trabajadores', 'TEXTO', 'Dos textos sobre fondo negro, uno tras otro.', txt=[('MUEREN TRABAJADORES', SIN, M), ('Y GUARDIAS', SIN, M)], mark='⚡')
R('Carnegie estaba de vacaciones en Escocia', 'FOTO', 'El paisaje de Escocia otra vez.', ['=@escocia'])
R('Dejó todo en manos de su socio', 'ÍCONOS', 'La silueta de 1900 se da la vuelta y se aleja.', ['=icono_silueta_1900.png'], [('NO HIZO NADA', SIN, M)])
R('El mismo hombre que regaló bibliotecas', 'VIDEO', 'La biblioteca antigua otra vez.', ['=@biblioteca'])
R('dejó que se disparara', 'VIDEO', 'Corte seco al río oscuro con niebla.', ['=@rio'])
R('Entonces qué fue Carnegie', 'ÍCONOS', 'Tu balanza se mueve de un lado a otro.', ['=icono_balanza.png'], [('¿SUMA O SE APROVECHA?', SIN, M)], '🪝')
R('Fue los dos', 'TEXTO', 'Texto grande sobre fondo azul marino, mitad dorado y mitad rojo.', txt=[('LOS DOS', CON, G)], mark='⚡')
R('Y por eso no podemos juzgar a un rico', 'ÍCONOS', 'Tu caja de regalo con tu X roja encima.', ['=icono_regalo.png', '=icono_x_roja.png'], [('NO POR LO QUE REGALA', SIN, M)])
R('Hay que verlo por cómo gana su dinero', 'VIDEO', 'Las manos contando billetes otra vez.', ['=@contar'], [('POR CÓMO GANA', SIN, M)])
R('Pero la mayoría de los beneficios', '2D', '«Tú» busca con tu lupa por toda la pantalla.', ['=icono_lupa.png'])
R('Los más grandes son invisibles', '2D', '«Tú» con la lupa: no ve nada.', txt=[('INVISIBLES', SIN, G)], mark='🪝')
R('y probablemente los usaste hoy en la mañana', 'VIDEO', 'Mesa de cocina en la mañana: taza de café y celular.',
  [('video', 'Mesa de cocina en la mañana con taza de café y celular, luz de ventana, sin personas', 'morning kitchen table coffee phone')])

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 4 · "Lo que usas sin ver"')
R('Hasta ahora vimos los beneficios directos', 'ÍCONOS', 'Tus íconos de empleo y regalo, uno al lado del otro.', ['=icono_empleo.png', '=icono_regalo.png'], [('DIRECTOS', CON, C)])
R('Ahora vienen los indirectos', 'TEXTO', 'Texto grande que entra con fuerza.', txt=[('INDIRECTOS', CON, M)], mark='⚡')
R('Primero la innovación', 'ÍCONOS', 'Un foco que se enciende.',
  [('icono:foco', 'Foco encendido (idea)', 'light bulb idea icon flat')], [('1. INNOVACIÓN', CON, M)])
R('En 1928 un científico descubre la penicilina', 'FOTO', 'Placa de Petri con moho, en un laboratorio.',
  [('foto', 'Placa de Petri con moho u hongo, en laboratorio', 'petri dish mold laboratory', 'petri')], [('1928', CON, C)])
R('Increíble no', '2D', '«Tú» aplaude.')
R('Pero durante más de diez años', 'ÍCONOS', 'Las hojas de tu calendario vuelan otra vez.', ['=icono_calendario.png'], [('+10 AÑOS', SIN, M)])
R('Sabes por qué', '2D', '«Tú» se encoge de hombros.', mark='🪝')
R('No había forma de fabricarla', 'VIDEO', 'Laboratorio antiguo: frascos de vidrio y manos con guantes.',
  [('video', 'Laboratorio con frascos de vidrio y manos con guantes, sin rostros', 'laboratory glassware gloved hands', 'lab')])
R('En 1942 una de las primeras pacientes', 'FOTO', 'Cama de hospital antigua, vacía.',
  [('foto', 'Cama de hospital antigua y vacía, ambiente de época', 'vintage hospital bed empty')], [('1942', CON, C)])
R('usó ella sola la mitad', 'ÍCONOS', 'Un frasco de medicina que se parte a la mitad.',
  [('icono:frasco', 'Frasco de medicina', 'medicine bottle icon flat')], [('LA MITAD DEL PAÍS', SIN, M)], '⚡')
R('Entonces varias empresas se pusieron a competir', 'VIDEO', 'Los corredores en la pista otra vez.', ['=@corredores'])
R('por ver quién la producía más rápido', 'VIDEO', 'Línea de producción farmacéutica: frascos avanzando en la banda.',
  [('video', 'Línea de producción farmacéutica con frascos en banda transportadora', 'pharmaceutical production line bottles conveyor')])
R('Y en apenas dos años ya había suficiente', 'VIDEO', 'Siluetas de soldados de época caminando, a contraluz.',
  [('video', 'Siluetas de soldados caminando a contraluz (sin rostros)', 'soldiers silhouette walking sunset')], mark='⚡')
R('El descubrimiento fue de un científico', 'FOTO', 'La placa de Petri otra vez.', ['=@petri'])
R('Que llegara a tu farmacia', 'VIDEO', 'Estantes de una farmacia llenos de medicinas.',
  [('video', 'Estantes de farmacia con medicinas, sin rostros', 'pharmacy shelves medicine')])
R('Lo mismo con tu teléfono tu internet', 'ÍCONOS', 'Tres íconos: celular, internet y frasco de medicina.',
  [('icono:celular', 'Celular moderno', 'smartphone icon flat'), '=icono_internet.png', '=icono_frasco.png'])
R('Segundo los impuestos', 'ÍCONOS', 'Documento de impuestos con sello.',
  [('icono:impuestos', 'Documento de impuestos o calculadora', 'tax document icon flat')], [('2. IMPUESTOS', CON, M)])
R('Las carreteras por las que viajas', 'VIDEO', 'Carretera vista desde un dron.',
  [('video', 'Carretera con autos vista desde dron', 'highway aerial drone cars')])
R('el hospital público la escuela', 'ÍCONOS', 'Tres íconos: hospital, escuela y poste de luz.',
  ['=icono_hospital.png', '=icono_escuela.png', ('icono:poste_luz', 'Poste de alumbrado público', 'street lamp icon flat')])
R('todo eso se paga en parte', 'FOTO', 'La fábrica moderna; tu documento de impuestos sale de ella hacia la ciudad.', ['=@fabrica', '=icono_impuestos.png'])
R('Y no no te voy a decir que todas pagan', '2D', '«Tú» levanta una ceja, irónico.')
R('Algunas contratan ejércitos de abogados', 'VIDEO', 'Manos en una sala de juntas con muchos papeles.',
  [('video', 'Manos de abogados en sala de juntas revisando papeles, sin rostros', 'lawyers hands meeting documents table')], [('LO MENOS POSIBLE', SIN, M)])
R('Adivinas de qué tipo de rico son', 'FOTO', 'La mansión de noche otra vez.', ['=@mansion'], [('¿TIPO 1 O 2?', SIN, M)], '🪝')
R('Y ahora sí viene la parte que casi ningún video', '2D', '«Tú» se acerca a la cámara como para contar un secreto.', mark='🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 5 · "La parte que casi nadie dice"')
R('Nos han vendido la historia del empresario genio', 'VIDEO', 'La silueta del ejecutivo frente al ventanal.', ['=@ejecutivo'])
R('que él solito construye un imperio', 'ÍCONOS', 'Tu corona encima de un castillo de bloques.',
  ['=icono_corona.png', ('icono:castillo', 'Castillo o torre', 'castle icon flat')], [('ÉL SOLITO', SIN, M)])
R('Es mentira', 'TEXTO', 'Texto rojo enorme que entra de golpe.', txt=[('MENTIRA', SIN, G)], mark='⚡')
R('O bueno es media verdad', '2D', '«Tú» mueve la mano: «más o menos».', txt=[('MEDIA VERDAD', CON, M)])
R('Sí el empresario arriesga', 'ÍCONOS', 'Un dado y tu planta con monedas.',
  [('icono:riesgo', 'Dado (riesgo)', 'dice risk icon flat'), '=icono_inversion.png'])
R('Si sale mal pierde', 'ÍCONOS', 'Gráfica que cae en rojo.',
  [('icono:grafica_baja', 'Gráfica de línea cayendo, en rojo', 'chart down red icon flat')])
R('Eso es real y tiene mérito', '2D', '«Tú» asiente con el pulgar arriba.')
R('Pero hazte esta pregunta', '2D', '«Tú» pensativo; aparece tu signo de interrogación.', ['=icono_interrogacion.png'], mark='🪝')
R('quién fabrica', 'VIDEO', 'Manos trabajando en una línea de producción.',
  [('video', 'Manos trabajando en una línea de producción', 'hands assembly line factory work', 'produccion')])
R('Quién atiende', 'VIDEO', 'Manos de un mesero sirviendo o de un cajero cobrando.',
  [('video', 'Manos de mesero sirviendo o de cajero atendiendo, sin rostros', 'waiter hands serving food close up')])
R('Quién maneja el camión', 'VIDEO', 'Camión de carga en carretera.',
  [('video', 'Camión de carga avanzando por carretera', 'truck driving highway', 'camion')])
R('contesta el teléfono', 'VIDEO', 'Persona de espaldas con diadema, en un centro de atención.',
  [('video', 'Persona de espaldas con diadema en un centro de atención telefónica', 'call center headset back view')])
R('arregla la máquina a las tres de la mañana', 'VIDEO', 'Manos con una llave reparando una máquina, de noche.',
  [('video', 'Manos con llave reparando una máquina industrial, luz de noche', 'mechanic hands wrench repairing machine night')])
R('Sin trabajadores una empresa es un logotipo bonito', 'FOTO', 'Oficina enorme vacía, con las luces apagadas.',
  [('foto', 'Oficina grande y vacía con luces apagadas, sin personas', 'empty office dark')], [('UN EDIFICIO VACÍO', SIN, M)], '⚡')
R('Y no solo ponen las manos', 'ÍCONOS', 'Una mano y tu foco encendido.',
  [('icono:mano', 'Mano abierta (trabajo)', 'hand icon flat'), '=icono_foco.png'])
R('Muchas veces ponen las ideas', 'VIDEO', 'Equipo pegando notas adhesivas en una pared.',
  [('video', 'Manos de un equipo pegando notas adhesivas en una pared, sin rostros', 'team sticky notes wall brainstorming hands', 'notas')])
R('Conoces los papelitos amarillos', 'FOTO', 'Notas adhesivas amarillas sobre un escritorio.',
  [('foto', 'Notas adhesivas amarillas sobre un escritorio, sin marca visible', 'yellow sticky notes desk', 'notas_foto')])
R('No los inventó el dueño', '2D', '«Tú» sorprendido.', txt=[('NO FUE EL DUEÑO', SIN, M)])
R('Los inventaron dos empleados', 'ÍCONOS', 'Dos siluetas de trabajadores, una al lado de la otra.',
  [('icono:dos_empleados', 'Dos siluetas de empleados (sin rostro)', 'two employees silhouettes icon')], mark='⚡')
R('Uno había creado por error un pegamento', 'VIDEO', 'El laboratorio de frascos otra vez.', ['=@lab'])
R('Años después otro lo usó para que no se le cayeran', 'FOTO', 'Libro de cantos abierto con separadores amarillos.',
  [('foto', 'Libro antiguo (himnario) abierto con separadores de papel amarillo', 'old hymn book open bookmarks')])
R('De ese error de dos empleados salió', 'FOTO', 'Las notas amarillas otra vez.', ['=@notas_foto'], [('DE UN ERROR', SIN, M)])
R('Y ahora el giro', '2D', '«Tú» voltea la cabeza de golpe.', txt=[('EL GIRO', SIN, G)], mark='🪝')
R('En 1914 Henry Ford hizo algo', 'FOTO', 'Auto antiguo de principios del siglo XX.',
  [('foto', 'Auto antiguo de principios del siglo XX (sin logos)', 'antique car early 1900s', 'auto_antiguo')], [('1914', CON, C)])
R('duplicó el sueldo de sus obreros', 'ÍCONOS', 'Tu moneda se duplica: aparece otra a su lado.', ['=icono_moneda.png'], [('SUELDO ×2', SIN, G)], '⚡')
R('Le dijeron que iba a quebrar', 'ÍCONOS', 'Tu gráfica en rojo cayendo.', ['=icono_grafica_baja.png'])
R('Y qué pasó', '2D', '«Tú» expectante.')
R('Sus trabajadores dejaron de renunciar', 'FOTO', 'Foto antigua de una línea de ensamblaje de autos.',
  [('foto', 'Foto antigua en blanco y negro de una línea de ensamblaje de autos (sin rostros reconocibles)', 'vintage car assembly line black and white')])
R('y con ese sueldo empezaron a comprar', 'FOTO', 'El auto antiguo otra vez; aparece una llave de auto.',
  ['=@auto_antiguo', ('icono:llave_auto', 'Llave de auto', 'car key icon flat')])
R('Ford se hizo todavía más rico', 'VIDEO', 'Billetes cayendo en cámara lenta.', ['=@billetes'], mark='⚡')
R('O sea pagarle bien a la gente no fue caridad', 'TEXTO', 'Dos tarjetas: la primera se tacha y entra la segunda.',
  txt=[('NO FUE CARIDAD', CON, M), ('FUE BUEN NEGOCIO', CON, M)], mark='⚡')
R('Porque la riqueza es un esfuerzo compartido', 'VIDEO', 'Manos de un equipo juntándose al centro.',
  [('video', 'Manos de un equipo juntándose al centro, vistas desde arriba', 'team hands stacking together top view', 'manos_equipo')],
  [('ESFUERZO COMPARTIDO', SIN, M)])
R('el que arriesga el dinero', 'ÍCONOS', 'Tu dado de un lado y tu mano abierta del otro.', ['=icono_riesgo.png', '=icono_mano.png'])
R('Sin uno no existe el otro', 'ÍCONOS', 'Dos piezas de rompecabezas que encajan.',
  [('icono:rompecabezas', 'Dos piezas de rompecabezas encajando', 'puzzle pieces icon flat')])
R('Y si eso pasa dentro de una empresa', '2D', '«Tú» sostiene un globo terráqueo.',
  [('icono:globo', 'Globo terráqueo', 'globe earth icon flat')], mark='🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 6 · "Por qué un país es rico"')
R('Te cuento un dato que me voló la cabeza', '2D', '«Tú» con la cabeza «explotando» de sorpresa.',
  [('icono:explosion', 'Explosión estilo cómic', 'comic explosion icon')])
R('En los años sesenta Corea del Sur', 'FOTO', 'Foto antigua de un campo de arroz o una aldea, en blanco y negro.',
  [('foto', 'Foto antigua en blanco y negro de un campo de arroz o una aldea asiática (sin rostros)', 'vintage rice field village black and white asia')],
  [('COREA DEL SUR', CON, M)])
R('Tenía guerra reciente', 'ÍCONOS', 'Tierra agrietada y un barril de petróleo tachado.',
  [('icono:tierra_seca', 'Tierra seca agrietada', 'cracked dry soil icon'), ('icono:barril', 'Barril de petróleo', 'oil barrel icon flat'), '=icono_x_roja.png'])
R('Hoy es uno de los países más ricos', 'VIDEO', 'Ciudad asiática moderna de noche, en timelapse.',
  [('video', 'Ciudad asiática moderna de noche en timelapse (sin letreros legibles)', 'asian city night timelapse skyline')], mark='⚡')
R('Cómo', '2D', '«Tú» con la lupa, curioso.', ['=icono_lupa.png'])
R('Haciendo cosas tan buenas que el mundo', 'VIDEO', 'Puerto con contenedores y grúas.',
  [('video', 'Puerto con contenedores y grúas, vista amplia', 'shipping port containers cranes', 'puerto')])
R('celulares autos barcos pantallas', 'ÍCONOS', 'Cuatro íconos, uno por palabra: celular, auto, barco y pantalla.',
  ['=icono_celular.png', ('icono:auto', 'Auto', 'car icon flat'), ('icono:barco', 'Barco de carga', 'cargo ship icon flat'), '=icono_tele.png'])
R('Un país es rico cuando su gente trabaja', 'TEXTO', 'Tres palabras que aparecen una por una.', txt=[('TRABAJA · CREA · VENDE AL MUNDO', CON, G)], mark='⚡')
R('Si tu vecino tiene una empresa que exporta', 'VIDEO', 'Manos cargando cajas en un contenedor.',
  [('video', 'Manos cargando cajas en un contenedor o camión', 'workers loading boxes container')])
R('Pero también suma cada persona que trabaja ahí', 'VIDEO', 'Los obreros con casco otra vez.', ['=@obreros'])
R('Y no tienes que ser una gran empresa', '2D', '«Tú» niega con la cabeza, sonriendo.')
R('en Colombia más de medio millón de familias', 'VIDEO', 'Manos recogiendo granos de café de la planta.',
  [('video', 'Manos recogiendo granos de café rojo de la planta', 'hands picking coffee cherries plant', 'cafe')], [('+500,000 FAMILIAS', SIN, M)], '⚡')
R('Y ese café se toma en Tokio', 'ÍCONOS', 'Mapamundi con flechas que salen de Colombia hacia Tokio, Berlín y Nueva York.',
  [('icono:mapamundi', 'Mapamundi plano', 'world map flat')])
R('Eso es riqueza que entra al país desde abajo', 'VIDEO', 'Las manos con el café otra vez.', ['=@cafe'], [('RIQUEZA DESDE ABAJO', SIN, M)])
R('Ahora la otra cara', '2D', '«Tú» se pone serio.', mark='🪝')
R('Un país no progresa si solo unos pocos', 'ÍCONOS', 'Pastel con una rebanada gigante y rebanadas diminutas para los demás.',
  [('icono:pastel_injusto', 'Pastel (o gráfica de pastel) con una rebanada gigante y otras diminutas', 'pie chart unequal slice icon')], [('UNOS POCOS', SIN, M)])
R('Un país se fortalece cuando la mayoría', 'VIDEO', 'La familia caminando al atardecer otra vez.', ['=@familia'])
R('comer bien estudiar ir al doctor', 'ÍCONOS', 'Cuatro íconos: plato, escuela, estetoscopio y autobús.',
  [('icono:plato', 'Plato de comida', 'food plate icon flat'), '=icono_escuela.png', '=icono_doctor.png', ('icono:autobus', 'Autobús', 'bus icon flat')])
R('Piensa en esto', '2D', '«Tú» con el dedo en la sien.')
R('la economía no se sostiene desde arriba', 'ÍCONOS', 'Una pirámide de cabeza que se tambalea… y se voltea.',
  [('icono:piramide', 'Pirámide', 'pyramid icon flat')], [('NO DESDE ARRIBA', SIN, M)])
R('Con millones de personas que se levantan', 'VIDEO', 'Amanecer en la ciudad: gente de espaldas subiendo al transporte público.',
  [('video', 'Amanecer en la ciudad, gente de espaldas subiendo al transporte público', 'early morning commuters bus back view')], mark='⚡')
R('para que haya comida en la mesa', 'VIDEO', 'Manos sirviendo comida en una mesa familiar.',
  [('video', 'Manos sirviendo comida en una mesa familiar, sin rostros', 'hands serving family dinner table')])
R('transporte luz internet', 'ÍCONOS', 'Tres íconos: autobús, rayo y wifi.',
  ['=icono_autobus.png', ('icono:rayo', 'Rayo (electricidad)', 'lightning bolt electricity icon flat'), '=icono_internet.png'])
R('Y entonces llegamos a la pregunta', '2D', '«Tú» se sienta derecho, atento.', mark='🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 7 · Cierre: "La prueba de una sola pregunta"')
R('Te acuerdas del celular de cuatro mil dólares', 'FOTO', 'El celular ladrillo otra vez.', ['=@ladrillo'])
R('Esta es la prueba', 'TEXTO', 'Texto grande sobre fondo azul marino.', txt=[('LA PRUEBA DE UNA PREGUNTA', CON, M)], mark='⚡')
R('Cuando veas a alguien muy rico', 'VIDEO', 'La silueta del ejecutivo frente al ventanal.', ['=@ejecutivo'])
R('Pregunta esto', '2D', '«Tú» con la lupa.', ['=icono_lupa.png'])
R('Se hizo rico mejorándole la vida a otros', 'TEXTO', 'La pregunta en dos tarjetas: la primera dorada y la segunda roja.',
  txt=[('¿MEJORÓ LA VIDA DE OTROS…', CON, M), ('…O LES QUITÓ OPCIONES?', CON, M)], mark='⚡')
R('Si ganó porque te dio algo mejor', 'VIDEO', 'Las manos con el celular moderno.', ['=@celular'])
R('porque compitió creó empleo', 'ÍCONOS', 'Tres íconos con palomita: estrellas, empleo e impuestos.',
  ['=icono_estrellas.png', '=icono_empleo.png', '=icono_impuestos.png'])
R('es del tipo que te hace más rico a ti', '2D', '«Tú» con la corona dorada.', ['=icono_corona.png'], [('TE HACE MÁS RICO', SIN, M)])
R('Si ganó porque eliminó a la competencia', 'VIDEO', 'La mano cerrando el candado.', ['=@candado'])
R('porque su negocio solo funciona con favores', 'ÍCONOS', 'Tu apretón de manos por debajo de una mesa.', ['=icono_apreton.png'])
R('o porque exprime a la gente', 'ÍCONOS', 'Un limón exprimido.',
  [('icono:exprimidor', 'Limón exprimido', 'squeezed lemon icon')])
R('es del otro tipo', 'VIDEO', 'Las manos contando billetes.', ['=@contar'], [('TE HACE MÁS POBRE', SIN, M)])
R('Por eso te dije que incomoda a los dos bandos', 'ÍCONOS', 'Tu balanza queda equilibrada.', ['=icono_balanza.png'])
R('ni todos los ricos son villanos', 'ÍCONOS', 'Tu silueta de villano y tu aureola, una al lado de la otra.', ['=icono_villano.png', '=icono_aureola.png'], [('NI VILLANOS NI HÉROES', CON, M)])
R('Al final la economía es un juego', 'VIDEO', 'Mano moviendo una pieza en un tablero de ajedrez.',
  [('video', 'Mano moviendo una pieza en un tablero de ajedrez', 'hand moving chess piece board', 'ajedrez')], [('ES UN JUEGO', SIN, G)])
R('Y si no conoces las reglas pierdes', 'VIDEO', 'Rey de ajedrez cayendo sobre el tablero.',
  [('video', 'Rey de ajedrez cayendo sobre el tablero', 'chess king falling')], [('PIERDES', SIN, G)], '⚡')
R('La salida es que más gente innove', 'ÍCONOS', 'Tres íconos: foco, herramientas y mapamundi.',
  ['=icono_foco.png', ('icono:herramientas', 'Herramientas (crear)', 'tools wrench hammer icon flat'), '=icono_mapamundi.png'])
R('y que valoremos a los que trabajan', 'VIDEO', 'Los obreros con casco otra vez.', ['=@obreros'])
R('Porque sin empleados no hay empresas', 'VIDEO', 'Las manos en la línea de producción.', ['=@produccion'], [('SIN EMPLEADOS NO HAY EMPRESAS', SIN, M)])
R('y sin trabajadores no hay progreso', 'VIDEO', 'Las manos del equipo juntándose.', ['=@manos_equipo'], [('SIN TRABAJADORES NO HAY PROGRESO', SIN, M)])
R('Cuando todos suman', 'VIDEO', 'Multitud caminando por la calle vista desde arriba.',
  [('video', 'Multitud caminando por la calle vista desde arriba (sin rostros reconocibles)', 'crowd walking street top view')])
R('se reparte mejor', 'ÍCONOS', 'Pastel con rebanadas parejas.',
  [('icono:pastel_parejo', 'Pastel (o gráfica de pastel) con rebanadas iguales', 'pie chart equal slices icon')], [('SE REPARTE MEJOR', SIN, M)], '⚡')
R('Ahora te toca a ti', '2D', '«Tú» señala a la cámara.')
R('Crees que en tu país la riqueza se reparte', 'ÍCONOS', 'Tu balanza al centro.', ['=icono_balanza.png'], [('¿ES JUSTO EN TU PAÍS?', CON, M)], '🪝')
R('Déjamelo en los comentarios', '2D', '«Tú» escribe en su celular; caen globos de comentario.',
  [('icono:comentario', 'Globo de comentario', 'comment speech bubble icon flat')], [('TE LEO EN LOS COMENTARIOS', SIN, M)])
R('Y si este video te hizo ver tu celular', '2D', '«Tú» con su celular; aparece tu ícono de like.',
  [('icono:like', 'Pulgar arriba (like)', 'thumbs up like icon flat')])
R('compártelo con ese amigo', '2D', '«Tú» le manda el video a alguien; sale tu flecha de compartir.',
  [('icono:compartir', 'Flecha de compartir', 'share arrow icon flat')])
R('y suscríbete', '2D', '«Tú» toca una campana.',
  [('icono:campana', 'Campana de notificaciones', 'notification bell icon flat')], [('SUSCRÍBETE', CON, C)])
R('Es gratis', '2D', 'Pantalla final de 12 s: «Tú» saluda junto al espacio libre para los elementos de pantalla final de YouTube.', ['=icono_like.png'])

# Textos en pantalla de los shorts (el resto de los recursos de los shorts se reutiliza del largo).
# En los shorts el texto no repite lo que dicen los subtítulos en ese momento: son ganchos que no se narran.
SHORT_TXT = [
    ('texto_short1.png', 'EL LADRILLO MÁS CARO', 'con fondo', 'Short 1, primeros 3 s, arriba'),
    ('texto_short2.png', '¿HÉROE O VILLANO?', 'con fondo', 'Short 2, primeros 3 s, arriba'),
    ('texto_short3.png', 'NADIE LE CREYÓ', 'con fondo', 'Short 3, primeros 3 s, arriba'),
]

# Escenas de «La riqueza de otros».
# R(frase con la que empieza, visual, descripción, rec=[recursos], txt=[(texto, 'sin'|'con' fondo, 'grande'|'mediano'|'chico')], mark)
# Recursos: ('video', qué es, palabras clave[, apodo]) · ('foto', …) · ('icono:NOMBRE', …) · '=archivo' o '=@apodo' para reutilizar uno ya pedido.
SIN, CON = 'sin', 'con'

S('SECCIÓN 0 · Gancho: "Dos tipos de ricos"')
R('Y si te dijera que la riqueza de otros', 'VIDEO', 'Billetes cayendo en cámara lenta sobre fondo oscuro. Zoom lento hacia adelante.',
  [('video', 'Billetes (sin país reconocible) cayendo en cámara lenta sobre fondo oscuro, sin personas', 'money bills falling slow motion dark background')],
  [('¿TE HACE MÁS RICO?', SIN, 'grande')], '⚡')
R('aunque no la tengas', '2D', 'El personaje «Tú» se voltea los bolsillos vacíos, con cara de sorpresa. Encima, tu ícono de cartera vacía.',
  [('icono:cartera_vacia', 'Cartera abierta y vacía (con una polilla saliendo, si encuentras)', 'empty wallet icon flat')])
R('Suena extraño', '2D', 'Primer plano de «Tú» con una ceja levantada, dudando.')
R('Porque en cualquier economía hay dos tipos de ricos', 'FOTO', 'Pantalla dividida en dos fotos que entran desde los lados.',
  [('foto', 'Mitad izquierda: mansión de lujo de noche, iluminada, sin personas', 'luxury mansion night lights'),
   ('foto', 'Mitad derecha: fábrica moderna o planta industrial de día, sin personas en primer plano', 'modern factory building exterior')],
  [('2 TIPOS DE RICOS', CON, 'mediano')])
R('los que se aprovechan de la sociedad', 'VIDEO', 'Manos con traje contando fajos de billetes sobre un escritorio, con poca luz.',
  [('video', 'Manos (con saco y reloj) contando billetes en un escritorio oscuro, sin rostro', 'hands counting money desk dark businessman')],
  [('SE APROVECHAN', SIN, 'grande')])
R('y los que la fortalecen y la hacen avanzar', 'VIDEO', 'Toma aérea de una obra en construcción con grúas y trabajadores pequeños a lo lejos.',
  [('video', 'Toma aérea (dron) de una obra en construcción con grúas, gente muy lejos', 'aerial construction site cranes drone', 'obra')],
  [('LA HACEN AVANZAR', SIN, 'grande')])
R('Hoy quiero hablarte de estos últimos', '2D', '«Tú» señala hacia la derecha, donde queda congelado el último cuadro de la obra.',
  ['=@obra'])
R('Los que generan empleos invierten arriesgan', 'ÍCONOS', 'Cinco íconos que aparecen uno por uno al ritmo de la voz: empleo, inversión, riesgo, impuestos y productos.',
  [('icono:empleo', 'Empleo: maletín o casco de trabajo', 'job briefcase icon flat'),
   ('icono:inversion', 'Inversión: planta creciendo de unas monedas', 'investment plant coins icon flat'),
   ('icono:riesgo', 'Riesgo: dado o señal de advertencia', 'risk dice icon flat'),
   ('icono:impuestos', 'Impuestos: documento con sello o calculadora', 'tax document icon flat'),
   ('icono:productos', 'Productos: bolsa de compras con cosas', 'shopping bag products icon flat')], mark='⚡')
R('Los que aunque no lo notemos', 'VIDEO', 'Pasillo de supermercado lleno de productos, cámara avanzando despacio.',
  [('video', 'Pasillo de supermercado lleno de productos, sin rostros visibles', 'supermarket aisle products dolly')])
R('incluso si nunca los conocemos', '2D', '«Tú» caminando tranquilo con una bolsa de compras (tu ícono de productos).',
  ['=icono_productos.png'])
R('Entonces la pregunta es', 'ÍCONOS', 'Una balanza grande aparece al centro.',
  [('icono:balanza', 'Balanza de dos platos (estilo justicia), dorada o plana', 'balance scale icon flat gold')], mark='🪝')
R('realmente nos perjudican los ricos', 'ÍCONOS', 'La balanza se inclina a un lado y luego al otro, con un texto en cada plato.',
  ['=icono_balanza.png'],
  [('¿NOS PERJUDICAN?', SIN, 'chico'), ('¿NOS AYUDAN?', SIN, 'chico')])
R('Quédate hasta el final', '2D', '«Tú» se acomoda en un sillón con palomitas, listo para ver.',
  [('icono:palomitas', 'Bote de palomitas', 'popcorn icon flat')])

S('SECCIÓN 1 · "Más ricos sin más dinero"')
R('Si miramos la historia', 'FOTO', 'Foto antigua en blanco y negro de una calle de ciudad; zoom lento.',
  [('foto', 'Calle de ciudad antigua en blanco y negro (años 50–70), gente solo de lejos', 'vintage city street black and white 1960s')],
  [('ANTES', CON, 'chico')])
R('hoy vivimos mucho mejor que antes', 'VIDEO', 'La misma idea hoy: ciudad moderna de noche en timelapse.',
  [('video', 'Timelapse de una ciudad moderna de noche con tráfico y luces', 'modern city night timelapse traffic')],
  [('HOY', CON, 'chico')])
R('Piensa en los servicios telefónicos', 'FOTO', 'Teléfono antiguo de disco sobre una mesa.',
  [('foto', 'Teléfono antiguo de disco sobre una mesa de madera, sin personas', 'vintage rotary phone table')])
R('Hace algunos años hacer una llamada era caro', 'VIDEO', 'Mano metiendo monedas en un teléfono público y marcando.',
  [('video', 'Mano metiendo monedas en un teléfono público antiguo', 'hand inserting coins payphone')],
  [('CARO', SIN, 'grande')])
R('se cortaba seguido', '2D', '«Tú» con el auricular en la oreja, cara de fastidio; aparece tu ícono de sin señal.',
  [('icono:sin_senal', 'Señal de teléfono cortada o barras de señal vacías con una X', 'no signal icon flat')])
R('y casi no había opciones de compañías', 'ÍCONOS', 'Un solo edificio de empresa, solito al centro de la pantalla.',
  [('icono:empresa', 'Edificio de empresa o fábrica (genérico, sin logo)', 'company building icon flat')],
  [('SIN OPCIONES', SIN, 'mediano')])
R('Hoy con lo que antes gastabas', 'VIDEO', 'Manos sosteniendo un smartphone moderno y deslizando la pantalla.',
  [('video', 'Manos usando un smartphone moderno (pantalla sin marcas), de cerca', 'hands scrolling smartphone close up')])
R('tienes planes con internet mensajes ilimitados', 'ÍCONOS', 'Tres íconos salen del celular uno por uno: internet, mensajes y videollamada.',
  [('icono:internet', 'Wifi o globo de internet', 'wifi internet icon flat'),
   ('icono:mensajes', 'Burbuja de mensajes', 'chat message bubble icon flat'),
   ('icono:videollamada', 'Cámara de videollamada', 'video call icon flat')], mark='⚡')
R('Por qué', '2D', '«Tú» se rasca la cabeza, pensativo.', txt=[('¿POR QUÉ?', SIN, 'grande')])
R('Porque hay competencia', 'VIDEO', 'Corredores en una pista de atletismo vistos desde atrás, compitiendo.',
  [('video', 'Corredores en pista de atletismo vistos de espaldas o desde lejos', 'runners race track from behind')],
  [('COMPETENCIA', SIN, 'grande')], '⚡')
R('Si una empresa abusa cobrando de más', 'ÍCONOS', 'Tu ícono de empresa con una etiqueta de precio que sube y se pone roja.',
  ['=icono_empresa.png', ('icono:etiqueta_precio', 'Etiqueta de precio', 'price tag icon flat')],
  [('COBRA DE MÁS', SIN, 'mediano')])
R('otra llega con un plan más barato y mejor', 'ÍCONOS', 'Entra una segunda empresa desde el otro lado y empuja a la primera.',
  ['=icono_empresa.png', ('icono:empresa_2', 'Otro edificio de empresa, distinto al primero (otro color o forma)', 'office building icon flat')],
  [('MÁS BARATO Y MEJOR', SIN, 'mediano')])
R('Eso nos beneficia a todos', 'VIDEO', 'Multitud caminando por una calle de la ciudad, vista desde arriba.',
  [('video', 'Multitud caminando por la calle vista desde arriba (sin rostros reconocibles)', 'crowd walking street top view')])
R('Y no solo pasa con la telefonía', '2D', '«Tú» camina de izquierda a derecha, como cambiando de tema.')
R('Piensa en el transporte', 'VIDEO', 'Tráfico de ciudad con taxis.',
  [('video', 'Tráfico de ciudad con taxis (sin placas ni logos legibles)', 'city traffic taxis street')])
R('Antes tomar un taxi era un lujo', 'FOTO', 'Taxi clásico antiguo estacionado.',
  [('foto', 'Taxi clásico antiguo estacionado, sin personas', 'vintage taxi car street')],
  [('UN LUJO', SIN, 'grande')])
R('Hoy tienes aplicaciones de transporte', 'VIDEO', 'Mano con celular mostrando un mapa de app de transporte.',
  [('video', 'Mano con celular mostrando un mapa con un auto acercándose (sin logos de apps)', 'ride hailing app map phone hand')], mark='⚡')
R('saber cuánto vas a pagar', 'ÍCONOS', 'Dos íconos: precio fijo y estrellas de calificación.',
  ['=icono_etiqueta_precio.png', ('icono:estrellas', 'Cinco estrellas de calificación', 'five stars rating icon flat')])
R('Todo más accesible más seguro', 'TEXTO', 'Tres palabras que entran una por una sobre azul marino.',
  txt=[('ACCESIBLE', CON, 'chico'), ('SEGURO', CON, 'chico'), ('BUEN COSTO', CON, 'chico')])
R('Entonces lo que en realidad ha pasado', '2D', '«Tú» con un foco encendido sobre la cabeza.',
  [('icono:foco', 'Foco encendido (idea)', 'light bulb idea icon flat')])
R('aunque no haya más dinero', 'FOTO', 'Alcancía con pocas monedas.',
  [('foto', 'Alcancía o frasco con pocas monedas, sin personas', 'piggy bank few coins')])
R('tenemos más productos y servicios accesibles', 'VIDEO', 'Carrito de supermercado llenándose o tienda con muchos productos.',
  [('video', 'Carrito de supermercado lleno avanzando (manos sin rostro)', 'shopping cart full supermarket')])
R('Y eso también nos hace más ricos', '2D', '«Tú» sonríe; lluvia de tus íconos de productos y estrellas.',
  ['=icono_productos.png', '=icono_estrellas.png'], [('MÁS RICOS', SIN, 'grande')], '⚡')

S('SECCIÓN 2 · "Lo que sí aportan"')
R('Y aquí hay algo importante', '2D', '«Tú» levanta el dedo: «atención».')
R('cuando hablamos de los ricos que sí generan valor', 'VIDEO', 'Empresario de espaldas mirando una fábrica o una ciudad desde una ventana.',
  [('video', 'Persona de traje de espaldas mirando la ciudad por una ventana grande', 'businessman back view window city')],
  [('GENERAN VALOR', SIN, 'mediano')])
R('no estamos hablando solo de su dinero', 'FOTO', 'Pila de billetes que se desvanece.',
  [('foto', 'Pila de billetes sobre fondo liso', 'stack of money plain background')])
R('sino del impacto real', 'VIDEO', 'Gota que cae en el agua y forma ondas, en cámara lenta.',
  [('video', 'Gota cayendo en agua y formando ondas, cámara lenta', 'water drop ripples slow motion')],
  [('IMPACTO', SIN, 'grande')], '⚡')
R('Los beneficios pueden ser directos', 'TEXTO', 'Dos tarjetas lado a lado.',
  txt=[('DIRECTOS', CON, 'mediano'), ('INDIRECTOS', CON, 'mediano')])
R('Primero los beneficios directos', 'TEXTO', 'La tarjeta «DIRECTOS» crece y llena la pantalla (se reutiliza).',
  txt=[('BENEFICIOS DIRECTOS', CON, 'grande')])
R('Creación de empleo', 'VIDEO', 'Trabajadores en una fábrica o almacén, de espaldas o de lejos.',
  [('video', 'Trabajadores en fábrica o almacén (de espaldas, con casco o chaleco)', 'factory workers warehouse back view')],
  [('EMPLEO', SIN, 'grande')])
R('cada empresa desde la más pequeña', 'FOTO', 'Dos fotos que se cruzan: una tiendita de barrio y un edificio corporativo.',
  [('foto', 'Tiendita de barrio o negocio pequeño por fuera, sin personas', 'small local shop storefront'),
   ('foto', 'Rascacielos corporativo visto desde abajo', 'corporate skyscraper low angle', 'rascacielos')])
R('Y cuando un millonario invierte', 'VIDEO', 'Grúa levantando material en una obra nueva.',
  [('video', 'Grúa levantando material en la construcción de un edificio', 'crane construction building lifting')])
R('y eso le cambia la vida a muchas familias', 'VIDEO', 'Familia caminando de espaldas al atardecer, tomados de la mano.',
  [('video', 'Familia caminando de espaldas al atardecer, tomados de la mano', 'family walking back view sunset')], mark='⚡')
R('Filantropía y donaciones', 'FOTO', 'Manos entregando una caja de donación.',
  [('foto', 'Manos entregando una caja de donaciones o víveres', 'hands giving donation box')],
  [('FILANTROPÍA', SIN, 'grande')])
R('muchos empresarios también apoyan fundaciones', 'ÍCONOS', 'Tres íconos: beca, hospital y corazón.',
  [('icono:beca', 'Birrete de graduación (beca)', 'graduation cap icon flat'),
   ('icono:hospital', 'Hospital', 'hospital icon flat'),
   ('icono:corazon', 'Corazón con mano (ayuda social)', 'charity heart hand icon flat')])
R('Tal vez no se anuncian mucho', '2D', '«Tú» se lleva el dedo a la boca: «shhh».')
R('construyendo escuelas', 'VIDEO', 'Salón de clases luminoso, con mochilas y pupitres (niños de espaldas o sin niños).',
  [('video', 'Salón de clases luminoso con pupitres; si hay niños, solo de espaldas', 'classroom bright desks empty')])
R('financiando investigaciones', 'VIDEO', 'Manos con guantes en un laboratorio usando una pipeta.',
  [('video', 'Manos con guantes en un laboratorio usando pipeta o microscopio', 'laboratory hands pipette research')])
R('Ahora los beneficios indirectos', 'TEXTO', 'La tarjeta «INDIRECTOS» crece y llena la pantalla.',
  txt=[('BENEFICIOS INDIRECTOS', CON, 'grande')])
R('Innovación y tecnología', 'VIDEO', 'Macro de un chip o placa de circuito con luces.',
  [('video', 'Macro de un chip o placa de circuito con luces moviéndose', 'circuit board macro technology lights')],
  [('INNOVACIÓN', SIN, 'grande')])
R('cuando una empresa compite por ser la mejor', 'ÍCONOS', 'Trofeo que aparece entre tus dos íconos de empresa.',
  ['=icono_empresa.png', '=icono_empresa_2.png', ('icono:trofeo', 'Trofeo dorado', 'trophy icon flat gold')])
R('desde los teléfonos que usamos', 'VIDEO', 'Celular moderno girando sobre fondo oscuro.',
  [('video', 'Smartphone moderno girando sobre fondo oscuro (sin marca visible)', 'smartphone rotating dark background product')])
R('hasta los medicamentos que salvan vidas', 'FOTO', 'Pastillas y cápsulas de cerca.',
  [('foto', 'Pastillas y cápsulas de colores de cerca', 'pills capsules macro')])
R('Pago de impuestos', 'ÍCONOS', 'Tu ícono de impuestos, grande al centro.',
  ['=icono_impuestos.png'], [('IMPUESTOS', SIN, 'grande')])
R('los impuestos que pagan las grandes empresas también financian carreteras', 'VIDEO', 'Carretera vista desde un dron; aparecen encima tus íconos de hospital y escuela.',
  [('video', 'Carretera con autos vista desde dron', 'aerial highway cars drone'), '=icono_hospital.png',
   ('icono:escuela', 'Escuela', 'school building icon flat')])
R('Muchos de estos beneficios ocurren sin que lo pensemos', '2D', '«Tú» camina por la calle sin darse cuenta de los íconos que flotan a su alrededor.',
  ['=icono_hospital.png', '=icono_escuela.png', '=icono_internet.png'])
R('moviendo la economía', 'VIDEO', 'Engranajes girando de cerca.',
  [('video', 'Engranajes metálicos girando de cerca', 'gears turning macro')])

S('SECCIÓN 3 · "La parte que casi nadie dice"')
R('Ahora aquí hay algo que pocas veces se dice', '2D', '«Tú» se acerca a la cámara, como contando un secreto.', mark='🪝')
R('la riqueza no la generan solo los empresarios', 'TEXTO', 'Frase grande sobre azul marino.',
  txt=[('NO SOLO LOS EMPRESARIOS', CON, 'grande')], mark='⚡')
R('Claro ellos arriesgan invierten', 'FOTO', 'Manos firmando un contrato sobre un escritorio.',
  [('foto', 'Manos firmando un contrato sobre un escritorio', 'hands signing contract desk')])
R('Pero quién produce realmente', '2D', '«Tú» mira a los lados, buscando.', txt=[('¿QUIÉN PRODUCE?', SIN, 'grande')])
R('Los trabajadores', 'VIDEO', 'Línea de producción con manos trabajando rápido.',
  [('video', 'Manos trabajando en una línea de producción', 'production line workers hands')],
  [('LOS TRABAJADORES', SIN, 'grande')], '⚡')
R('Sin los empleados que fabrican', 'FOTO', 'Tres fotos rápidas: fabricar, atender y repartir.',
  [('foto', 'Fabricar: manos de un obrero soldando o armando algo', 'worker hands welding'),
   ('foto', 'Atender: manos de un cajero cobrando en una tienda', 'cashier hands store counter'),
   ('foto', 'Distribuir: repartidor de espaldas con cajas', 'delivery man back view boxes')])
R('ninguna empresa podría existir', 'ÍCONOS', 'Tu ícono de empresa se queda vacío y se desvanece.',
  ['=icono_empresa.png'])
R('Es un esfuerzo compartido', 'VIDEO', 'Manos de varias personas juntándose al centro (equipo).',
  [('video', 'Manos de un equipo juntándose al centro', 'team hands together stack', 'equipo')],
  [('ESFUERZO COMPARTIDO', SIN, 'mediano')])
R('Además muchas veces son los trabajadores', 'VIDEO', 'Equipo pegando notas adhesivas en una pizarra (de espaldas); aparece tu foco.',
  [('video', 'Equipo de trabajo pegando notas adhesivas en una pizarra, de espaldas', 'team sticky notes whiteboard back view'),
   '=icono_foco.png'])
R('que hacen que la empresa crezca', 'ÍCONOS', 'Tu ícono de empresa crece y de él salen tus íconos de productos y estrellas.',
  ['=icono_empresa.png', '=icono_productos.png', '=icono_estrellas.png'])

S('SECCIÓN 4 · "Un país rico"')
R('Un país es rico cuando su gente trabaja', 'VIDEO', 'Puerto con contenedores y un barco de carga, desde un dron.',
  [('video', 'Puerto con contenedores y barco de carga visto desde dron', 'cargo port containers ship aerial')],
  [('UN PAÍS RICO', SIN, 'grande')], '⚡')
R('Si tu vecino tiene una empresa que exporta', 'FOTO', 'Cajas listas para envío en una bodega.',
  [('foto', 'Cajas de cartón listas para envío en una bodega (sin logos)', 'shipping boxes warehouse')])
R('Pero también suma cada trabajador', 'VIDEO', 'Trabajador de espaldas cargando cajas.',
  [('video', 'Trabajador de espaldas cargando cajas en una bodega', 'worker carrying boxes back view')])
R('Y si hablamos de pequeños productores', 'VIDEO', 'Manos de un agricultor cosechando café o fruta.',
  [('video', 'Manos de agricultor cosechando café o fruta', 'farmer hands harvesting coffee')])
R('cuando crean algo tan bueno que se vende afuera', 'ÍCONOS', 'Un globo terráqueo con flechas que salen hacia otros países.',
  [('icono:mundo', 'Globo terráqueo con flechas (exportar)', 'globe export arrows icon flat')])
R('Un país no progresa si solo unos pocos', 'ÍCONOS', 'Gráfica de pastel donde una rebanada enorme se queda con casi todo.',
  [('icono:pastel', 'Gráfica de pastel con una rebanada muy grande', 'pie chart icon flat')],
  [('SOLO UNOS POCOS', SIN, 'mediano')])
R('La riqueza se fortalece cuando la mayoría', 'ÍCONOS', 'Tres íconos: educación, salud y servicios.',
  ['=icono_beca.png', '=icono_hospital.png', ('icono:servicios', 'Servicios: grifo de agua o foco y enchufe', 'utilities water electricity icon flat')])
R('La economía no se sostiene solo desde arriba', 'FOTO', 'Edificio visto desde abajo; la cámara baja hasta la calle.',
  ['=@rascacielos'], [('DESDE ABAJO', SIN, 'grande')])
R('con millones de personas trabajando', 'VIDEO', 'Timelapse de gente cruzando una avenida, desde arriba.',
  [('video', 'Timelapse de gente cruzando una avenida, vista desde arriba', 'people crossing street timelapse top view')])
R('para que haya comida en la mesa', 'VIDEO', 'Mesa servida con comida casera.',
  [('video', 'Mesa servida con comida casera, sin personas (o solo manos)', 'family dinner table food')])

S('SECCIÓN 5 · Cierre: "El juego de la economía"')
R('Al final la economía es un juego', 'FOTO', 'Tablero de ajedrez con piezas.',
  [('foto', 'Tablero de ajedrez con piezas, luz dramática', 'chess board pieces dramatic light')],
  [('UN JUEGO', SIN, 'grande')], '⚡')
R('Y si no sabes jugarlo', 'VIDEO', 'El rey del ajedrez cae en cámara lenta.',
  [('video', 'Pieza de ajedrez (rey) cayendo en cámara lenta', 'chess king falling slow motion')],
  [('PIERDES', SIN, 'grande')])
R('Y la única salida es que la gente innove', 'ÍCONOS', 'Tres íconos: innovar, crear y vender al mundo.',
  ['=icono_foco.png', ('icono:herramientas', 'Herramientas (crear)', 'tools icon flat'), '=icono_mundo.png'])
R('pero también que valoremos a quienes trabajan', 'VIDEO', 'Trabajador de espaldas al atardecer, terminando su jornada.',
  [('video', 'Trabajador de espaldas al atardecer (casco o ropa de trabajo)', 'worker silhouette sunset back view')])
R('Porque sin empleados no hay empresas', 'TEXTO', 'Frase grande en dos líneas.',
  txt=[('SIN EMPLEADOS NO HAY EMPRESAS', CON, 'grande')])
R('Y cuando todos sumamos', 'VIDEO', 'Vuelven las manos del equipo juntándose.',
  ['=@equipo'], [('TODOS SUMAMOS', SIN, 'grande')], '⚡')
R('y hace que todos tengamos mejores oportunidades', '2D', '«Tú» sonríe; a su alrededor flotan tus íconos de empleo, beca y hospital.',
  ['=icono_empleo.png', '=icono_beca.png', '=icono_hospital.png'], [('MEJORES OPORTUNIDADES', SIN, 'mediano')])
R('Ahora quiero saber qué piensas tú', '2D', '«Tú» mira a cámara con un globo de comentario.',
  [('icono:comentario', 'Globo de comentario', 'comment speech bubble icon flat')],
  [('¿SE REPARTE DE FORMA JUSTA?', CON, 'mediano')])
R('Déjamelo en los comentarios', '2D', '«Tú» escribe en su celular; caen varios globos de comentario.',
  ['=icono_comentario.png'], [('DÉJAMELO EN LOS COMENTARIOS', SIN, 'mediano')])
R('Y si este video te hizo reflexionar', '2D', 'Pantalla final: «Tú» saluda; tus íconos de like y compartir; espacio libre para los elementos de pantalla final de YouTube (12 s).',
  [('icono:like', 'Pulgar arriba (like)', 'thumbs up like icon flat'),
   ('icono:compartir', 'Flecha de compartir', 'share arrow icon flat')],
  [('SUSCRÍBETE', CON, 'chico')])
R('Así seguimos creando juntos', '2D', 'Pantalla final de 12 s: «Tú» saluda junto al espacio libre para los elementos de pantalla final de YouTube.',
  ['=icono_like.png'])

# Textos en pantalla de los shorts (el resto de los recursos de los shorts se reutiliza del largo).
# En los shorts el texto no repite lo que dicen los subtítulos en ese momento: son ganchos que no se narran.
SHORT_TXT = [
    ('texto_short1.png', '¿ERES MÁS RICO?', 'con fondo', 'Short 1, primeros 3 s, arriba'),
    ('texto_short2.png', 'NADIE LO DICE', 'con fondo', 'Short 2, primeros 3 s, arriba'),
    ('texto_short3.png', '¿CUÁL CONOCES?', 'con fondo', 'Short 3, primeros 3 s, arriba'),
]

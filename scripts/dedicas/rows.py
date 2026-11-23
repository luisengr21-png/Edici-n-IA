# Escenas de «¿A qué te dedicas?».
# R(frase con la que empieza, visual, descripción, rec=[recursos], txt=[(texto, 'sin'|'con' fondo, 'grande'|'mediano'|'chico')], mark)
# Recursos: ('video', qué es, palabras clave[, apodo]) · ('foto', …) · ('icono:NOMBRE', …) · '=archivo' o '=@apodo' para reutilizar uno ya pedido.
SIN, CON = 'sin', 'con'
G, M, C = 'grande', 'mediano', 'chico'

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 0 · Gancho: "Los tres segundos"')
R('Estás en una fiesta', 'VIDEO', 'Fiesta en una casa: gente platicando con vasos en la mano, luces cálidas.',
  [('video', 'Fiesta en una casa, gente platicando con vasos en la mano, luces cálidas', 'house party people talking drinks warm lights', 'fiesta')], mark='⚡')
R('Alguien que acabas de conocer te sonríe', 'VIDEO', 'Una persona sonríe a cámara con su vaso, plano medio.',
  [('video', 'Persona sonriendo a cámara con un vaso en la mano en una fiesta, plano medio', 'smiling person holding drink party medium shot', 'sonrisa')])
R('Y tú a qué te dedicas', 'TEXTO', 'La pregunta enorme, en blanco, sobre fondo azul noche.', txt=[('¿Y TÚ A QUÉ TE DEDICAS?', CON, G)], mark='🪝')
R('Tienes unos tres segundos', '2D', '«Tú» nervioso, sudando; un cronómetro corre a su lado.',
  [('icono:cronometro', 'Cronómetro', 'stopwatch icon flat')], [('3 SEGUNDOS', SIN, M)])
R('Tres segundos para ver cómo su cara decide', 'VIDEO', 'Primer plano de alguien escuchando y evaluando, con una ceja levantada.',
  [('video', 'Primer plano de una persona escuchando con mirada de evaluación, ceja levantada', 'person listening skeptical look close up', 'juicio')])
R('o si de pronto necesita ir por otra bebida', 'VIDEO', 'Alguien se da la vuelta y se aleja hacia la barra.',
  [('video', 'Persona en una fiesta que se da la vuelta y se aleja hacia la barra', 'person walking away at party bar')])
R('Si dices soy cirujano', 'FOTO', 'Cirujano con bata y cofia, sonriente.',
  [('foto', 'Cirujano con bata y cofia, sonriente', 'surgeon portrait smiling scrubs')], [('CIRUJANO', CON, C)])
R('te hace más preguntas', 'VIDEO', 'La persona de la fiesta sonriendo, ahora muy interesada.', ['=@sonrisa'])
R('Si dices estoy buscando trabajo', 'FOTO', 'Persona revisando ofertas de empleo en su laptop, cansada.',
  [('foto', 'Persona revisando ofertas de empleo en una laptop, cansada', 'job search laptop tired person')], [('BUSCANDO TRABAJO', CON, C)])
R('de repente ve a un amigo', 'VIDEO', 'Alguien saluda a otra persona a lo lejos y se va.',
  [('video', 'Persona en una fiesta que saluda a alguien a lo lejos y se va hacia allá', 'person waving to friend across room party leaving')], mark='⚡')
R('Te ha pasado', '2D', '«Tú» pensativo, con la mano en la barbilla.')
R('O peor has sido tú el que se va', '2D', '«Tú» avergonzado, rascándose la nuca.')
R('Esa pregunta tan pequeña esconde', 'ÍCONOS', 'Un signo de interrogación pequeño que crece hasta llenar la pantalla, con una nube de tormenta.',
  [('icono:interrogacion', 'Signo de interrogación', 'question mark icon flat'), ('icono:tormenta', 'Nube de tormenta', 'storm cloud icon flat')])
R('Al final te voy a dar tres ideas', '2D', '«Tú» levanta la mano, esperanzado.', txt=[('3 IDEAS', CON, M)], mark='🪝')
R('ya no se te encoja el estómago', '2D', '«Tú» se toca el estómago y luego respira aliviado.')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 1 · "Un mundo de engreídos"')
R('Primero hay que ponerle nombre al problema', '2D', '«Tú» con una etiqueta en blanco en la mano.',
  [('icono:etiqueta', 'Etiqueta en blanco', 'blank tag label icon flat')])
R('Vivimos rodeados de engreídos', 'VIDEO', 'Gente elegante en un evento, brindando y mirando por encima del hombro.',
  [('video', 'Gente elegante en un evento formal brindando, mirando por encima del hombro', 'elegant people gala toast snobby', 'elegantes')],
  [('ENGREÍDOS', SIN, G)], '⚡')
R('Personas que toman una pequeña parte de ti', 'ÍCONOS', 'Tres íconos uno por uno: maletín, birrete y gafete.',
  [('icono:maletin', 'Maletín (trabajo)', 'briefcase icon flat'), ('icono:birrete', 'Birrete (título)', 'graduation cap icon flat'),
   ('icono:gafete', 'Gafete de empleado (puesto)', 'employee id badge icon flat')])
R('y con eso deciden cuánto vales', '2D', '«Tú» con una etiqueta de precio colgando del cuello.',
  [('icono:etiqueta_precio', 'Etiqueta de precio', 'price tag icon flat')], [('¿CUÁNTO VALES?', SIN, M)])
R('Es como juzgar una película entera', 'VIDEO', 'Tira de película pasando por un proyector antiguo.',
  [('video', 'Tira de película pasando por un proyector antiguo, de cerca', 'film reel projector close up', 'pelicula')], [('UN SOLO CUADRO', SIN, M)])
R('Y sabes quién es lo contrario de un engreído', '2D', '«Tú» curioso, acercándose a la cámara.', mark='🪝')
R('Tu mamá', 'FOTO', 'Una mamá abrazando con cariño a su hijo adulto.',
  [('foto', 'Mamá abrazando con cariño a su hijo adulto', 'mother hugging adult son warm', 'mama')], [('TU MAMÁ', SIN, G)], '⚡')
R('A tu mamá no le importa si eres gerente', 'ÍCONOS', 'Tu maletín y una caja de cartón de despido, uno junto al otro; los dos se desvanecen.',
  ['=icono_maletin.png', ('icono:caja_despido', 'Caja de cartón con cosas de oficina (despido)', 'cardboard box office things fired icon')])
R('Le importa si comiste', 'VIDEO', 'Manos sirviendo un plato de comida casera.',
  [('video', 'Manos sirviendo un plato de comida casera en la mesa', 'hands serving homemade food plate')])
R('Le interesas tú no tu estatus', 'FOTO', 'La mamá abrazando a su hijo otra vez, zoom lento.', ['=@mama'], [('TÚ, NO TU ESTATUS', CON, M)])
R('El problema es que el mundo no está lleno de mamás', 'VIDEO', 'Multitud apresurada en la ciudad; nadie se mira.',
  [('video', 'Multitud caminando apresurada en la ciudad, nadie se mira', 'busy crowd city walking rush', 'multitud')])
R('Y por eso vivimos con ese miedo', '2D', '«Tú» encogido y preocupado; muchos ojos lo miran desde la oscuridad.',
  [('icono:ojos', 'Muchos ojos mirando', 'many eyes watching icon')], [('JUZGADOS', SIN, M)])
R('Pero aguanta porque para entender', '2D', '«Tú» levanta la mano: «espera».', mark='🪝')
R('hay que hablar de un Ferrari', 'VIDEO', 'Un auto deportivo rojo pasa rugiendo por la calle.',
  [('video', 'Auto deportivo rojo pasando por la calle', 'red sports car driving street', 'ferrari')], mark='⚡')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 2 · "Lo que de verdad compra un Ferrari"')
R('Dicen que vivimos en una época materialista', 'VIDEO', 'Persona cargando bolsas de compras de lujo por una avenida.',
  [('video', 'Persona cargando muchas bolsas de compras de lujo por una avenida', 'shopping bags luxury woman walking')])
R('Yo creo que es algo más triste', '2D', '«Tú» se pone serio.')
R('Vivimos en una época en la que el cariño', 'ÍCONOS', 'Un corazón pegado con cinta a una bolsa de compras.',
  [('icono:corazon', 'Corazón', 'heart icon flat'), ('icono:bolsa_compras', 'Bolsa de compras', 'shopping bag icon flat')])
R('Piénsalo Alguien quiere un reloj carísimo', 'FOTO', 'Reloj de lujo en una muñeca, de cerca.',
  [('foto', 'Reloj de lujo en una muñeca, de cerca', 'luxury watch wrist close up', 'reloj')])
R('Marca la misma hora que tu celular', 'FOTO', 'Pantalla de bloqueo de un celular con la hora.',
  [('foto', 'Pantalla de bloqueo de un celular mostrando la hora', 'smartphone lock screen time')], [('LA MISMA HORA', SIN, M)], '⚡')
R('Lo que la gente busca cuando persigue dinero', 'ÍCONOS', 'Tres íconos: fajo de billetes, tu maletín y un auto de lujo.',
  [('icono:dinero', 'Fajo de billetes', 'money stack icon flat'), '=icono_maletin.png', ('icono:auto_lujo', 'Auto deportivo', 'sports car icon flat')])
R('casi nunca es eso en sí', '2D', '«Tú» niega con la cabeza, sonriendo.')
R('Es lo que viene con eso', 'VIDEO', 'Alguien entra a un salón y la gente voltea a verlo y aplaude.',
  [('video', 'Persona entra a un salón y la gente voltea a verla y aplaude', 'people applauding person entering room')])
R('que la miren que la escuchen', 'ÍCONOS', 'Tres íconos al ritmo de la voz: ojo, oreja y manos aplaudiendo.',
  [('icono:ojo', 'Ojo (que te miren)', 'eye icon flat'), ('icono:oreja', 'Oreja (que te escuchen)', 'ear listening icon flat'),
   ('icono:aplauso', 'Manos aplaudiendo (respeto)', 'clapping hands icon flat')])
R('Es una forma de amor', 'FOTO', 'Un corazón de luz neón cálida.',
  [('foto', 'Corazón de luz neón cálida sobre fondo oscuro', 'neon heart warm light dark')], [('UNA FORMA DE AMOR', SIN, M)], '⚡')
R('La próxima vez que veas a alguien manejando un Ferrari', 'VIDEO', 'El auto deportivo rojo otra vez.', ['=@ferrari'])
R('no pienses qué tipo tan codicioso', '2D', '«Tú» frunce el ceño, desconfiado.', txt=[('¿CODICIOSO?', SIN, M)])
R('Piensa ahí va alguien que necesita', 'VIDEO', 'Una persona sola manejando de noche, pensativa.',
  [('video', 'Persona sola manejando de noche, mirada pensativa, luces de la ciudad', 'lonely man driving at night thoughtful')],
  [('NECESITA QUE LO QUIERAN', SIN, M)], '⚡')
R('Suena raro verdad', '2D', '«Tú» sorprendido, con los ojos muy abiertos.', mark='🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 3 · "El peso de «puedes ser lo que quieras»"')
R('Puedes ser lo que tú quieras', 'VIDEO', 'Niños jugando disfrazados de astronauta, doctor y bombero.',
  [('video', 'Niños jugando disfrazados de astronauta, doctor y bombero', 'kids playing costumes astronaut doctor firefighter')],
  [('¡LO QUE QUIERAS!', SIN, M)])
R('Lo escuchamos desde niños', 'FOTO', 'Niño con capa de superhéroe mirando al cielo.',
  [('foto', 'Niño con capa de superhéroe mirando al cielo', 'child superhero cape looking sky')])
R('Y suena precioso tantas puertas abiertas', 'VIDEO', 'Un pasillo lleno de puertas que se abren una tras otra.',
  [('video', 'Pasillo con muchas puertas que se abren', 'many doors opening corridor', 'puertas')])
R('Pero hazte esta pregunta', '2D', '«Tú» tenso, mirando de reojo.', mark='🪝')
R('qué pasa si con todas esas puertas abiertas', 'VIDEO', 'Persona subiendo una escalera larga, cansada, que se detiene.',
  [('video', 'Persona subiendo una escalera larga, cansada, que se detiene a mitad', 'tired person climbing long stairs stops')])
R('Si tenías todo para llegar a la cima', 'FOTO', 'Cima de una montaña con una bandera, vista desde abajo.',
  [('foto', 'Cima de una montaña con una bandera, vista desde abajo', 'mountain summit flag from below')], [('¿DE QUIÉN ES LA CULPA?', CON, M)], '⚡')
R('Entra a la sección de autoayuda', 'VIDEO', 'Pasillo de una librería; una mano toma un libro.',
  [('video', 'Pasillo de librería, una mano toma un libro del estante', 'bookstore aisle hand picking book', 'libreria')])
R('Unos dicen Triunfa en quince minutos', 'ÍCONOS', 'Dos portadas de libro doradas y brillantes, como de autoayuda.',
  [('icono:libro_exito', 'Libro dorado brillante (autoayuda de éxito)', 'golden book success icon')],
  [('TRIUNFA EN 15 MINUTOS', CON, C), ('MILLONARIO DE LA NOCHE A LA MAÑANA', CON, C)])
R('Y justo al lado otros dicen', 'ÍCONOS', 'Al lado, un libro gris con una nube.',
  [('icono:libro_triste', 'Libro gris con nubecita (autoayuda de autoestima)', 'gray book sad cloud icon')],
  [('CÓMO LIDIAR CON LA BAJA AUTOESTIMA', CON, C)])
R('No es casualidad son dos caras', 'ÍCONOS', 'Una moneda que gira mostrando sus dos caras.',
  [('icono:moneda', 'Moneda', 'coin icon flat')], [('DOS CARAS', SIN, M)])
R('Una sociedad que te promete que puedes tenerlo todo', 'VIDEO', 'Anuncios luminosos gigantes en una avenida de noche.',
  [('video', 'Anuncios luminosos gigantes en una avenida de noche (sin marcas legibles)', 'city billboards lights night')])
R('cuando en realidad solo unos pocos lo consiguen', 'ÍCONOS', 'Un podio con un solo ganador y una fila enorme abajo.',
  [('icono:podio', 'Podio con un solo ganador', 'podium winner icon flat')])
R('fabrica algo en serie', 'VIDEO', 'Línea de producción en serie de una fábrica.',
  [('video', 'Línea de producción en serie de una fábrica', 'factory assembly line mass production')])
R('gente insatisfecha', 'VIDEO', 'Persona mirando por la ventana, triste.',
  [('video', 'Persona mirando por la ventana con tristeza', 'sad person looking out window', 'ventana')], [('INSATISFECHA', SIN, M)], '⚡')
R('Y todavía falta la parte más cruel', '2D', '«Tú» asustado.', mark='🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 4 · "La trampa de la meritocracia"')
R('Nos han dicho que vivimos en meritocracias', 'VIDEO', 'Graduación: birretes lanzados al aire.',
  [('video', 'Graduación con birretes lanzados al aire', 'graduation caps thrown air', 'graduacion')], [('MERITOCRACIA', SIN, G)])
R('sociedades justas donde llega arriba', 'ÍCONOS', 'Una escalera hacia arriba y una balanza equilibrada.',
  [('icono:escalera', 'Escalera hacia arriba', 'stairs up icon flat'), ('icono:balanza', 'Balanza equilibrada', 'balance scale icon flat')])
R('Hace siglos todos sabían que el juego estaba arreglado', 'FOTO', 'Castillo medieval en lo alto de una colina.',
  [('foto', 'Castillo medieval en lo alto de una colina', 'medieval castle hill', 'castillo')], [('JUEGO ARREGLADO', SIN, M)])
R('Si nacías campesino', 'FOTO', 'Pintura antigua de campesinos trabajando el campo.',
  [('foto', 'Pintura antigua (dominio público) de campesinos medievales trabajando el campo', 'medieval peasants painting field work')])
R('Y si nacías señor feudal', 'FOTO', 'Pintura antigua de un noble medieval o una corona sobre un cojín.',
  [('foto', 'Pintura antigua de un noble medieval, o una corona sobre un cojín', 'medieval lord painting nobleman')])
R('Hoy la meritocracia suena hermosa', 'VIDEO', 'La graduación otra vez, en cámara lenta.', ['=@graduacion'])
R('Pero tiene un lado oscuro', '2D', '«Tú» serio; la pantalla se oscurece.', mark='🪝')
R('Si de verdad crees que los que están arriba', 'VIDEO', 'Persona en una oficina en lo alto de un rascacielos, mirando la ciudad.',
  [('video', 'Persona en una oficina en lo alto de un rascacielos mirando la ciudad', 'executive office skyscraper view')])
R('entonces también tienes que creer', 'VIDEO', 'Persona sin hogar sentada en la calle.',
  [('video', 'Persona sin hogar sentada en la calle', 'homeless person sitting street')], mark='⚡')
R('Ahí está la trampa', 'TEXTO', 'Texto grande en rojo.', txt=[('LA TRAMPA', CON, G)])
R('La meritocracia no solo hace que la pobreza', 'FOTO', 'Casa humilde de barrio.',
  [('foto', 'Casa humilde de barrio', 'poor neighborhood house')])
R('Hace que parezca merecida', 'TEXTO', 'Texto grande con signos de pregunta.', txt=[('¿MERECIDA?', SIN, G)], mark='⚡')
R('Mira cómo ha cambiado el lenguaje', '2D', '«Tú» sorprendido.')
R('En la Inglaterra medieval a los pobres', 'FOTO', 'Grabado antiguo de la Rueda de la Fortuna.',
  [('foto', 'Grabado o pintura antigua de la Rueda de la Fortuna (dominio público)', 'medieval wheel of fortune illustration')], [('DESAFORTUNADOS', CON, M)])
R('gente a la que la diosa Fortuna', 'ÍCONOS', 'Una rueda de la fortuna dorada que gira despacio.',
  [('icono:rueda_fortuna', 'Rueda de la fortuna (rueda dorada antigua)', 'wheel of fortune icon gold')])
R('Hoy sobre todo en Estados Unidos', 'VIDEO', 'Calle de una ciudad estadounidense con una bandera.',
  [('video', 'Calle de una ciudad estadounidense con bandera ondeando', 'american city street flag')])
R('perdedores', 'ÍCONOS', 'Una mano haciendo la «L» de perdedor sobre la frente.',
  [('icono:perdedor', 'Mano haciendo la «L» de perdedor', 'loser hand sign L icon')], [('PERDEDORES', SIN, G)], '⚡')
R('Ya casi nadie cree en la suerte', 'ÍCONOS', 'Un trébol de cuatro hojas que se marchita.',
  [('icono:trebol', 'Trébol de cuatro hojas', 'four leaf clover icon flat')])
R('Intenta decir en una entrevista', 'VIDEO', 'Entrevista de trabajo: el entrevistador escucha con escepticismo.',
  [('video', 'Entrevista de trabajo, entrevistador escuchando con escepticismo', 'job interview skeptical interviewer')])
R('a ver qué cara ponen', '2D', '«Tú» incómodo, jalándose el cuello de la sudadera.')
R('Tu trabajo se volvió el veredicto final', 'ÍCONOS', 'Un mazo de juez golpea tu gafete.',
  [('icono:mazo', 'Mazo de juez', 'judge gavel icon flat'), '=icono_gafete.png'], [('EL VEREDICTO', SIN, M)])
R('Y eso pesa', 'VIDEO', 'Persona con la cabeza entre las manos frente a su escritorio.',
  [('video', 'Persona con la cabeza entre las manos frente a su escritorio', 'stressed person head in hands desk')])
R('Hace más de un siglo el sociólogo', 'FOTO', 'Retrato antiguo de Émile Durkheim o libro antiguo abierto.',
  [('foto', 'Retrato antiguo de Émile Durkheim (dominio público) o un libro antiguo abierto', 'emile durkheim portrait')], [('ÉMILE DURKHEIM, 1897', CON, C)])
R('cuando una sociedad se moderniza', 'VIDEO', 'Timelapse de una ciudad que crece.',
  [('video', 'Timelapse de una ciudad moderna creciendo', 'city growth timelapse construction skyline')])
R('las tasas de suicidio tienden a subir', 'ÍCONOS', 'Gráfica sobria con una línea que sube, en gris.',
  [('icono:grafica_sube', 'Gráfica con línea que sube (gris, sobria)', 'line chart rising icon gray')])
R('Entonces cómo salimos de esto', '2D', '«Tú» mira hacia arriba, con esperanza.', mark='🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 5 · "Tres salidas"')
R('Aquí van tres ideas', 'TEXTO', 'Texto grande sobre azul noche.', txt=[('3 SALIDAS', CON, G)], mark='⚡')
R('Uno no te creas del todo el cuento', 'ÍCONOS', 'Un dado al centro.',
  [('icono:dado', 'Dado (la suerte)', 'dice icon flat')], [('1. LA SUERTE CUENTA', CON, M)])
R('La suerte y mil accidentes', 'VIDEO', 'Dados rodando sobre una mesa.',
  [('video', 'Dados rodando sobre una mesa, cámara lenta', 'dice rolling table slow motion')])
R('Así que no trates a nadie', '2D', '«Tú» con la mano en el pecho, sonriendo.')
R('Dos crea tu propia definición de éxito', 'ÍCONOS', 'Un lápiz que escribe sobre un trofeo.',
  [('icono:lapiz', 'Lápiz escribiendo', 'pencil writing icon flat'), ('icono:trofeo', 'Trofeo', 'trophy icon flat')], [('2. TU PROPIO ÉXITO', CON, M)])
R('Hay muchas formas de ganar en la vida', 'VIDEO', 'Papá jugando con su hijo en un parque.',
  [('video', 'Papá jugando con su hijo en un parque', 'father playing with son park')])
R('ser el amigo al que todos llaman', 'VIDEO', 'Amigos riendo juntos en una mesa.',
  [('video', 'Amigos riendo juntos en una mesa', 'friends laughing together table', 'amigos')])
R('tener paz', 'VIDEO', 'Persona sentada frente al mar al atardecer, tranquila.',
  [('video', 'Persona sentada frente al mar al atardecer, tranquila', 'person sitting by sea sunset peaceful')], mark='⚡')
R('Porque los que son buenísimos para hacer dinero', 'VIDEO', 'Ejecutivo mirando el celular en la cena mientras su familia lo espera.',
  [('video', 'Ejecutivo mirando el celular en la cena familiar mientras su familia lo espera', 'businessman on phone family dinner ignoring')])
R('Y tres la más importante', 'TEXTO', 'Texto grande en ámbar.', txt=[('3. NO ERES TU PUESTO', CON, M)], mark='⚡')
R('no dejes que tus logros de afuera', 'FOTO', 'Una mano entregando una tarjeta de presentación.',
  [('foto', 'Mano entregando una tarjeta de presentación', 'hand giving business card', 'tarjeta')])
R('Hay partes de ti que nunca van a aparecer', 'FOTO', 'La tarjeta de presentación otra vez, zoom lento.', ['=@tarjeta'])
R('tu humor', 'VIDEO', 'Persona riéndose a carcajadas.',
  [('video', 'Persona riéndose a carcajadas', 'person laughing out loud')])
R('tu forma de cuidar a los tuyos', 'VIDEO', 'Manos de un adulto sosteniendo las manos de una persona mayor.',
  [('video', 'Manos de un adulto sosteniendo las manos de una persona mayor', 'holding elderly hands care')])
R('lo que te hace reír', 'VIDEO', 'Los amigos riendo otra vez.', ['=@amigos'])
R('Nada de eso cabe en la respuesta', '2D', '«Tú» con una tarjeta de presentación demasiado pequeña en la mano.',
  [('icono:tarjeta', 'Tarjeta de presentación', 'business card icon flat')])

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 6 · Cierre: "La pregunta, otra vez"')
R('Y tú a qué te dedicas', 'VIDEO', 'La persona de la fiesta, en cámara lenta.', ['=@sonrisa'])
R('La próxima vez que te la hagan respira', '2D', '«Tú» respira hondo y sonríe.')
R('Y recuerda que esa respuesta es solo un cuadro', 'VIDEO', 'La tira de película otra vez.', ['=@pelicula'])
R('Y que tu película es mucho más larga', 'FOTO', 'Sala de cine con la luz del proyector.',
  [('foto', 'Sala de cine con la luz del proyector encendida', 'cinema projector light beam theater')], [('TU PELÍCULA ES MÁS LARGA', SIN, M)], '⚡')
R('Ahora te pregunto yo', '2D', '«Tú» señala a la cámara.')
R('si no pudieras hablar de tu trabajo', 'ÍCONOS', 'Tu gafete con una X roja encima.',
  ['=icono_gafete.png', ('icono:x_roja', 'X roja grande', 'red x cross icon')], [('¿CÓMO TE PRESENTARÍAS?', CON, M)], '🪝')
R('Déjamelo en los comentarios', '2D', '«Tú» escribe en su celular; caen globos de comentario.',
  [('icono:comentario', 'Globo de comentario', 'comment speech bubble icon flat')], [('TE LEO EN LOS COMENTARIOS', SIN, M)])
R('Si este video te hizo sentir más ligero', '2D', '«Tú» sonríe; aparecen los íconos de like y compartir.',
  [('icono:like', 'Pulgar arriba (like)', 'thumbs up like icon flat'), ('icono:compartir', 'Flecha de compartir', 'share arrow icon flat')])
R('y suscríbete', '2D', '«Tú» toca una campana.',
  [('icono:campana', 'Campana de notificaciones', 'notification bell icon flat')], [('SUSCRÍBETE', CON, C)])
R('Aquí nadie te va a preguntar', '2D', 'Pantalla final de 12 s: «Tú» saluda junto al espacio libre para los elementos de pantalla final de YouTube.', ['=icono_like.png'])

# Textos en pantalla de los shorts (el resto de los recursos de los shorts se reutiliza del largo).
SHORT_TXT = [
    ('texto_short1.png', 'LOS 3 SEGUNDOS', 'con fondo', 'Short 1, primeros 3 s, arriba'),
    ('texto_short2.png', 'NO ES AVARICIA', 'con fondo', 'Short 2, primeros 3 s, arriba'),
    ('texto_short3.png', '¿TE LO MERECES?', 'con fondo', 'Short 3, primeros 3 s, arriba'),
]

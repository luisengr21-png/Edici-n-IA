# Escenas de «Tienes trabajo… pero estás subempleado» (video 6).
# R(frase con la que empieza, visual, descripción, rec=[recursos], txt=[(texto, 'sin'|'con' fondo, 'grande'|'mediano'|'chico')], mark)
# Recursos: ('video', qué es, palabras clave[, apodo]) · ('foto', …) · ('icono:NOMBRE', …) · '=archivo' o '=@apodo' para reutilizar uno ya pedido.
# Regla del canal: el creador pone videos y fotos; los íconos y los textos los hago yo con código.
SIN, CON = 'sin', 'con'
G, M, C = 'grande', 'mediano', 'chico'

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 0 · Gancho: "El hombre de los volantes"')
R('Son las once de la mañana en Las Vegas', 'VIDEO', 'La avenida principal de Las Vegas de día, con sol fuerte y hoteles al fondo.',
  [('video', 'Avenida principal de Las Vegas de día, sol fuerte, hoteles y turistas', 'las vegas strip daytime sunny tourists', 'vegas')], mark='⚡')
R('El calor derrite el asfalto', 'VIDEO', 'Ondas de calor que deforman el aire sobre el asfalto.',
  [('video', 'Ondas de calor (espejismo) sobre el asfalto de una calle', 'heat haze shimmer asphalt road')])
R('Un hombre con chaleco brillante reparte volantes', 'VIDEO', 'Un hombre en la banqueta entrega volantes a la gente que pasa.',
  [('video', 'Hombre en la banqueta repartiendo volantes a la gente que pasa (de preferencia con chaleco o uniforme llamativo)', 'man handing out flyers sidewalk street promoter', 'volantes')])
R('Pásele hay aire acondicionado', 'ÍCONOS', 'Un copo de nieve (aire acondicionado) y una máquina tragamonedas que gira.',
  [('icono:aire', 'Copo de nieve (aire acondicionado)', 'snowflake icon flat'), ('icono:tragamonedas', 'Máquina tragamonedas', 'slot machine icon flat')])
R('Para las estadísticas este hombre es una excelente noticia', 'ÍCONOS', 'Una gráfica de barras con una palomita verde.',
  [('icono:grafica', 'Gráfica de barras', 'bar chart icon flat'), ('icono:palomita', 'Palomita verde', 'green check mark icon flat')], [('BUENA NOTICIA', CON, M)])
R('Tiene trabajo', 'VIDEO', 'El hombre de los volantes otra vez, sonriendo a los turistas.', ['=@volantes'], [('EMPLEADO', CON, C)])
R('Ya no cuenta como desempleado', 'ÍCONOS', 'Una lista con un nombre que se tacha.',
  [('icono:lista', 'Lista o planilla', 'clipboard list icon flat')])
R('Y aun así le está pasando algo', '2D', '«Tú» curioso, acercándose.', txt=[('NADIE LO MIDE', CON, M)])
R('y que a lo mejor también te está pasando a ti', '2D', '«Tú» sorprendido, con los ojos muy abiertos.', mark='🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 1 · "El titular que todos celebran"')
R('Bajó el desempleo', 'TEXTO', 'El titular enorme, como de noticiero, con una flecha que baja.',
  [('icono:flecha_baja', 'Flecha que baja', 'down arrow chart icon flat')], [('¡BAJÓ EL DESEMPLEO!', CON, G)], '⚡')
R('Aunque sea poquito suena a fiesta', 'VIDEO', 'Gente celebrando en una oficina, con confeti.',
  [('video', 'Gente celebrando en una oficina, aplausos y confeti', 'office celebration confetti applause')])
R('quiere decir que la economía se mueve', 'VIDEO', 'Una línea de producción en movimiento, con trabajadores.',
  [('video', 'Línea de producción de una fábrica en movimiento, con trabajadores', 'factory production line workers busy')])
R('que pronto habrá un poco más de dinero', 'VIDEO', 'Alguien guarda billetes en su cartera.',
  [('video', 'Persona guardando billetes en su cartera o en el bolsillo', 'putting money in wallet cash close up')])
R('Pero si le pedimos un poco más', '2D', '«Tú» pensativo, con la mano en la barbilla.')
R('el panorama se complica', 'VIDEO', 'Nubes de tormenta que oscurecen una ciudad (time-lapse).',
  [('video', 'Nubes de tormenta oscureciendo una ciudad, time-lapse', 'dark storm clouds over city timelapse')])
R('de lo que nos cuentan los gobiernos', 'FOTO', 'Un podio con micrófonos de una conferencia de prensa, vacío.',
  [('foto', 'Podio con micrófonos de una conferencia de prensa, sin banderas ni logos', 'press conference podium microphones')], mark='🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 2 · "Una palabra con otro sentido"')
R('Desempleo es fácil', 'FOTO', 'Un escritorio vacío con la silla sola.',
  [('foto', 'Escritorio de oficina vacío con la silla sola', 'empty office desk chair')], [('DESEMPLEO', CON, M)])
R('Ahora toma una palabra que ya existe', '2D', '«Tú» con un diccionario abierto en la mano.',
  [('icono:diccionario', 'Diccionario o libro abierto', 'open book dictionary icon flat')])
R('subempleo y vamos a darle un sentido nuevo', 'TEXTO', 'La palabra gigante, con un destello.', txt=[('SUBEMPLEO', CON, G)], mark='⚡')
R('Estar subempleado es tener trabajo', 'VIDEO', 'Oficinista aburrido frente a la computadora.',
  [('video', 'Oficinista aburrido frente a la computadora, apoyando la cara en la mano', 'bored office worker computer', 'oficina')])
R('Solo le despierta deseos', 'VIDEO', 'Alguien en la cama de noche, deslizando ofertas en el celular.',
  [('video', 'Persona en la cama de noche deslizando compras o anuncios en el celular', 'person scrolling phone shopping night bed')])
R('Piensa en la bolsa de diseñador', 'FOTO', 'Bolsa de lujo en el aparador de una tienda elegante, sin logos.',
  [('foto', 'Bolsa de diseñador en el aparador de una tienda elegante, sin logos visibles', 'luxury handbag boutique display')])
R('en el reloj de lujo', 'FOTO', 'Primer plano de un reloj de lujo, sin marca visible.',
  [('foto', 'Primer plano de un reloj de lujo en la muñeca, sin marca visible', 'luxury watch wrist close up')])
R('o en la página para adultos', 'ÍCONOS', 'Un letrero de «+18» y un cursor que da clic sin parar.',
  [('icono:mas18', 'Letrero de «+18»', 'adults only 18 plus icon flat'), ('icono:cursor', 'Cursor de clic', 'mouse cursor click icon flat')])
R('El hombre de los volantes está justo ahí', 'VIDEO', 'El hombre de los volantes otra vez.', ['=@volantes'])
R('Su jefe tiene un problemita', '2D', '«Tú» se rasca la cabeza, pensativo.')
R('que los turistas prefieren el sol y la calle', 'VIDEO', 'Turistas paseando bajo el sol, con lentes oscuros y cámaras.',
  [('video', 'Turistas paseando por una avenida bajo el sol, con lentes oscuros y cámaras', 'tourists walking sunny street sunglasses')])
R('antes que meterse a un casino', 'VIDEO', 'Interior de un casino: tragamonedas con luces de colores.',
  [('video', 'Interior de un casino: hileras de tragamonedas con luces de colores', 'casino slot machines lights interior', 'casino')], mark='⚡')
R('y pirámides egipcias de cartón', 'FOTO', 'Una pirámide o esfinge decorativa de un hotel-casino.',
  [('foto', 'Pirámide o esfinge decorativa de un hotel-casino (réplica, no las reales de Egipto)', 'egyptian themed casino hotel pyramid sphinx replica')])
R('Él se lo resuelve', 'VIDEO', 'Turistas entrando a un casino por la puerta de cristal.',
  [('video', 'Turistas entrando a un casino o a un edificio con aire acondicionado por una puerta de cristal', 'tourists entering casino glass door')])
R('Técnicamente tiene empleo', 'ÍCONOS', 'Un gafete de empleado con una palomita.',
  [('icono:gafete', 'Gafete de empleado', 'employee badge id card icon flat'), '=icono_palomita.png'], [('¿EMPLEADO?', CON, M)])
R('Pero está dramáticamente subempleado', 'TEXTO', 'El texto en rojo, con un golpe.', txt=[('SUBEMPLEADO', CON, G)], mark='⚡')
R('Su trabajo genera dinero', 'VIDEO', 'Una máquina contadora de billetes.',
  [('video', 'Máquina contadora de billetes en acción', 'cash counting machine money')])
R('y no le aporta nada al bienestar', 'VIDEO', 'Una flor que se marchita (time-lapse).',
  [('video', 'Flor que se marchita, time-lapse', 'wilting flower timelapse')])
R('Y no está solo', '2D', '«Tú» sorprendido, mira a su alrededor.')
R('En la misma fila están los que fabrican cigarros', 'VIDEO', 'Cigarros en una línea de producción.',
  [('video', 'Cigarros en una línea de producción o empaquetado', 'cigarette factory production line')])
R('series adictivas pero vacías', 'VIDEO', 'Alguien viendo la tele de noche con el control en la mano, una serie tras otra.',
  [('video', 'Persona viendo la televisión de noche con el control, cara iluminada por la pantalla', 'person binge watching tv night remote')])
R('departamentos mal diseñados', 'FOTO', 'Edificio de departamentos apretado y feo.',
  [('foto', 'Edificio de departamentos apretado, gris y mal diseñado', 'cramped ugly apartment building block')])
R('ropa que se rompe en la segunda lavada', 'FOTO', 'Una camiseta barata con la costura rota.',
  [('foto', 'Camiseta barata con la costura rota o descosida', 'torn shirt seam cheap clothes')])
R('anuncios engañosos', 'FOTO', 'Una calle llena de anuncios luminosos y llamativos.',
  [('foto', 'Calle llena de anuncios luminosos llamativos, de noche, sin marcas legibles', 'flashy billboards advertising city night')])
R('galletas que tapan las arterias', 'FOTO', 'Una montaña de galletas con chispas de chocolate.',
  [('foto', 'Montaña de galletas con chispas de chocolate', 'pile of chocolate chip cookies')])
R('refrescos con azúcar de sobra', 'VIDEO', 'Refresco que cae en un vaso con hielo, en cámara lenta.',
  [('video', 'Refresco de cola cayendo en un vaso con hielo, cámara lenta, sin marca', 'soda pouring glass ice slow motion')])
R('Sabes cuánta gente cabe en esa fila', 'VIDEO', 'Multitud caminando a la hora pico.',
  [('video', 'Multitud caminando a la hora pico en una ciudad', 'rush hour crowd commuters walking city', 'multitud')])
R('Muchísima', 'ÍCONOS', 'Una gráfica que se dispara hacia arriba.',
  [('icono:grafica_sube', 'Gráfica que sube', 'rising chart arrow icon flat')], [('ALTÍSIMO', CON, G)], '⚡')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 3 · "Lo que esperas en el fondo"')
R('Y ojo cualquier trabajo que paga la renta', 'FOTO', 'Alguien pagando sus cuentas en la mesa de la cocina.',
  [('foto', 'Persona pagando sus cuentas en la mesa de la cocina, con recibos y calculadora', 'paying bills kitchen table calculator')])
R('Pero en el fondo todos esperamos algo más', '2D', '«Tú» mira hacia arriba, con esperanza.')
R('Que lo que hacemos de ocho a seis', 'VIDEO', 'Reloj de oficina avanzando rápido (time-lapse).',
  [('video', 'Reloj de pared de una oficina avanzando rápido, time-lapse', 'office wall clock timelapse')], [('DE 8 A 6', CON, C)])
R('le sirva al bien común', 'VIDEO', 'Una enfermera ayuda a un paciente mayor.',
  [('video', 'Enfermera ayudando a un paciente mayor', 'nurse helping elderly patient')])
R('Que marque una diferencia aunque sea pequeñita', 'VIDEO', 'Manos que plantan un brote en la tierra.',
  [('video', 'Manos plantando un brote en la tierra', 'hands planting seedling soil')])
R('A ti te ha pasado', '2D', '«Tú» con un signo de interrogación arriba.',
  [('icono:interrogacion', 'Signo de interrogación', 'question mark icon flat')])
R('Has salido del trabajo pensando', 'VIDEO', 'Alguien cansado sale de la oficina de noche.',
  [('video', 'Persona cansada saliendo de la oficina de noche', 'tired worker leaving office night')], [('¿PARA QUÉ SIRVIÓ?', CON, M)], '🪝')

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 4 · "El truco de los gobiernos"')
R('Los gobiernos ya aprendieron', 'FOTO', 'Fachada de un edificio de gobierno con columnas, sin banderas.',
  [('foto', 'Fachada de un edificio de gobierno con columnas, sin banderas', 'government building columns facade')])
R('lo llaman estimular la demanda', 'TEXTO', 'La frase entre comillas, como término técnico.', txt=[('«ESTIMULAR LA DEMANDA»', CON, G)])
R('que la gente compre más', 'VIDEO', 'Centro comercial lleno de gente con bolsas.',
  [('video', 'Centro comercial lleno de gente con bolsas de compras', 'busy shopping mall people bags')])
R('para que las empresas contraten más', 'VIDEO', 'Apretón de manos al final de una entrevista de trabajo.',
  [('video', 'Apretón de manos al final de una entrevista de trabajo', 'job interview handshake hired')])
R('Y funciona', 'ÍCONOS', 'La flecha que baja otra vez, con la palomita.', ['=icono_flecha_baja.png', '=icono_palomita.png'])
R('El problema es que no distingue', '2D', '«Tú» frunce el ceño, desconfiado.')
R('Le da lo mismo que compres una tragamonedas más', 'VIDEO', 'Las tragamonedas del casino otra vez.', ['=@casino'])
R('o clases de música para tu hija', 'VIDEO', 'Una niña aprende piano con su maestra.',
  [('video', 'Niña aprendiendo a tocar piano con su maestra', 'child piano lesson teacher')], mark='⚡')
R('Y por eso tampoco distingue entre empleo y subempleo', 'ÍCONOS', 'Una balanza con una etiqueta en cada plato.',
  [('icono:balanza', 'Balanza', 'balance scale icon flat')], [('EMPLEO', CON, C), ('SUBEMPLEO', CON, C)])
R('El verdadero truco sería otro', '2D', '«Tú» levanta la mano, esperanzado.', mark='⚡')
R('estimular la demanda correcta', 'TEXTO', 'La frase, con la palabra «correcta» en verde.', txt=[('LA DEMANDA CORRECTA', CON, G)])
R('Que nos emocione comprar lo que de verdad nos llena', 'VIDEO', 'Amigos cocinando juntos y riendo.',
  [('video', 'Amigos cocinando juntos en una cocina y riendo', 'friends cooking together kitchen laughing')])
R('desear lo que de verdad importa', 'VIDEO', 'Papá e hija leyendo un libro.',
  [('video', 'Papá e hija leyendo un libro juntos', 'father daughter reading book together')])
R('Así las personas y las empresas', 'VIDEO', 'Un carpintero trabaja con cuidado en su taller.',
  [('video', 'Carpintero trabajando con cuidado en su taller', 'carpenter workshop crafting wood')])
R('en lo que sí vale la pena', 'VIDEO', 'Una maestra ayuda a sus alumnos en el salón.',
  [('video', 'Maestra ayudando a sus alumnos en el salón de clases', 'teacher helping students classroom')])

# ────────────────────────────────────────────────────────────────
S('SECCIÓN 5 · Cierre: "El índice que falta"')
R('Las cifras de empleo importan', 'FOTO', 'Gráficas económicas en una pantalla.',
  [('foto', 'Gráficas y cifras económicas en una pantalla', 'economic data charts screen')])
R('Son lo primero que hay que cuidar', 'ÍCONOS', 'Una medalla de primer lugar.',
  [('icono:medalla', 'Medalla de primer lugar', 'first place medal icon flat')])
R('Pero esconden un índice más ambicioso', '2D', '«Tú» con una lupa, investigando.',
  [('icono:lupa', 'Lupa', 'magnifying glass icon flat')], mark='🪝')
R('uno que mida el subempleo', 'ÍCONOS', 'Un medidor con la aguja que sube.',
  [('icono:medidor', 'Medidor o tacómetro', 'gauge meter icon flat')], [('ÍNDICE DE SUBEMPLEO', CON, M)], '⚡')
R('Qué tan inteligente y responsablemente', 'VIDEO', 'Personas de distintos oficios trabajando.',
  [('video', 'Personas de distintos oficios trabajando (montaje)', 'diverse workers different jobs montage')], [('CAPITAL HUMANO', CON, M)])
R('O sea las vidas de las personas', 'VIDEO', 'Gente caminando en cámara lenta en la ciudad.',
  [('video', 'Gente caminando por la ciudad en cámara lenta, distintas edades', 'people walking city slow motion')])
R('Con ese índice el hombre de los volantes', 'VIDEO', 'El hombre de los volantes, por última vez.', ['=@volantes'])
R('Sería una alarma', 'ÍCONOS', 'Una sirena roja girando.',
  [('icono:sirena', 'Sirena de alarma', 'red siren alarm icon flat')], [('ALARMA', CON, G)], '⚡')
R('Y ahora te toca a ti', '2D', '«Tú» señala al espectador.')
R('si ese índice existiera', 'TEXTO', 'La pregunta enorme.', txt=[('¿EMPLEO O SUBEMPLEO?', CON, G)], mark='🪝')
R('Te leo en los comentarios', '2D', '«Tú» escribe en su celular, con un globo de comentario.',
  [('icono:comentario', 'Globo de comentario', 'comment speech bubble icon flat')])
R('Y si esto te dejó pensando suscríbete', '2D', '«Tú» con una campana de notificaciones.',
  [('icono:campana', 'Campana de notificaciones', 'notification bell icon flat')], [('SUSCRÍBETE', CON, M)])
R('aquí seguimos haciendo las preguntas', '2D', '«Tú» saluda a cámara.')

SHORT_TXT = [
    ('texto_short1.png', '¿EMPLEADO?', 'con fondo', 'Short 1, primeros 3 s, arriba'),
    ('texto_short2.png', '¿PARA QUÉ SIRVE?', 'con fondo', 'Short 2, primeros 3 s, arriba'),
    ('texto_short3.png', '¿BUENA O MALA?', 'con fondo', 'Short 3, primeros 3 s, arriba'),
]

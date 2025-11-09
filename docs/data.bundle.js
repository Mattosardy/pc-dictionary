window.DB = {
  "departments": [
    {"id":"almacenamiento","nombre":"Almacenamiento"},
    {"id":"ram","nombre":"Memoria RAM"},
    {"id":"cpu","nombre":"CPU"},
    {"id":"gpu","nombre":"GPU"},
    {"id":"motherboard","nombre":"Placa Madre / Chipset"},
    {"id":"psu","nombre":"Fuente de Poder (PSU)"},
    {"id":"cooling","nombre":"Refrigeración"},
    {"id":"network","nombre":"Red y Conectividad"},
    {"id":"os","nombre":"Sistema Operativo"},
    {"id":"security","nombre":"Seguridad y Backups"}
  ],
  "entries": [

    /* === REFRIGERACIÓN === */
{
  "id":"cooling-polvo-ventiladores",
  "departamento_id":"cooling",
  "departamento":"Refrigeración",
  "problema":"Temperaturas altas y ruido por polvo en ventiladores/radiadores",
  "causa":"Acumulación de polvo en filtros, aletas del disipador y radiadores",
  "solucion":[
    "Apagar PC y desconectar corriente",
    "Retirar paneles y filtros; limpiar con aire comprimido (sostenido, no golpes)",
    "Sujetar el aspa del ventilador al soplar (evitar sobre-velocidad del rotor)",
    "Limpiar aletas del disipador/radiador con brocha antiestática",
    "Rearmar, revisar dirección de flujo (front IN / top+rear OUT)"
  ],
  "verificacion":[
    "Mejora ≥8–12 °C vs. temperatura inicial",
    "Ruido percibido menor bajo carga"
  ],
  "riesgo":"BAJO","nivel":"Básico","tiempo_min":20,
  "tags":["polvo","ventiladores","radiador","mantenimiento"],
  "imagenes":[ "assets/flujo-aire-correcto.png" ]
},
{
  "id":"cooling-ventilador-fallo-rpm",
  "departamento_id":"cooling","departamento":"Refrigeración",
  "problema":"Un ventilador no gira o gira a RPM muy bajas",
  "causa":"Conector mal colocado, curve de ventilador inapropiada o ventilador dañado",
  "solucion":[
    "Verificar conexión en SYS_FAN/CHA_FAN/CPU_FAN (3/4 pines correctos)",
    "Probar el mismo ventilador en otro header",
    "En BIOS: setear curva estándar o fija 60% para test",
    "Si no responde: reemplazar ventilador"
  ],
  "verificacion":[ "RPM reportada estable en BIOS/HWiNFO", "Temp CPU/GPU dentro de rango normal" ],
  "riesgo":"BAJO","nivel":"Básico","tiempo_min":10,
  "tags":["fan","rpm","pwm","dc","header"],
  "herramientas":[ {"nombre":"HWiNFO","url":"https://www.hwinfo.com/download/"} ]
},
{
  "id":"cooling-aio-burbujas-ruido",
  "departamento_id":"cooling","departamento":"Refrigeración",
  "problema":"AIO con burbujeo/ruido y picos térmicos",
  "causa":"Aire en el loop o bomba en cabecera fan con control PWM inadecuado",
  "solucion":[
    "Conectar bomba a header AIO_PUMP o CPU_OPT a 100% constante",
    "Reposicionar radiador con tubos hacia abajo si es posible (top-mount recomendado)",
    "Purgar inclinando suavemente para mover burbujas a radiador",
    "Actualizar curva de ventiladores del radiador"
  ],
  "verificacion":[ "Estabilidad térmica bajo carga (Cinebench)", "Sin ruidos de cavitación" ],
  "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":20,
  "tags":["aio","bomba","cavitacion","radiador","curva"],
  "imagenes":[ "assets/flujo-aire-correcto.png" ]
},

/* === ALMACENAMIENTO === */
{
  "id":"almacenamiento-smart-reallocated",
  "departamento_id":"almacenamiento","departamento":"Almacenamiento",
  "problema":"SMART con reallocated/pending sectors",
  "causa":"Sectores defectuosos crecientes en HDD/SSD",
  "solucion":[
    "CrystalDiskInfo: revisar Reallocated/Pending/Uncorrectable",
    "Backup inmediato de datos críticos",
    "Ejecutar escaneo largo (SeaTools/WD Data Lifeguard) para confirmar",
    "Plan: reemplazar drive si métricas aumentan"
  ],
  "verificacion":[ "SMART estable 48–72 h", "Sin nuevos eventos de E/S" ],
  "riesgo":"ALTO","nivel":"Intermedio","tiempo_min":30,
  "tags":["smart","sectores reasignados","pending"],
  "herramientas":[
    {"nombre":"CrystalDiskInfo","url":"https://crystalmark.info/en/software/crystaldiskinfo/"},
    {"nombre":"SeaTools","url":"https://www.seagate.com/support/downloads/seatools/"}
  ],
  "imagenes":[ "assets/crystaldiskinfo-status.png" ]
},
{
  "id":"almacenamiento-bios-nvme-no-detectado",
  "departamento_id":"almacenamiento","departamento":"Almacenamiento",
  "problema":"NVMe no detectado en BIOS",
  "causa":"Slot M.2 compartido/deshabilitado por líneas PCIe o modo SATA",
  "solucion":[
    "Revisar manual: deshabilitaciones por uso de SATA 5/6 o GPU en x16",
    "Mover NVMe a otro M.2 con líneas de CPU/Chipset disponibles",
    "Actualizar BIOS/UEFI",
    "Quitar adaptadores/risers; testear directo"
  ],
  "verificacion":[ "NVMe visible en BIOS/Windows", "Velocidad acorde al estándar (PCIe 3/4)" ],
  "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":15,
  "tags":["nvme","m.2","pcie","lanes","bios"],
  "imagenes":[ "assets/nvme-throttle-graph.png" ]
},

/* === RAM === */
{
  "id":"ram-mixtas-incompatibles",
  "departamento_id":"ram","departamento":"Memoria RAM",
  "problema":"Módulos mixtos (marcas/timings) inestables",
  "causa":"SPD distintos y training subóptimo",
  "solucion":[
    "Desactivar XMP/EXPO y setear manualmente frecuencia JEDEC estable",
    "Ajustar voltaje DRAM +0.05 V y SoC (AMD) según guía del fabricante",
    "MemTest86 4 pasadas; si falla, usar solo kit emparejado"
  ],
  "verificacion":[ "0 errores en MemTest86", "Sin BSOD 24–48 h" ],
  "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":35,
  "tags":["spd","mix","xmp","expo","memtest"],
  "herramientas":[ {"nombre":"MemTest86+","url":"https://www.memtest.org/"} ]
},
{
  "id":"ram-slot-sucio-no-post",
  "departamento_id":"ram","departamento":"Memoria RAM",
  "problema":"Sin POST con pitidos/LED DRAM",
  "causa":"Slot sucio o módulo mal asentado",
  "solucion":[
    "Apagar, retirar módulo y limpiar contactos con isopropílico",
    "Soplar suavemente slot (aire seco) y reinstalar hasta el click",
    "Probar por pares A2/B2 (dual-channel recomendado)"
  ],
  "verificacion":[ "POST normal", "MemTest corto sin errores" ],
  "riesgo":"BAJO","nivel":"Básico","tiempo_min":10,
  "tags":["post","slots","contacto","dual channel"]
},

/* === CPU === */
{
  "id":"cpu-pasta-exceso-margenes",
  "departamento_id":"cpu","departamento":"CPU",
  "problema":"Temperaturas disparadas tras reinstalar disipador",
  "causa":"Exceso de pasta térmica o presión desigual",
  "solucion":[
    "Limpiar superficies con isopropílico 99%",
    "Aplicar cantidad tipo lenteja/linea (según IHS) y montar cruzado",
    "Verificar presión homogénea y RPM del ventilador"
  ],
  "verificacion":[ "Idle <45 °C", "Carga sostenida <85 °C" ],
  "riesgo":"BAJO","nivel":"Básico","tiempo_min":20,
  "tags":["pasta termica","montaje","ihs"],
  "imagenes":[ "assets/pasta-termica-correcta.jpg" ]
},

/* === GPU === */
{
  "id":"gpu-psu-pcie-cables",
  "departamento_id":"gpu","departamento":"GPU",
  "problema":"Cierres al iniciar juego o stress",
  "causa":"Conectores PCIe compartidos o PSU límite",
  "solucion":[
    "Usar cables PCIe separados desde la PSU (no daisy-chain)",
    "Verificar potencia de PSU y rail 12V estable (11.4–12.6 V)",
    "DDU + driver limpio si persiste"
  ],
  "verificacion":[ "3D stress 20–30 min sin apagones", "Eventos sin Kernel-Power 41" ],
  "riesgo":"ALTO","nivel":"Intermedio","tiempo_min":25,
  "tags":["pcie","psu","12v","ddu"],
  "herramientas":[
    {"nombre":"OCCT","url":"https://www.ocbase.com/"},
    {"nombre":"HWiNFO","url":"https://www.hwinfo.com/download/"},
    {"nombre":"DDU","url":"https://www.wagnardsoft.com/"}
  ],
  "imagenes":[ "assets/gpu-z-specs.png","assets/psu-voltages-hwinfo.png" ]
},

/* === PLACA MADRE / CHIPSET === */
{
  "id":"mb-bios-fastboot-perifericos",
  "departamento_id":"motherboard","departamento":"Placa Madre / Chipset",
  "problema":"Teclado/USB no responde al boot",
  "causa":"Fast Boot o Legacy USB deshabilitado",
  "solucion":[
    "Entrar a BIOS: desactivar Fast Boot temporalmente",
    "Habilitar Legacy USB/CSM si el SO lo requiere",
    "Actualizar BIOS si hay bugs conocidos"
  ],
  "verificacion":[ "Periféricos disponibles en POST/BIOS" ],
  "riesgo":"BAJO","nivel":"Básico","tiempo_min":8,
  "tags":["bios","fast boot","legacy usb","csm"]
},

{
  id: "dell-inspiron-15-5000-sin-imagen",
  departamento: "Hardware / Motherboard",
  nivel: "Alto",
  riesgo: "Medio",
  problema: "Dell Inspiron 15 5000 enciende, gira el cooler, se apaga y no da imagen",
  causa: "Corrupción de BIOS, error en GPU o controlador embebido (EC/PCH) según código de luces.",
  sintomas: [
    "Al encender, luz de Caps Lock fija, ventiladores giran rápido y se apaga sin dar video.",
    "Tras limpiar RAM, aparece parpadeo 3 naranja + 4 blanco (error de memoria).",
    "Luego, parpadeo 3 blanco + 3 naranja (error de video).",
    "Finalmente, 3 naranja + 1 blanco (fallo en EC o chipset)."
  ],
  pruebas: [
    "Se retira batería y pila CMOS.",
    "Se prueba sin discos ni memorias externas.",
    "Se limpia contactos de RAM y se testea por módulos y ranuras.",
    "Se realiza recovery de BIOS con Ctrl + Esc y pendrive FAT32.",
    "Se limpian conectores de video y se verifica en HDMI externo."
  ],
  resultado: "La secuencia de diagnóstico avanza hasta error 3-1 (Embedded Controller / PCH). BIOS responde pero el sistema no completa POST, indicando posible daño físico en chipset o firmware EC.",
  solucion: "Intentar EC reset (sin batería, sin CMOS, presionar 60s power). Si persiste, regrabar BIOS completo o reemplazar chip PCH/EC en placa. Posible reparación con reballing.",
  herramientas: ["Pendrive FAT32", "Alcohol isopropílico", "Multímetro digital", "Pinza plástica", "Programador SPI (CH341A o similar)"],
  os: "🪟",
  tags: ["Dell", "Laptop", "Sin imagen", "Código de luces", "BIOS recovery", "EC", "Chipset", "Video error"]
},
    
/* === PSU === */
{
  "id":"psu-cables-sueltos-8pin-cpu",
  "departamento_id":"psu","departamento":"Fuente de Poder (PSU)",
  "problema":"Reinicios aleatorios; sin video esporádico",
  "causa":"Conector EPS 8-pin CPU flojo/parcialmente conectado",
  "solucion":[
    "Verificar EPS 8-pin/4+4 bien insertado (clic) en la placa",
    "Comprobar firmeza en cables y modular PSU",
    "Stress combinado (OCCT Power) para validar"
  ],
  "verificacion":[ "OCCT Power 30 min estable", "Eventos sin Kernel-Power 41" ],
  "riesgo":"ALTO","nivel":"Básico","tiempo_min":10,
  "tags":["eps","8pin","reinicios","kernel power"],
  "herramientas":[ {"nombre":"OCCT","url":"https://www.ocbase.com/"} ]
},

/* === RED === */
{
  "id":"network-dns-slow-fallback",
  "departamento_id":"network","departamento":"Red y Conectividad",
  "problema":"Resolución DNS lenta/errática",
  "causa":"DNS del ISP saturado o caché dañada",
  "solucion":[
    "ipconfig /flushdns",
    "Configurar IPv4: 1.1.1.1 y 8.8.8.8 como preferidos",
    "Probar `nslookup` y latencia"
  ],
  "verificacion":[ "ping a dominios <30 ms", "navegación fluida" ],
  "riesgo":"BAJO","nivel":"Básico","tiempo_min":5,
  "tags":["dns","latencia","nslookup"]
},

/* === SISTEMA OPERATIVO === */
{
  "id":"os-servicios-terceros-bootlento",
  "departamento_id":"os","departamento":"Sistema Operativo",
  "problema":"Inicio muy lento tras instalar software",
  "causa":"Servicios de terceros y programas de arranque pesados",
  "solucion":[
    "msconfig → Inicio selectivo (servicios de Microsoft ocultos)",
    "Deshabilitar no esenciales y reiniciar",
    "Revisar Programador de Tareas (Library) por tareas pesadas"
  ],
  "verificacion":[ "Boot < 45–60 s", "Sin eventos críticos en Visor" ],
  "riesgo":"BAJO","nivel":"Básico","tiempo_min":15,
  "tags":["startup","msconfig","task scheduler"]
},

/* === SEGURIDAD / BACKUP === */
{
  "id":"security-bitlocker-recuperacion",
  "departamento_id":"security","departamento":"Seguridad y Backups",
  "problema":"BitLocker pide clave de recuperación tras cambio BIOS",
  "causa":"Protección TPM/arranque detectó cambio de plataforma",
  "solucion":[
    "Ingresar clave de recuperación (MS Account/AD)",
    "Suspender BitLocker temporalmente antes de cambios de BIOS",
    "Reanudar cifrado tras validar boot normal"
  ],
  "verificacion":[ "Windows arranca sin prompt", "Estado BitLocker = Protegido" ],
  "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":10,
  "tags":["bitlocker","tpm","recuperacion"]
},

    {
      "id":"almacenamiento-diskpart-clean-gpt",
      "departamento_id":"almacenamiento",
      "departamento":"Almacenamiento",
      "problema":"Disco no aparece / tabla corrupta",
      "causa":"Partición dañada o MBR/GPT inconsistente",
      "solucion":[
        "Abrir CMD como administrador",
        "diskpart",
        "list disk",
        "select disk X  // REEMPLAZAR X",
        "clean          // BORRA TODO",
        "convert gpt",
        "create partition primary",
        "format fs=ntfs quick",
        "assign"
      ],
      "verificacion":[
        "Disco visible con letra en 'Este equipo'",
        "Sin errores relacionados a disk en Visor de eventos"
      ],
      "riesgo":"ALTO","nivel":"Intermedio","tiempo_min":5,
      "tags":["diskpart","gpt","m.2","ssd","particiones"],
      "comandos":["diskpart","list disk","select disk X","clean","convert gpt","create partition primary","format fs=ntfs quick","assign"],
      "imagenes":[ "assets/diskpart-list-disk.png", "assets/crystaldiskinfo-status.png" ],
      "herramientas":[
        {"nombre":"CrystalDiskInfo","url":"https://crystalmark.info/en/software/crystaldiskinfo/"},
        {"nombre":"Clonezilla","url":"https://clonezilla.org/"},
        {"nombre":"Rufus","url":"https://rufus.ie/"},
        {"nombre":"Ventoy","url":"https://www.ventoy.net/"}
      ]
    },
    {
      "id":"almacenamiento-raw-chkdsk",
      "departamento_id":"almacenamiento","departamento":"Almacenamiento",
      "problema":"Partición aparece como RAW / no se puede abrir",
      "causa":"Tabla de archivos dañada (NTFS) por apagado brusco o sectores inestables",
      "solucion":[
        "CMD admin",
        "chkdsk X: /f /r   // Reemplazar X por letra de unidad",
        "Si falla: copiar datos críticos y formatear",
        "Post: CrystalDiskInfo para revisar SMART"
      ],
      "verificacion":["Vuelve a NTFS y es accesible","SMART estable"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":60,
      "tags":["raw","ntfs","chkdsk","corrupcion","smart"],
      "comandos":["chkdsk X: /f /r"],
      "imagenes":[ "assets/crystaldiskinfo-status.png" ],
      "herramientas":[
        {"nombre":"CrystalDiskInfo","url":"https://crystalmark.info/en/software/crystaldiskinfo/"},
        {"nombre":"Recuva","url":"https://www.ccleaner.com/recuva"}
      ]
    },
    {
      "id":"almacenamiento-trim-ssd",
      "departamento_id":"almacenamiento","departamento":"Almacenamiento",
      "problema":"SSD lento por falta de TRIM",
      "causa":"TRIM deshabilitado",
      "solucion":[
        "fsutil behavior query DisableDeleteNotify   // 0 = activo",
        "Si devuelve 1: fsutil behavior set DisableDeleteNotify 0"
      ],
      "verificacion":["fsutil → 0","Rendimiento estable"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":5,
      "tags":["ssd","trim","rendimiento"],
      "comandos":[
        "fsutil behavior query DisableDeleteNotify",
        "fsutil behavior set DisableDeleteNotify 0"
      ],
      "imagenes":[ "assets/trim-cmd.png" ],
      "herramientas":[
        {"nombre":"CrystalDiskInfo","url":"https://crystalmark.info/en/software/crystaldiskinfo/"}
      ]
    },
    {
      "id":"almacenamiento-nvme-throttle",
      "departamento_id":"almacenamiento","departamento":"Almacenamiento",
      "problema":"NVMe baja velocidad tras segundos de copia",
      "causa":"Throttling térmico o caché SLC agotada",
      "solucion":[
        "Monitorear temp de NVMe (HWiNFO)",
        "Si >70–75 °C: disipador/airflow",
        "Actualizar firmware del NVMe"
      ],
      "verificacion":["Temp <70 °C","Velocidad estable"],
      "riesgo":"BAJO","nivel":"Intermedio","tiempo_min":20,
      "tags":["nvme","throttling","disipador","firmware"],
      "imagenes":[ "assets/nvme-throttle-graph.png" ],
      "herramientas":[
        {"nombre":"HWiNFO","url":"https://www.hwinfo.com/download/"}
      ]
    },
    {
      "id":"almacenamiento-clonado-mbr-gpt",
      "departamento_id":"almacenamiento","departamento":"Almacenamiento",
      "problema":"Disco clonado no arranca (MBR ↔ GPT)",
      "causa":"Tipo de partición incompatible con modo UEFI/Legacy",
      "solucion":[
        "Verificar BIOS (UEFI/Legacy)",
        "Si UEFI: convertir destino a GPT",
        "mbr2gpt /validate /allowFullOS",
        "mbr2gpt /convert /allowFullOS"
      ],
      "verificacion":["Arranque coherente con el modo BIOS"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":15,
      "tags":["clonado","mbr","gpt","uefi","legacy"],
      "comandos":["mbr2gpt /validate /allowFullOS","mbr2gpt /convert /allowFullOS"],
      "imagenes":[ "assets/mbr2gpt-convert.png" ],
      "herramientas":[
        {"nombre":"Macrium Reflect Free","url":"https://www.macrium.com/reflectfree"},
        {"nombre":"Clonezilla","url":"https://clonezilla.org/"}
      ]
    },

    {
      "id":"ram-xmp-inestable",
      "departamento_id":"ram","departamento":"Memoria RAM",
      "problema":"Pantallazos azules aleatorios (XMP/EXPO inestable)",
      "causa":"Perfil XMP/EXPO inestable o mezcla de módulos",
      "solucion":[
        "BIOS: desactivar XMP/EXPO",
        "Si estabiliza: -200 MHz o +0.05 V DRAM",
        "MemTest86 4 pasadas"
      ],
      "verificacion":["0 errores en MemTest86","Estable 1h de estrés"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":30,
      "tags":["ram","xmp","expo","bsod","memtest"],
      "imagenes":[ "assets/memtest86-pass.png", "assets/bios-xmp-disabled.png" ],
      "herramientas":[
        {"nombre":"MemTest86+","url":"https://www.memtest.org/"}
      ]
    },

    {
      "id":"cpu-overheat-throttling",
      "departamento_id":"cpu","departamento":"CPU",
      "problema":"Temperaturas >95°C y throttling",
      "causa":"Pasta térmica seca o disipador mal ajustado",
      "solucion":[
        "Limpiar y reaplicar pasta (tamaño lenteja)",
        "Asegurar presión uniforme",
        "Verificar RPM >1200 en BIOS"
      ],
      "verificacion":["Idle <45 °C","Carga <85 °C sin throttling"],
      "riesgo":"MEDIO","nivel":"Básico","tiempo_min":25,
      "tags":["cpu","temperatura","throttling","pasta termica"],
      "imagenes":[ "assets/cpu-temp-hwinfo.png", "assets/pasta-termica-correcta.jpg" ],
      "herramientas":[
        {"nombre":"HWiNFO","url":"https://www.hwinfo.com/download/"}
      ]
    },

    {
      "id":"gpu-ddu-driver-clean",
      "departamento_id":"gpu","departamento":"GPU",
      "problema":"Artefactos o pantallazos negros (drivers corruptos)",
      "causa":"Instalaciones superpuestas o dañadas",
      "solucion":[
        "Descargar DDU (Wagnardsoft)",
        "Reiniciar en Modo Seguro",
        "Limpiar con DDU",
        "Instalar driver WHQL del fabricante"
      ],
      "verificacion":["Bench sin cierres","Temp <80 °C"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":20,
      "tags":["gpu","drivers","ddu","artefactos"],
      "imagenes":[ "assets/ddu-safe-mode.png", "assets/gpu-z-specs.png" ],
      "herramientas":[
        {"nombre":"DDU","url":"https://www.wagnardsoft.com/"},
        {"nombre":"GPU-Z","url":"https://www.techpowerup.com/gpuz/"},
        {"nombre":"HWiNFO","url":"https://www.hwinfo.com/download/"}
      ]
    },

    {
      "id":"mb-no-post-cmos-bios",
      "departamento_id":"motherboard","departamento":"Placa Madre / Chipset",
      "problema":"No da video / no POST",
      "causa":"CMOS corrupto o BIOS dañada",
      "solucion":[
        "Quitar corriente y pila CMOS 5 min",
        "Presionar power 10 s",
        "Arrancar con 1 módulo RAM",
        "Actualizar BIOS por USB Flashback/Q-Flash"
      ],
      "verificacion":["POST normal"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":15,
      "tags":["bios","cmos","post","motherboard"],
      "imagenes":[ "assets/bios-reset-cmos.png" ],
      "herramientas":[
        {"nombre":"Manual de la placa (fabricante)","url":"https://www.msi.com/ | https://www.asus.com/ | https://www.gigabyte.com/"}
      ]
    },

    {
      "id":"psu-reinicio-carga",
      "departamento_id":"psu","departamento":"Fuente de Poder (PSU)",
      "problema":"Reinicios bajo carga",
      "causa":"Rail 12V inestable o potencia insuficiente",
      "solucion":[
        "Medir con HWiNFO (11.4–12.6 V)",
        "Probar otra PSU confiable",
        "Revisar conectores PCIe/CPU"
      ],
      "verificacion":["OCCT Power 30 min sin reinicios"],
      "riesgo":"ALTO","nivel":"Intermedio","tiempo_min":35,
      "tags":["psu","reinicios","12v","occt"],
      "imagenes":[ "assets/psu-voltages-hwinfo.png" ],
      "herramientas":[
        {"nombre":"OCCT","url":"https://www.ocbase.com/"},
        {"nombre":"HWiNFO","url":"https://www.hwinfo.com/download/"}
      ]
    },

    {
      "id":"cooling-flujo-aire",
      "departamento_id":"cooling","departamento":"Refrigeración",
      "problema":"Ruido/temperaturas altas por flujo invertido",
      "causa":"Ventiladores mal orientados o polvo",
      "solucion":[
        "Frontales IN, traseros/superiores OUT",
        "Limpiar filtros y ventiladores",
        "Reaplicar pasta si >2 años"
      ],
      "verificacion":["Baja ≥10 °C vs inicial"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":20,
      "tags":["cooling","ventiladores","polvo"],
      "imagenes":[ "assets/flujo-aire-correcto.png" ],
      "herramientas":[
        {"nombre":"HWiNFO","url":"https://www.hwinfo.com/download/"}
      ]
    },

    {
      "id":"network-stack-reset-dns",
      "departamento_id":"network","departamento":"Red y Conectividad",
      "problema":"Sin internet con adaptador activo",
      "causa":"Winsock/TCP-IP dañado o DNS caído",
      "solucion":[
        "netsh winsock reset",
        "netsh int ip reset",
        "ipconfig /flushdns",
        "ipconfig /release",
        "ipconfig /renew",
        "Reiniciar"
      ],
      "verificacion":["ping 8.8.8.8 OK","ping google.com OK"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":5,
      "tags":["dns","winsock","ipconfig","red"],
      "imagenes":[ "assets/windows-update-reset.png" ],
      "herramientas":[
        {"nombre":"PingInfoView","url":"https://www.nirsoft.net/utils/pinginfoview.html"}
      ]
    },
    {
      "id":"network-gigabit-limited",
      "departamento_id":"network","departamento":"Red y Conectividad",
      "problema":"Velocidad limitada a 100 Mbps por cable",
      "causa":"Cableado/negociación forzada",
      "solucion":[
        "Probar otro cable Cat5e/Cat6 (4 pares)",
        "En el adaptador: Auto negociación",
        "Verificar LEDs de 1 Gbps en router/switch"
      ],
      "verificacion":["Speedtest ~900 Mbps","LED 1000 Mbps"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":10,
      "tags":["gigabit","duplex","ethernet"],
      "imagenes":[ "assets/ethernet-100mbps.png", "assets/ethernet-1gbps.png" ],
      "herramientas":[
        {"nombre":"iPerf3","url":"https://iperf.fr/iperf-download.php"}
      ]
    },
    {
      "id":"network-wifi-drops",
      "departamento_id":"network","departamento":"Red y Conectividad",
      "problema":"Cortes de WiFi intermitentes",
      "causa":"Interferencias o ahorro de energía",
      "solucion":[
        "Router: canal limpio (1/6/11 en 2.4 GHz; DFS en 5 GHz si aplica)",
        "Windows: desactivar 'Permitir que el equipo apague este dispositivo'",
        "Actualizar driver WiFi"
      ],
      "verificacion":["Ping estable sin pérdidas","Streaming 15–30 min sin cortes"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":15,
      "tags":["wifi","canal","energia","driver"],
      "imagenes":[ "assets/wifi-canal.png", "assets/adapter-power-save.png" ],
      "herramientas":[
        {"nombre":"WiFi Analyzer (MS Store)","url":"https://apps.microsoft.com/store/detail/wifi-analyzer/9NBLGGH33N0N"},
        {"nombre":"Drivers Intel Wi-Fi","url":"https://www.intel.com/content/www/us/en/download-center/home.html"}
      ]
    },

    {
      "id":"os-sfc-dism-startup",
      "departamento_id":"os","departamento":"Sistema Operativo",
      "problema":"Inicio lento / archivos corruptos",
      "causa":"Servicios al arranque o corrupción del sistema",
      "solucion":[
        "sfc /scannow",
        "DISM /Online /Cleanup-Image /RestoreHealth",
        "Desactivar programas de Inicio"
      ],
      "verificacion":["Boot < 45 s","Eventos sin errores críticos"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":20,
      "tags":["sfc","dism","startup","windows"],
      "imagenes":[ "assets/cmd-sfc-dism.png" ],
      "herramientas":[
        {"nombre":"Autoruns","url":"https://learn.microsoft.com/sysinternals/downloads/autoruns"}
      ]
    },
    {
      "id":"os-bootrec-reparar-arranque",
      "departamento_id":"os","departamento":"Sistema Operativo",
      "problema":"Windows no arranca (loop de reparación)",
      "causa":"MBR/BCD dañados",
      "solucion":[
        "bootrec /fixmbr",
        "bootrec /fixboot   // si falla: bootsect /nt60 sys",
        "bootrec /scanos",
        "bootrec /rebuildbcd"
      ],
      "verificacion":["Sistema arranca"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":15,
      "tags":["bootrec","mbr","bcd","arranque","windows"],
      "comandos":["bootrec /fixmbr","bootrec /fixboot","bootrec /scanos","bootrec /rebuildbcd","bootsect /nt60 sys"],
      "imagenes":[ "assets/bootrec-rebuildbcd.png" ],
      "herramientas":[
        {"nombre":"Rufus","url":"https://rufus.ie/"},
        {"nombre":"Ventoy","url":"https://www.ventoy.net/"}
      ]
    },
    {
      "id":"os-wupdate-reset-componentes",
      "departamento_id":"os","departamento":"Sistema Operativo",
      "problema":"Windows Update atascado (0%, 99% o 0x800...)",
      "causa":"Componentes de Windows Update corruptos",
      "solucion":[
        "net stop wuauserv",
        "net stop cryptSvc",
        "net stop bits",
        "net stop msiserver",
        "ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old",
        "ren C:\\Windows\\System32\\catroot2 catroot2.old",
        "net start wuauserv",
        "net start cryptSvc",
        "net start bits",
        "net start msiserver"
      ],
      "verificacion":["Actualizaciones funcionan"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":10,
      "tags":["windows update","bits","wuauserv","catroot2"],
      "imagenes":[ "assets/windows-update-reset.png" ],
      "herramientas":[
        {"nombre":"Microsoft Update Catalog","url":"https://www.catalog.update.microsoft.com/"}
      ]
    },
    {
      "id":"os-desinstalar-actualizacion-problematica",
      "departamento_id":"os","departamento":"Sistema Operativo",
      "problema":"Falla tras última actualización",
      "causa":"Parche incompatible",
      "solucion":[
        "Panel de Control → Ver actualizaciones instaladas → Desinstalar por KB",
        "wusa /uninstall /kb:XXXXXXX /quiet /norestart"
      ],
      "verificacion":["Sistema estable tras reiniciar"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":10,
      "tags":["actualizacion","wusa","kb","rollback"],
      "imagenes":[ "assets/uninstall-kb.png" ],
      "herramientas":[
        {"nombre":"Microsoft Update Catalog","url":"https://www.catalog.update.microsoft.com/"}
      ]
    },

    {
      "id":"security-restore-imagen",
      "departamento_id":"security","departamento":"Seguridad y Backups",
      "problema":"Windows no arranca tras actualización",
      "causa":"Archivos del sistema dañados",
      "solucion":[
        "Boot USB instalación → Reparar",
        "Si falla: restaurar imagen (Macrium/Clonezilla)",
        "Mantener imagen actualizada cada 30 días"
      ],
      "verificacion":["Arranque normal","Checksum OK"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":30,
      "tags":["backup","macrium","clonezilla","restore"],
      "imagenes":[ "assets/macrium-restore.png", "assets/clonezilla-menu.png" ],
      "herramientas":[
        {"nombre":"Macrium Reflect Free","url":"https://www.macrium.com/reflectfree"},
        {"nombre":"Clonezilla","url":"https://clonezilla.org/"}
      ]
    }
  ]
};

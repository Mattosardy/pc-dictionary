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
      "riesgo":"ALTO",
      "nivel":"Intermedio",
      "tiempo_min":5,
      "tags":["diskpart","gpt","m.2","ssd","particiones"],
      "refs":[{"tipo":"doc","url":"https://aka.ms/diskpart-docs"}],
      "comandos":[
        "diskpart",
        "list disk",
        "select disk X",
        "clean",
        "convert gpt",
        "create partition primary",
        "format fs=ntfs quick",
        "assign"
      ]
    },
    {
      "id":"ram-xmp-inestable",
      "departamento_id":"ram",
      "departamento":"Memoria RAM",
      "problema":"Pantallazos azules aleatorios (XMP/EXPO inestable)",
      "causa":"Perfil de overclock automático inestable o mezcla de módulos",
      "solucion":[
        "Entrar a BIOS/UEFI",
        "Desactivar XMP/EXPO",
        "Si estabiliza: bajar frecuencia -200 MHz o subir DRAM Voltage +0.05 V",
        "Probar MemTest86 mínimo 4 pasadas"
      ],
      "verificacion":[
        "0 errores en MemTest86",
        "Sistema estable 1h de uso intensivo"
      ],
      "riesgo":"MEDIO",
      "nivel":"Intermedio",
      "tiempo_min":30,
      "tags":["ram","xmp","expo","bsod","memtest"]
    },
    {
      "id":"cpu-overheat-throttling",
      "departamento_id":"cpu",
      "departamento":"CPU",
      "problema":"Temperaturas >95°C y throttling",
      "causa":"Pasta térmica seca o disipador mal ajustado",
      "solucion":[
        "Retirar disipador y limpiar con isopropílico",
        "Aplicar MX-4/NT-H1 (tamaño lenteja)",
        "Asegurar presión uniforme",
        "Verificar RPM >1200 en BIOS"
      ],
      "verificacion":[
        "Idle <45 °C",
        "Carga sostenida <85 °C sin throttling (Cinebench)"
      ],
      "riesgo":"MEDIO",
      "nivel":"Básico",
      "tiempo_min":25,
      "tags":["cpu","temperatura","throttling","pasta termica"]
    },
    {
      "id":"gpu-ddu-driver-clean",
      "departamento_id":"gpu",
      "departamento":"GPU",
      "problema":"Pantallazos negros/artefactos por drivers corruptos",
      "causa":"Instalaciones de driver superpuestas o dañadas",
      "solucion":[
        "Descargar DDU",
        "Reiniciar en Modo Seguro",
        "Ejecutar DDU y limpiar driver",
        "Instalar driver WHQL desde sitio oficial"
      ],
      "verificacion":[
        "Bench sin cierres (Heaven/3DMark)",
        "Temp <80 °C en carga"
      ],
      "riesgo":"BAJO",
      "nivel":"Básico",
      "tiempo_min":20,
      "tags":["gpu","drivers","ddu","artefactos"]
    },
    {
      "id":"mb-no-post-cmos-bios",
      "departamento_id":"motherboard",
      "departamento":"Placa Madre / Chipset",
      "problema":"No da video / no POST",
      "causa":"CMOS corrupto o BIOS dañada",
      "solucion":[
        "Cortar corriente y retirar pila CMOS 5 min",
        "Presionar power 10 s",
        "Arrancar con 1 módulo RAM",
        "Actualizar BIOS por USB Flashback/Q-Flash"
      ],
      "verificacion":[
        "POST y códigos/LED normales"
      ],
      "riesgo":"MEDIO",
      "nivel":"Intermedio",
      "tiempo_min":15,
      "tags":["bios","cmos","post","motherboard"]
    },
    {
      "id":"psu-reinicio-carga",
      "departamento_id":"psu",
      "departamento":"Fuente de Poder (PSU)",
      "problema":"Reinicios bajo carga",
      "causa":"Rail 12V inestable o potencia insuficiente",
      "solucion":[
        "Leer voltajes con HWInfo (rango 11.4–12.6 V)",
        "Probar otra PSU confiable",
        "Revisar conectores PCIe/CPU"
      ],
      "verificacion":[
        "OCCT Power 30 min sin reinicios"
      ],
      "riesgo":"ALTO",
      "nivel":"Intermedio",
      "tiempo_min":35,
      "tags":["psu","reinicios","12v","occt"]
    },
    {
      "id":"cooling-flujo-aire",
      "departamento_id":"cooling",
      "departamento":"Refrigeración",
      "problema":"Ruido/temperaturas altas por flujo invertido",
      "causa":"Ventiladores mal orientados o polvo",
      "solucion":[
        "Frontales IN, traseros/superiores OUT",
        "Limpiar filtros y ventiladores",
        "Reaplicar pasta si >2 años"
      ],
      "verificacion":[
        "Baja ≥10 °C vs. medición inicial"
      ],
      "riesgo":"BAJO",
      "nivel":"Básico",
      "tiempo_min":20,
      "tags":["cooling","flujo","ventiladores","polvo"]
    },
    {
      "id":"network-stack-reset-dns",
      "departamento_id":"network",
      "departamento":"Red y Conectividad",
      "problema":"Sin internet con adaptador activo",
      "causa":"Winsock/TCP-IP dañado o DNS caído",
      "solucion":[
        "CMD admin:",
        "netsh winsock reset",
        "netsh int ip reset",
        "ipconfig /flushdns",
        "ipconfig /release",
        "ipconfig /renew",
        "Reiniciar"
      ],
      "verificacion":[
        "ping 8.8.8.8 OK",
        "ping google.com OK"
      ],
      "riesgo":"BAJO",
      "nivel":"Básico",
      "tiempo_min":5,
      "tags":["dns","winsock","ipconfig","red"]
    },
    {
      "id":"os-sfc-dism-startup",
      "departamento_id":"os",
      "departamento":"Sistema Operativo",
      "problema":"Inicio lento / archivos corruptos",
      "causa":"Servicios al arranque o corrupción del sistema",
      "solucion":[
        "CMD admin: sfc /scannow",
        "DISM /Online /Cleanup-Image /RestoreHealth",
        "Desactivar programas de Inicio (Administrador de tareas)"
      ],
      "verificacion":[
        "Boot < 45 s",
        "Eventos sin errores críticos"
      ],
      "riesgo":"BAJO",
      "nivel":"Básico",
      "tiempo_min":20,
      "tags":["sfc","dism","startup","windows"]
    },
    {
      "id":"security-restore-imagen",
      "departamento_id":"security",
      "departamento":"Seguridad y Backups",
      "problema":"Windows no arranca tras actualización",
      "causa":"Archivos del sistema dañados",
      "solucion":[
        "Boot USB instalación → Reparar",
        "Si falla: restaurar imagen (Macrium/Clonezilla)",
        "Política: imagen cada 30 días"
      ],
      "verificacion":[
        "Arranque normal",
        "Checksum de imagen OK"
      ],
      "riesgo":"MEDIO",
      "nivel":"Intermedio",
      "tiempo_min":30,
      "tags":["backup","macrium","clonezilla","restore"]
    }
  ]
};

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
        "diskpart","list disk","select disk X","clean","convert gpt","create partition primary","format fs=ntfs quick","assign"
      ]
    },
    {
      "id":"almacenamiento-raw-chkdsk",
      "departamento_id":"almacenamiento",
      "departamento":"Almacenamiento",
      "problema":"Partición aparece como RAW / no se puede abrir",
      "causa":"Tabla de archivos dañada (NTFS) por apagado brusco o sectores inestables",
      "solucion":[
        "CMD admin",
        "chkdsk X: /f /r",
        "Esperar reparación. Si falla: copiar datos críticos y formatear",
        "Post: ejecutar CrystalDiskInfo y verificar SMART"
      ],
      "verificacion":["Unidad vuelve a NTFS","SMART sin sectores reasignados crecientes"],
      "riesgo":"MEDIO",
      "nivel":"Intermedio",
      "tiempo_min":60,
      "tags":["raw","ntfs","chkdsk","corrupcion","smart"]
    },
    {
      "id":"almacenamiento-trim-ssd",
      "departamento_id":"almacenamiento",
      "departamento":"Almacenamiento",
      "problema":"SSD lento por falta de TRIM",
      "causa":"TRIM deshabilitado",
      "solucion":[
        "CMD admin",
        "fsutil behavior query DisableDeleteNotify   // 0 = activo",
        "Si devuelve 1: fsutil behavior set DisableDeleteNotify 0"
      ],
      "verificacion":["fsutil → 0","Rendimiento estable"],
      "riesgo":"BAJO",
      "nivel":"Básico",
      "tiempo_min":5,
      "tags":["ssd","trim","rendimiento"]
    },
    {
      "id":"almacenamiento-nvme-throttle",
      "departamento_id":"almacenamiento",
      "departamento":"Almacenamiento",
      "problema":"NVMe baja velocidad tras segundos de copia",
      "causa":"Throttling térmico o caché SLC agotada",
      "solucion":[
        "Monitorear temperatura con HWInfo",
        "Si >70 °C: agregar disipador/airflow",
        "Actualizar firmware NVMe"
      ],
      "verificacion":["Temp <70 °C","Velocidad estable"],
      "riesgo":"BAJO","nivel":"Intermedio","tiempo_min":20,
      "tags":["nvme","throttling","disipador"]
    },
    {
      "id":"almacenamiento-clonado-mbr-gpt",
      "departamento_id":"almacenamiento",
      "departamento":"Almacenamiento",
      "problema":"Disco clonado no arranca (MBR ↔ GPT)",
      "causa":"Tipo de partición incompatible con modo UEFI/Legacy",
      "solucion":[
        "Verificar BIOS modo UEFI o Legacy",
        "Si UEFI: convertir destino a GPT",
        "mbr2gpt /validate /allowFullOS",
        "mbr2gpt /convert /allowFullOS"
      ],
      "verificacion":["Arranque correcto según modo BIOS"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":15,
      "tags":["clonado","mbr","gpt","uefi","legacy"]
    },
    {
      "id":"ram-xmp-inestable",
      "departamento_id":"ram",
      "departamento":"Memoria RAM",
      "problema":"Pantallazos azules aleatorios (XMP/EXPO inestable)",
      "causa":"Perfil de overclock automático inestable o mezcla de módulos",
      "solucion":[
        "Entrar a BIOS/UEFI","Desactivar XMP/EXPO","Si estabiliza: bajar frecuencia -200 MHz o subir DRAM Voltage +0.05 V","Probar MemTest86 mínimo 4 pasadas"
      ],
      "verificacion":["0 errores en MemTest86","Sistema estable 1h"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":30,"tags":["ram","xmp","expo","bsod"]
    },
    {
      "id":"cpu-overheat-throttling",
      "departamento_id":"cpu","departamento":"CPU",
      "problema":"Temperaturas >95°C y throttling",
      "causa":"Pasta térmica seca o disipador mal ajustado",
      "solucion":["Limpiar y reaplicar pasta","Asegurar presión","Verificar RPM en BIOS"],
      "verificacion":["Idle <45 °C","Carga <85 °C"],
      "riesgo":"MEDIO","nivel":"Básico","tiempo_min":25,"tags":["cpu","temperatura","pasta"]
    },
    {
      "id":"gpu-ddu-driver-clean",
      "departamento_id":"gpu","departamento":"GPU",
      "problema":"Artefactos o pantallazos negros por drivers corruptos",
      "causa":"Instalaciones superpuestas o dañadas",
      "solucion":["Descargar DDU","Modo seguro","Limpiar e instalar driver WHQL"],
      "verificacion":["Bench sin cierres","Temp <80 °C"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":20,"tags":["gpu","drivers","ddu"]
    },
    {
      "id":"mb-no-post-cmos-bios",
      "departamento_id":"motherboard","departamento":"Placa Madre / Chipset",
      "problema":"No da video / no POST",
      "causa":"CMOS corrupto o BIOS dañada",
      "solucion":["Quitar pila CMOS 5 min","Presionar power 10 s","Arrancar con 1 módulo","Actualizar BIOS"],
      "verificacion":["POST normal"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":15,"tags":["bios","cmos","post"]
    },
    {
      "id":"psu-reinicio-carga",
      "departamento_id":"psu","departamento":"Fuente de Poder (PSU)",
      "problema":"Reinicios bajo carga",
      "causa":"Rail 12V inestable o potencia insuficiente",
      "solucion":["Medir voltajes HWInfo (11.4–12.6 V)","Probar otra PSU","Revisar conectores"],
      "verificacion":["OCCT Power 30 min sin reinicios"],
      "riesgo":"ALTO","nivel":"Intermedio","tiempo_min":35,"tags":["psu","reinicios"]
    },
    {
      "id":"cooling-flujo-aire",
      "departamento_id":"cooling","departamento":"Refrigeración",
      "problema":"Ruido/temperaturas altas por flujo invertido",
      "causa":"Ventiladores mal orientados o polvo",
      "solucion":["Frontales IN, traseros/superiores OUT","Limpiar filtros","Reaplicar pasta"],
      "verificacion":["Baja ≥10 °C vs inicial"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":20,"tags":["cooling","ventiladores"]
    },
    {
      "id":"network-stack-reset-dns",
      "departamento_id":"network","departamento":"Red y Conectividad",
      "problema":"Sin internet con adaptador activo",
      "causa":"Winsock/TCP-IP dañado o DNS caído",
      "solucion":["netsh winsock reset","netsh int ip reset","ipconfig /flushdns","ipconfig /release","ipconfig /renew"],
      "verificacion":["ping 8.8.8.8 OK","ping google.com OK"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":5,"tags":["dns","winsock","ipconfig"]
    },
    {
      "id":"network-gigabit-limited",
      "departamento_id":"network","departamento":"Red y Conectividad",
      "problema":"Velocidad limitada a 100 Mbps por cable",
      "causa":"Cableado o negociación forzada",
      "solucion":["Probar otro cable Cat5e/6","Auto negociación","Verificar LEDs de Gbps"],
      "verificacion":["Speedtest ~900 Mbps","LED 1000 Mbps"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":10,"tags":["gigabit","duplex"]
    },
    {
      "id":"network-wifi-drops",
      "departamento_id":"network","departamento":"Red y Conectividad",
      "problema":"Cortes de WiFi intermitentes",
      "causa":"Interferencia o ahorro de energía",
      "solucion":["Fijar canal limpio (1/6/11 o DFS)","Desactivar ahorro en adaptador","Actualizar driver"],
      "verificacion":["Ping estable sin pérdidas"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":15,"tags":["wifi","canal","energia"]
    },
    {
      "id":"os-sfc-dism-startup",
      "departamento_id":"os","departamento":"Sistema Operativo",
      "problema":"Inicio lento / archivos corruptos",
      "causa":"Servicios o corrupción de sistema",
      "solucion":["sfc /scannow","DISM /RestoreHealth","Desactivar programas inicio"],
      "verificacion":["Boot <45 s","Eventos sin errores"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":20,"tags":["sfc","dism","windows"]
    },
    {
      "id":"os-bootrec-reparar-arranque",
      "departamento_id":"os","departamento":"Sistema Operativo",
      "problema":"Windows no arranca (loop reparación)",
      "causa":"MBR/BCD dañados",
      "solucion":["bootrec /fixmbr","bootrec /fixboot","bootrec /rebuildbcd","bootsect /nt60 sys"],
      "verificacion":["Sistema arranca"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":15,"tags":["bootrec","arranque","bcd"]
    },
    {
      "id":"os-wupdate-reset-componentes",
      "departamento_id":"os","departamento":"Sistema Operativo",
      "problema":"Windows Update atascado (0%, 99%)",
      "causa":"Componentes corruptos",
      "solucion":["net stop wuauserv","net stop bits","ren C:\\Windows\\SoftwareDistribution .old","ren C:\\Windows\\System32\\catroot2 catroot2.old","net start wuauserv","net start bits"],
      "verificacion":["Update funcional"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":10,"tags":["update","bits","wuauserv"]
    },
    {
      "id":"os-desinstalar-actualizacion-problematica",
      "departamento_id":"os","departamento":"Sistema Operativo",
      "problema":"Falla tras última actualización",
      "causa":"Parche incompatible",
      "solucion":["wusa /uninstall /kb:XXXXXXX /quiet /norestart"],
      "verificacion":["Sistema estable"],
      "riesgo":"BAJO","nivel":"Básico","tiempo_min":10,"tags":["actualizacion","rollback"]
    },
    {
      "id":"security-restore-imagen",
      "departamento_id":"security","departamento":"Seguridad y Backups",
      "problema":"Windows no arranca tras actualización",
      "causa":"Archivos dañados",
      "solucion":["Boot USB → Reparar","Restaurar imagen (Macrium/Clonezilla)"],
      "verificacion":["Arranque normal"],
      "riesgo":"MEDIO","nivel":"Intermedio","tiempo_min":30,"tags":["backup","restore"]
    }
  ]
};

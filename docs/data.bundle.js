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
      "departamento_id_

};

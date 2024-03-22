import json
import glob

# Crear una lista vacía para almacenar todos los textos de las leyendas
all_captions = []

# Obtener la lista de archivos JSON que contienen "allPosts" en el nombre
json_files = glob.glob('*allPosts*.json')

# Iterar sobre cada archivo JSON
for file_path in json_files:
    try:
       
        # Abrir el archivo JSON y cargar su contenido
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Recorrer todos los elementos en 'reply_threads'
        for reply_thread in data['reply_threads']:
            # Recorrer todos los elementos en 'thread_items' para cada 'reply_thread'
            for thread_item in reply_thread['thread_items']:
                # Intentar acceder al texto de la leyenda
                try:
                    caption_text = thread_item['post']['caption']['text']
                    with open('output.txt', 'a', encoding='utf-8') as output_file:
                        output_file.write(caption_text + '\n')
                except (TypeError, KeyError):
                    # Si 'post', 'caption', o 'text' no existen, o si 'caption' es None, continuar con el siguiente elemento
                    continue
    except Exception as e:
        print(f"Error al procesar el archivo {file_path}: {e}")
        continue
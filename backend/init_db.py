import sqlite3

# Conectar ao banco (cria o arquivo se não existir)
conn = sqlite3.connect("ecommerce.db")
cursor = conn.cursor()

# Criar tabela de produtos
cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    image_url TEXT
)
""")

conn.commit()
conn.close()

print("✅ Banco de dados e tabela 'products' criados com sucesso!")

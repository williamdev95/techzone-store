import sqlite3

# Conectar ao banco
conn = sqlite3.connect("ecommerce.db")
cursor = conn.cursor()

# Lista de produtos para inserir
products = [
    {
        "name": "Notebook Gamer",
        "description": "Notebook potente para jogos",
        "price": 4500.00,
        "stock": 10,
        "image_url": "notebookgamer.jpeg"
    },
    {
        "name": "Mouse sem fio",
        "description": "Mouse ergonômico com sensor óptico",
        "price": 120.00,
        "stock": 50,
        "image_url": "mouse.jpeg"
    },
    {
        "name": "Teclado Mecânico",
        "description": "Teclado RGB com switches azuis",
        "price": 350.00,
        "stock": 30,
        "image_url": "teclado.jpeg"
    },
    {
        "name": "Monitor 24''",
        "description": "Monitor Full HD com ajuste de altura",
        "price": 900.00,
        "stock": 15,
        "image_url": "monitor.jpeg"
    }
]

# Inserir produtos na tabela 'products'
for product in products:
    cursor.execute(
        "INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)",
        (product["name"], product["description"], product["price"], product["stock"], product["image_url"])
    )

conn.commit()
conn.close()

print("✅ Produtos inseridos com sucesso!")

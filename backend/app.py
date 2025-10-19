from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# Caminho completo da pasta de imagens
IMAGE_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'images')

# Rota para servir as imagens
@app.route('/images/<path:filename>')
def serve_image(filename):
    file_path = os.path.join(IMAGE_FOLDER, filename)
    if os.path.exists(file_path):
        return send_from_directory(IMAGE_FOLDER, filename)
    else:
        return jsonify({"error": f"Imagem {filename} não encontrada."}), 404

# Rota para listar produtos
@app.route('/products')
def get_products():
    conn = sqlite3.connect('ecommerce.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, description, price, stock, image_url FROM products")
    rows = cursor.fetchall()
    conn.close()

    products = []
    for row in rows:
        image_name = row[5]
        image_url = f"http://127.0.0.1:5000/images/{image_name}" if image_name else None

        products.append({
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "price": row[3],
            "stock": row[4],
            "image_url": image_url
        })

    return jsonify(products)

if __name__ == "__main__":
    print(f"📸 Servindo imagens da pasta: {IMAGE_FOLDER}")
    app.run(debug=True)

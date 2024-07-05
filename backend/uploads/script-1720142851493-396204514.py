from PIL import Image, ImageEnhance
import os
import sys

def apply_blue_filter(image_path):
    # Ouvrir l'image
    image = Image.open(image_path)

    # Convertir l'image en mode RGB
    image = image.convert("RGB")

    # Créer une image bleue de la même taille
    blue_image = Image.new("RGB", image.size, (0, 0, 255))

    # Mélanger les deux images
    blended_image = Image.blend(image, blue_image, alpha=0.3)  # Adjust alpha for more or less blue

    # Enregistrer l'image résultante
    blended_image.save("output.png")

    print("Filtre bleu appliqué avec succès.")

if __name__ == "__main__":
    image_path = sys.argv[1]
    print("Chemin de l'image :", image_path)
    apply_blue_filter(image_path)
    
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Lister les fichiers dans le même répertoire que le script
    files_in_dir = os.listdir(script_dir)
    print("Fichiers dans le répertoire du script :")
    for file in files_in_dir:
        print(file)
from PIL import Image
import os

logo_path = 'frontend/public/logo.png'
sizes = [
    (48, 'frontend/android/app/src/main/res/mipmap-mdpi/ic_launcher.png'),
    (72, 'frontend/android/app/src/main/res/mipmap-hdpi/ic_launcher.png'),
    (96, 'frontend/android/app/src/main/res/mipmap-xhdpi/ic_launcher.png'),
    (144, 'frontend/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png'),
    (192, 'frontend/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')
]

logo = Image.open(logo_path)
for size, output_path in sizes:
    resized_logo = logo.resize((size, size), Image.LANCZOS)
    resized_logo.save(output_path)

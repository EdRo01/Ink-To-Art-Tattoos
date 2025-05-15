<?php
// Simpele wachtwoordbeveiliging (vervang 'jasper123' door een sterk wachtwoord)
session_start();
if (!isset($_SESSION['logged_in'])) {
    if (isset($_POST['password']) && $_POST['password'] === 'jasper123') {
        $_SESSION['logged_in'] = true;
    } else {
        echo '
        <!DOCTYPE html>
        <html lang="nl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ink To Art Tattoos - Inloggen</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <main class="max-w-4xl mx-auto p-4">
            <h1 class="text-2xl sm:text-4xl font-bold mt-6 text-center gold-text">Inloggen</h1>
            <p class="mt-4 text-lg sm:text-xl text-center text-white">Voer het wachtwoord in om foto\'s te uploaden.</p>
            <form method="post" class="text-center mt-6">
              <input type="password" name="password" class="mb-4 p-2 rounded text-black" placeholder="Wachtwoord">
              <br>
              <button type="submit" class="bg-gold text-black px-4 py-2 rounded hover:bg-yellow-600">Inloggen</button>
            </form>
          </main>
        </body>
        </html>';
        exit;
    }
}

// Map waar de foto's worden opgeslagen
$upload_dir = 'uploads/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

// Controleer of er bestanden zijn geüpload
if (isset($_FILES['photos'])) {
    $files = $_FILES['photos'];
    $uploaded_files = [];

    // Loop door alle geüploade bestanden
    for ($i = 0; $i < count($files['name']); $i++) {
        $file_name = $files['name'][$i];
        $file_tmp = $files['tmp_name'][$i];
        $file_size = $files['size'][$i];
        $file_error = $files['error'][$i];

        // Controleer op uploadfouten
        if ($file_error === UPLOAD_ERR_OK) {
            // Controleer bestandstype (alleen afbeeldingen toestaan)
            $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
            $file_type = mime_content_type($file_tmp);
            if (in_array($file_type, $allowed_types)) {
                // Controleer bestandsgrootte (max 5MB)
                if ($file_size <= 5 * 1024 * 1024) {
                    // Unieke bestandsnaam genereren
                    $new_file_name = uniqid() . '-' . $file_name;
                    $destination = $upload_dir . $new_file_name;

                    // Verplaats het bestand naar de uploadmap
                    if (move_uploaded_file($file_tmp, $destination)) {
                        $uploaded_files[] = $new_file_name;
                    } else {
                        echo "<p>Fout bij het uploaden van $file_name.</p>";
                    }
                } else {
                    echo "<p>$file_name is te groot (max 5MB).</p>";
                }
            } else {
                echo "<p>$file_name is geen geldig afbeeldingsbestand.</p>";
            }
        } else {
            echo "<p>Fout bij het uploaden van $file_name.</p>";
        }
    }

    // Feedback aan Jasper
    echo '
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ink To Art Tattoos - Upload Resultaat</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <main class="max-w-4xl mx-auto p-4">
        <h1 class="text-2xl sm:text-4xl font-bold mt-6 text-center gold-text">Upload Resultaat</h1>';
    if (!empty($uploaded_files)) {
        echo '<p class="mt-4 text-lg sm:text-xl text-center text-white">De volgende foto\'s zijn succesvol geüpload:</p>';
        foreach ($uploaded_files as $file) {
            echo "<p class='text-center text-white'>$file</p>";
        }
    } else {
        echo '<p class="mt-4 text-lg sm:text-xl text-center text-white">Geen foto\'s geüpload.</p>';
    }
    echo '<p class="mt-4 text-center"><a href="upload.html" class="text-gold underline hover:text-yellow-600">Terug naar uploaden</a></p>';
    echo '</main>
    </body>
    </html>';
}
?>
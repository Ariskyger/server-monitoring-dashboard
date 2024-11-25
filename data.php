<?php
error_reporting(E_ALL); // Aktiviert die Fehlerberichterstattung
ini_set('display_errors', 1); // Zeigt Fehler an

$data = file_get_contents("data.json"); // JSON-Daten lesen

header('Content-Type: application/json'); // JSON-Header setzen
echo $data; // Daten ausgeben
?>

<?php
header("Content-Type: text/plain");

$drivers = PDO::getAvailableDrivers();

echo "Available PDO drivers:\n";
print_r($drivers);

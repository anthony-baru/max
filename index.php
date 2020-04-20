<?php
$conn=mysqli_connect('localhost', 'root', '', 'max');

$url = 'data/products.json'; // path to your JSON file
$data = file_get_contents($url); // put the contents of the file into a variable
$characters = json_decode($data); // decode the JSON feed

foreach ($characters as $character) {
    $query = "INSERT INTO products(`title`,`price`,`description`,`imageUrl`) 
                            VALUES('$character->title',
                            '$character->price',
                           ' $character->description',
                            '$character->imageUrl') ";
    $insert= mysqli_query($conn, $query);
    if ($insert) {
        echo $character->title .' inserted successfully!!!'. '<br>';
    } else {
        echo mysqli_error($conn). '<br>';
    }
}

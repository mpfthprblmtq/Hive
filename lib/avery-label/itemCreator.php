<?php 

class Item{
	public $id;
	public $name;
	public $building;
	public $room;
	public $subroom;
	public $shelfUnit;
	public $shelf;
}

function createItemArray($num){
	$itemArray = array();
	for($i = 0; $i < $num; $i++){
		$item = new Item;
		$item->id = "00000" . $i;
		$item->name = generateRandomString(15);
		$item->building = "FH";
		$item->room = rand(1, 5);
		$item->subroom = rand(400, 410);
		$item->shelfUnit = rand(1,5);
		$item->shelf = rand(1,5);
		array_push($itemArray, $item);
	}
	return $itemArray;
}

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

?>
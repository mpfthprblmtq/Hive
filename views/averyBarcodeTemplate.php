<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Hive Resource Manager Label Template</title>
    <link href="../css/labels.css?<?php echo time(); ?>" rel="stylesheet" type="text/css" >
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
	<script type="text/javascript" src="../lib/barcode_gen/jquery-barcode.js"></script>
</head>
<div id="itemsToAdd" style="display: none;"><?php echo $_POST["labels"] ?></div>
<input id="offset" type="text" value="<?php echo htmlspecialchars($_POST["oSet"]) ?>" hidden>
<body>
</body>

<script type="text/javascript" src="../js/createBarcodeLabels.js?<?php echo time(); ?>"></script>
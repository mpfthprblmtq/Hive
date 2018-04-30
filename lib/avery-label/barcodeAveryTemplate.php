<?php Include("itemCreator.php"); ?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Hive Resource Manager Label Template</title>
    <link href="labels.css?<?php echo time(); ?>" rel="stylesheet" type="text/css" >
</head>
<div id="itemsToAdd" style="display: none;"><?php echo json_encode(createItemArray(30)); ?></div>
<input id="offset" type="text" value="<?php echo htmlspecialchars($_POST["offset"]) ?>" hidden>
<body>
</body>

<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script type="text/javascript" src="barcode_gen/jquery-barcode.js"></script>
<script type="text/javascript" src="createBarcodeLabels.js?<?php echo time(); ?>"></script>
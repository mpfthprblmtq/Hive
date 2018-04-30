<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Barcode Creator®</title>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

    <link href="labelModal.css?<?php echo time(); ?>" rel="stylesheet" type="text/css" >
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div>
                <!-- <form> -->
                <form id="labelForm" action="barcodeAveryTemplate.php" method="post" target="_blank">
                   <center>
                        <h2>Item objects are randomly generate in the background</h2>
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#sheetLayoutModal">Submit</button>
                   </center>
                    <input type="text" id="offset" name="offset" value="" hidden>
                </form>
            </div>
        </div>
    </div>
</body>

<!-- Modal -->
<div class="modal fade" id="sheetLayoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Select a Label Starting Point</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <?php 
             for($i = 0; $i < 30; ++$i){
                 echo "<div class='label' id='".$i."' > </div>";
            }
        ?>
      </div>
      <div class="modal-footer" style="clear: left;">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button id="modalSubmit" type="button" class="btn btn-primary">Print</button>
      </div>
    </div>
  </div>
</div>

</html>

<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script type="text/javascript" src="labelModal.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
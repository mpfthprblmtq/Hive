<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Barcode Creator®</title>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
</head>
<body>
<div class="container-fluid">
<div class="row">
<div class="col-md-8">
    <form>
        <div class="form-group">
            <label for="itemIdNum">Email address</label>
            <input type="text" class="form-control" id="itemIdNum" placeholder="ID Number">
        </div>
        <div class="form-group">
            <label for="itemDesc">Password</label>
            <input type="text" class="form-control" id="itemDesc" placeholder="Description">
        </div>
        <div class="form-group">
            <label for="roomSelect">Room</label>
            <select id="roomSelect" class="form-control">
                <option>Dungeon</option>
                <option>Mini Dungeon</option>
                <option>Literary Center</option>
            </select>
        </div>
        <div class="form-group">
            <label for="unitSelect">Unit</label>
            <select id="unitSelect" class="form-control">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
        </div>
        <div class="form-group">
            <label for="shelfSelect">Shelf</label>
            <select id="shelfSelect" class="form-control">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
    </form>
    </div>
    </div>
    </div>
</body>
</html>

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
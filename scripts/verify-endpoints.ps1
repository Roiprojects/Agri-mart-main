$endpoints = @(
  @{ Name = "Frontend Home"; Url = "http://localhost:3010/" },
  @{ Name = "Frontend Shop"; Url = "http://localhost:3010/shop" },
  @{ Name = "Frontend Rentals"; Url = "http://localhost:3010/rentals" },
  @{ Name = "Frontend Services"; Url = "http://localhost:3010/services" },
  @{ Name = "Frontend Services Book"; Url = "http://localhost:3010/services/book" },
  @{ Name = "Frontend Crop Guidance"; Url = "http://localhost:3010/crop-guidance" },
  @{ Name = "Frontend Gallery"; Url = "http://localhost:3010/gallery" },
  @{ Name = "Frontend Blog"; Url = "http://localhost:3010/blog" },
  @{ Name = "Backend Admin Dashboard"; Url = "http://localhost:3011/admin" },
  @{ Name = "Backend Admin Products"; Url = "http://localhost:3011/admin/catalogue/products" },
  @{ Name = "Backend Admin Categories"; Url = "http://localhost:3011/admin/catalogue/categories" },
  @{ Name = "Backend Admin Orders"; Url = "http://localhost:3011/admin/orders" },
  @{ Name = "Backend Admin Rentals"; Url = "http://localhost:3011/admin/rentals" },
  @{ Name = "Backend Admin Services"; Url = "http://localhost:3011/admin/services" },
  @{ Name = "Backend Admin Crop Guidance"; Url = "http://localhost:3011/admin/content/crop-guidance" },
  @{ Name = "Backend Admin Gallery"; Url = "http://localhost:3011/admin/content/gallery" },
  @{ Name = "Backend Admin Blog"; Url = "http://localhost:3011/admin/content/blog" },
  @{ Name = "Backend Finance Portal"; Url = "http://localhost:3011/finance" },
  @{ Name = "Backend Procurement Portal"; Url = "http://localhost:3011/procurement" },
  @{ Name = "Backend Repairs Portal"; Url = "http://localhost:3011/repairs" },
  @{ Name = "Backend Sales CRM"; Url = "http://localhost:3011/sales" },
  @{ Name = "Backend Dark Warehouse"; Url = "http://localhost:3011/warehouse" }
)

Write-Host "Verifying endpoints..."
$results = @()
foreach ($ep in $endpoints) {
  try {
    $res = Invoke-WebRequest -Uri $ep.Url -UseBasicParsing -TimeoutSec 15
    $status = $res.StatusCode
    $len = $res.Content.Length
    $results += [PSCustomObject]@{
      Name = $ep.Name
      Url = $ep.Url
      Status = $status
      Length = $len
      State = "PASS"
    }
  } catch {
    $results += [PSCustomObject]@{
      Name = $ep.Name
      Url = $ep.Url
      Status = "ERR"
      Length = 0
      State = "FAIL: $($_.Exception.Message)"
    }
  }
}

$results | Format-Table -AutoSize

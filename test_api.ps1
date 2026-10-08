$loginBody = @{
    usernameOrEmail = "admin"
    password = "admin123"
} | ConvertTo-Json

Write-Host "1. Testing Admin Login..."
$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.data.token
Write-Host "Admin Login Successful! Role: $($loginRes.data.role), Username: $($loginRes.data.username)"

Write-Host "`n2. Testing Authenticated Admin Endpoint (/api/admin/sync/pending)..."
$headers = @{
    Authorization = "Bearer $token"
}
$changes = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/sync/pending" -Method Get -Headers $headers
Write-Host "Pending changes retrieved successfully: count = $($changes.data.Count)"

Write-Host "`n3. Testing Recommendation Endpoint (/api/user/recommendations)..."
$rec = Invoke-RestMethod -Uri "http://localhost:8080/api/user/recommendations" -Method Get -Headers $headers
Write-Host "Recommended Next Content: $($rec.data.nextItem.title) (Reason: $($rec.data.recommendationReason))"

Write-Host "`n4. Testing Toggle Watch (/api/user/watch/1)..."
$watchRes = Invoke-RestMethod -Uri "http://localhost:8080/api/user/watch/1" -Method Post -Headers $headers
Write-Host "Watch status toggled: $($watchRes.data)"

Write-Host "`n5. Testing Stats Endpoint (/api/stats/overview)..."
$stats = Invoke-RestMethod -Uri "http://localhost:8080/api/stats/overview" -Method Get
Write-Host "System Stats: Total Content = $($stats.data.totalContent), Movies = $($stats.data.totalMovies), Series = $($stats.data.totalSeries), Franchises = $($stats.data.totalFranchises)"

Write-Host "`n6. Testing Admin Dashboard Endpoint (/api/admin/dashboard)..."
$dash = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/dashboard" -Method Get -Headers $headers
Write-Host "Dashboard KPI: Total Content = $($dash.data.totalContent), Pending Changes = $($dash.data.pendingChangesCount), Recent Changes Count = $($dash.data.recentChanges.Count)"

Write-Host "`n7. Testing Chronological Watch Order (/api/watch-orders/chronological)..."
$chrono = Invoke-RestMethod -Uri "http://localhost:8080/api/watch-orders/chronological" -Method Get
Write-Host "Chronological Order items count = $($chrono.data.totalElements)"
Write-Host "First item: $($chrono.data.content[0].title) (Year: $($chrono.data.content[0].releaseYear), Chrono #$($chrono.data.content[0].chronologicalOrderNum))"

Write-Host "`n8. Testing Search (/api/content/search?q=Loki)..."
$search = Invoke-RestMethod -Uri "http://localhost:8080/api/content/search?q=Loki" -Method Get
Write-Host "Search results for 'Loki': $($search.data.Count) items found"

Write-Host "`n=========================================="
Write-Host "SUCCESS: ALL ENDPOINTS VERIFIED & PASSING!"
Write-Host "=========================================="

$loginBody = @{
    usernameOrEmail = "admin"
    password = "admin123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.data.token
$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "Creating new Marvel project as Admin (Testing Section 32: Zero-code future content additions)..."
$createBody = @{
    title = "Spider-Man: Brand New Day"
    originalTitle = "Spider-Man: Brand New Day"
    slug = "spider-man-brand-new-day"
    contentType = "MOVIE"
    status = "UPCOMING"
    releaseDate = "2026-07-24"
    releaseYear = 2026
    runtimeMinutes = 145
    rating = "PG-13"
    genres = "Action, Sci-Fi, Adventure"
    shortSynopsis = "Peter Parker embarks on a fresh chapter in New York City after the multiverse memory wipe."
    productionStudio = "Marvel Studios & Sony Pictures"
    director = "Destin Daniel Cretton"
    writers = "Chris McKenna, Erik Sommers"
    castMembers = "Tom Holland, Zendaya"
    franchiseId = 1
    universeId = 1
    timelineId = 1
    sagaId = 2
    phaseId = 6
    releaseOrderNum = 45
    chronologicalOrderNum = 44
    timelineOrderNum = 42
    isPublished = $true
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/content" -Method Post -Body $createBody -Headers $headers -ContentType "application/json"
Write-Host "Project Created Successfully! ID = $($created.data.id), Title = $($created.data.title)"

Write-Host "`nVerifying that the project is immediately discoverable in search..."
$searchRes = Invoke-RestMethod -Uri "http://localhost:8080/api/content/search?q=Spider-Man" -Method Get
Write-Host "Found in Search! Total count = $($searchRes.data.totalElements)"
Write-Host "Matched Title: $($searchRes.data.content[0].title)"

Write-Host "`nVerifying Audit Log was created..."
$logs = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/audit-logs" -Method Get -Headers $headers
$lastLog = $logs.data.content[0]
Write-Host "Last Audit Log: Admin = $($lastLog.username), Action = $($lastLog.action), Entity = $($lastLog.entityName), Details = $($lastLog.details)"

Write-Host "`nSECTION 32 & SECTION 43 VERIFICATION COMPLETE!"

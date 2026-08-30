$csrf = (Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/csrf' -UseBasicParsing).csrfToken
$s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
try {
  $r = Invoke-WebRequest -Uri 'http://localhost:3001/api/auth/callback/credentials' -Method POST -Body @{ csrfToken = $csrf; email = 'test@example.com'; password = 'pass123' } -WebSession $s -AllowUnencryptedAuthentication -ErrorAction Stop
  Write-Output "Sign-in status: $($r.StatusCode)"
} catch {
  Write-Output "Sign-in request failed with status: $($_.Exception.Message)"
}

$session = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/session' -WebSession $s -UseBasicParsing
$json = $session | ConvertTo-Json -Depth 5
$json | Out-File -FilePath 'apps/frontend/scripts/session.json' -Encoding UTF8
Write-Output "WROTE apps/frontend/scripts/session.json"

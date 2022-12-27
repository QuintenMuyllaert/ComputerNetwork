$s3Name = "ComputerNetwork"
$projectName = "www"

#check if Q:\ is mapped
$drive = Get-PSDrive -Name Q -ErrorAction SilentlyContinue
$wasItMapped = $true
if ($null -eq $drive) {
    $wasItMapped = $false

    #if not, map it using S3 Tools
    start-process "rclone" -ArgumentList "mount ${s3Name}: Q:"

    #wait for the drive to be mapped
    $drive = Get-PSDrive -Name Q -ErrorAction SilentlyContinue

    while ($null -eq $drive) {
        Start-Sleep -Seconds 1
        $drive = Get-PSDrive -Name Q -ErrorAction SilentlyContinue
    }
}

#save the current directory
$workingDir = Get-Location

Set-Location Q:\

$s3Name =(Get-ChildItem | Select-Object -First 1)

Set-Location $s3Name

#check if $projectName directory exists, if not, create it
if (!(Test-Path "${projectName}")) {
    New-Item -ItemType Directory -Path "${projectName}"
}

#cd back to the original directory
Set-Location $workingDir

#copy build files into $projectName directory
Copy-Item -Path "build\*" -Destination "Q:\${s3Name}\${projectName}" -Recurse -Force

if (!$wasItMapped) {
    #unmount the drive by killing the process
    Stop-Process -Name "rclone"

    #wait for the drive to be unmounted
    $drive = Get-PSDrive -Name Q -ErrorAction SilentlyContinue

    while ($null -ne $drive) {
        Start-Sleep -Seconds 1
        $drive = Get-PSDrive -Name Q -ErrorAction SilentlyContinue
    }
}

#tell the user that the deployment is complete and thank them
Write-Host "Deployment complete. Thank you."
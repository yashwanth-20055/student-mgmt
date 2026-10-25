file { 'C:/student-app':
  ensure => directory,
}

file { 'C:/student-app/app.conf':
  ensure  => file,
  content => "ENVIRONMENT=dev\nREGISTRY=docker.io\nREPLICAS=2\n",
  require => File['C:/student-app'],
}

exec { 'set-env-var':
  command => 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -Command "[Environment]::SetEnvironmentVariable(\'STUDENT_APP_ENV\',\'dev\',\'User\')"',
  unless  => 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -Command "if ([Environment]::GetEnvironmentVariable(\'STUDENT_APP_ENV\',\'User\') -eq \'dev\') { exit 0 } else { exit 1 }"',
}
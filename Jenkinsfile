pipeline {
  agent any
  triggers { githubPush() }
  environment {
    IMAGE = 'yashwanth200526/student-mgmt'
    TAG   = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
  }
  options { timestamps(); timeout(time: 20, unit: 'MINUTES') }

  stages {
    stage('Install') {
      steps { bat 'npm ci' }
    }
    stage('Test') {
      steps { bat 'npm test' }
    }
    stage('Docker Build') {
      steps { bat 'docker build --build-arg APP_VERSION=%TAG% -t %IMAGE%:%TAG% -t %IMAGE%:latest .' }
    }
    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub',
                         usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          powershell '$env:DH_PASS | docker login -u $env:DH_USER --password-stdin; if ($LASTEXITCODE -ne 0) { exit 1 }'
          bat 'docker push %IMAGE%:%TAG%'
          bat 'docker push %IMAGE%:latest'
        }
      }
    }
    stage('Deploy to Kubernetes') {
      when { branch 'main' }
      steps {
        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
          bat 'kubectl apply -f k8s/mongo.yaml'
          powershell '(Get-Content k8s/app.yaml -Raw) -replace "IMAGE_PLACEHOLDER", "${env:IMAGE}:${env:TAG}" | kubectl apply -f -; if ($LASTEXITCODE -ne 0) { exit 1 }'
          bat 'kubectl rollout status deployment/student-app --timeout=120s'
        }
      }
    }
    stage('Health Verification') {
      when { branch 'main' }
      steps {
        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
          bat 'kubectl delete pod smoke --ignore-not-found'
          bat 'kubectl run smoke --rm -i --restart=Never --image=curlimages/curl -- -fsS http://student-app/health'
        }
      }
    }
  }

  post {
    failure {
      script {
        if (env.BRANCH_NAME == 'main') {
          withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
            bat 'kubectl rollout undo deployment/student-app || exit /b 0'
          }
        }
      }
    }
    always { bat 'docker logout || exit /b 0' }
  }
}
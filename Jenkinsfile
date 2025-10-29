pipeline {
  agent any

  environment {
    AWS_REGION     = "ap-south-1"                  // change if needed
    ECR_REGISTRY   = "051101197314.dkr.ecr.${AWS_REGION}.amazonaws.com"

    // Jenkins credential IDs
    AWS_CREDS_ID   = "aws-creds"                  // AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
    ARGO_TOKEN_ID  = "argocd-token"               // ArgoCD API token stored in Jenkins

    ARGO_SERVER    = "https://3.110.212.118:8085"   // will update after argocd setup
    ARGO_APP_NAME  = "food-delivery-app"
  }

  triggers {
    pollSCM('@daily')  // fallback trigger, main trigger is push to main branch
  }

  stages {

    stage('Checkout') {
      when { branch 'main' }
      steps { checkout scm }
    }

    stage('Login to ECR') {
      steps {
        withCredentials([usernamePassword(credentialsId: AWS_CREDS_ID,
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
          sh """
            export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
            export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
            aws ecr get-login-password --region ${AWS_REGION} \
              | docker login --username AWS --password-stdin ${ECR_REGISTRY}
          """
        }
      }
    }

    stage('Build & Push All Services') {
      steps {
        script {
          def services = [
            "restaurant-service",
            "menu-service",
            "user-service",
            "cart-service",
            "order-service"
          ]

          services.each { svc ->
            dir("backend/${svc}") {
              sh """
                docker build -t ${svc}:latest .
                docker tag ${svc}:latest ${ECR_REGISTRY}/${svc}:latest
                docker push ${ECR_REGISTRY}/${svc}:latest
              """
            }
          }
        }
      }
    }

    stage('ArgoCD Sync') {
      steps {
        withCredentials([string(credentialsId: ARGO_TOKEN_ID, variable: 'ARGO_TOKEN')]) {
          sh """
            export ARGOCD_OPTS='--grpc-web'
            argocd login ${ARGO_SERVER} --username admin --password $ARGO_TOKEN --insecure
            argocd app sync ${ARGO_APP_NAME}
          """
        }
      }
    }
  }

  post {
    always {
      cleanWs()  // ← Move clean here to run AFTER build
    }
    success { echo "CI/CD completed successfully." }
    failure { echo "CI/CD failed. Check logs." }
  }
}

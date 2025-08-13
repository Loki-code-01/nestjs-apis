pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-app"
        CONTAINER_NAME = "my-app"
        PORT = "3000"
        ENV_FILE = ".env"
    }

    stages {
        stage('Pull Latest Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Loki-code-01/nestjs-apis.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker rm -f $CONTAINER_NAME || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d --name $CONTAINER_NAME --env-file $ENV_FILE -p $PORT:$PORT $IMAGE_NAME'
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! App is running on port $PORT"
        }
        failure {
            echo "❌ Deployment failed. Check Jenkins logs."
        }
    }
}

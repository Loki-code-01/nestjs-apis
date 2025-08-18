


pipeline {
    agent any

    environment {
        IMAGE_NAME = "postgres:15"
        CONTAINER_NAME = "postgres"
        PORT = "3000"
    }

    stages {
        stage('Pull Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Loki-code-01/nestjs-apis.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
                  docker stop $CONTAINER_NAME
                  docker rm $CONTAINER_NAME
                fi
                docker run -d --name $CONTAINER_NAME -p $PORT:3000 $IMAGE_NAME
                '''
            }
        }
    }
}

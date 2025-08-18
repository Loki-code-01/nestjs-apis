// pipeline {
//     agent any

//     environment {
//         IMAGE_NAME = "nestjs-app"        // <-- renamed, don't overwrite postgres image
//         CONTAINER_NAME = "nestjs-app"
//         PORT = "3000"
//     }

//     stages {
//         stage('Pull Code') {
//             steps {
//                 echo "===== Pulling latest code from GitHub ====="
//                 git branch: 'main', url: 'https://github.com/Loki-code-01/nestjs-apis.git'
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 echo "===== Starting Docker build ====="
//                 sh '''
//                 set -x   # enable bash debug
//                 docker build -t $IMAGE_NAME .
//                 echo "===== Docker image build finished ====="
//                 '''
//             }
//         }

//         stage('Deploy Container') {
//             steps {
//                 echo "===== Starting deployment ====="
//                 sh '''
//                 set -x
//                 if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
//                   echo "Stopping and removing existing container: $CONTAINER_NAME"
//                   docker stop $CONTAINER_NAME
//                   docker rm $CONTAINER_NAME
//                 else
//                   echo "No existing container found for $CONTAINER_NAME"
//                 fi

//                 echo "Running new container..."
//                 docker run -d --name $CONTAINER_NAME -p $PORT:3000 $IMAGE_NAME

//                 echo "===== Deployment completed ====="
//                 docker ps -a
//                 '''
//             }
//         }
//     }
// }






pipeline {
    agent any

    stages {
        stage('Pull Code') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/your-repo.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t my-app .'
            }
        }
        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p 3000:3000 --name my-app my-app'
            }
        }
    }
}
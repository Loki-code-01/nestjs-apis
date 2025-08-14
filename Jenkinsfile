pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-app"
        CONTAINER_NAME = "my-app"
        PORT = "3000"
        ENV_FILE = ".env"
        EC2_USER = "ubuntu"                // Change if different
        EC2_IP = "13.60.216.114"      // Replace with your EC2 public IP
        SSH_CREDENTIALS_ID = "ec2-ssh"     // The Jenkins credential ID for your EC2 private key
        APP_DIR = "/home/ubuntu/nestjs-apis" // Path in EC2 where code will be stored
    }

    stages {
        stage('Deploy to EC2') {
            steps {
                sshagent([SSH_CREDENTIALS_ID]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_IP << 'ENDSSH'
                        set -e
                        if [ ! -d "$APP_DIR" ]; then
                            git clone https://github.com/Loki-code-01/nestjs-apis.git $APP_DIR
                        fi
                        cd $APP_DIR
                        git pull origin main
                        docker build -t $IMAGE_NAME .
                        docker rm -f $CONTAINER_NAME || true
                        docker run -d --name $CONTAINER_NAME --env-file $ENV_FILE -p $PORT:$PORT $IMAGE_NAME
                        ENDSSH
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful on EC2! App is running on port $PORT"
        }
        failure {
            echo "❌ Deployment failed. Check Jenkins logs."
        }
    }
}
